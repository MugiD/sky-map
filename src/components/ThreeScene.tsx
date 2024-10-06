"use client"
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const ThreeScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);
    camera.position.z = 500;

    // Create stars with empty geometry initially
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
      size: 2.0,
      transparent: true,
      opacity: 0.8,
      vertexColors: true, // Enable vertex colors
      blending: THREE.AdditiveBlending
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Function to convert spherical coordinates (RA, Dec, distance) to Cartesian (x, y, z)
    const sphericalToCartesian = (ra: number, dec: number, distance: number) => {
      // Convert degrees to radians
      const raRad = (ra * Math.PI) / 180;
      const decRad = (dec * Math.PI) / 180;
      
      // Convert to Cartesian coordinates
      const x = distance * Math.cos(decRad) * Math.cos(raRad);
      const y = distance * Math.cos(decRad) * Math.sin(raRad);
      const z = distance * Math.sin(decRad);
      
      return { x, y, z };
    };

    // Function to calculate star color based on magnitude
    const calculateStarColor = (magnitude: number) => {
      // Normalize magnitude to a value between 0 and 1
      // Assuming magnitude range from -1 (brightest) to 6 (dimmest)
      const normalizedMag = Math.max(0, Math.min(1, (magnitude + 1) / 7));
      
      // Create a color gradient from white (bright stars) to blue (dim stars)
      return new THREE.Color(
        1 - normalizedMag * 0.5,  // R
        1 - normalizedMag * 0.5,  // G
        1                         // B
      );
    };

    // Fetch star data from FastAPI backend
    const fetchStarData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/stars?ra=180&dec=0&radius=1&limit=100`);
        const starData = await response.json();

        const starDataToIterate = JSON.parse(starData);
        
        const vertices: number[] = [];
        const colors: number[] = [];
        
        starDataToIterate.forEach((star: { parallax: number; ra: number; dec: number; magnitude: number; }) => {
          // Convert parallax to distance in parsecs (1000/parallax)
          const distance = 1000 / star.parallax;
          
          // Convert coordinates
          const { x, y, z } = sphericalToCartesian(star.ra, star.dec, distance);
          
          // Scale down the coordinates to fit our scene
          const scale = 1000 / Math.max(...[x, y, z].map(Math.abs));
          vertices.push(x * scale, y * scale, z * scale);
          
          // Add color based on magnitude
          const color = calculateStarColor(star.magnitude);
          colors.push(color.r, color.g, color.b);
        });

        // Update geometry with new vertices and colors
        starGeometry.setAttribute(
          'position',
          new THREE.Float32BufferAttribute(vertices, 3)
        );
        starGeometry.setAttribute(
          'color',
          new THREE.Float32BufferAttribute(colors, 3)
        );
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching star data:', error);
        setLoading(false);
      }
    };

    fetchStarData();

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate stars slowly
      stars.rotation.y += 0.0002;
      
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100vh' }}>
      {loading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          fontSize: '1.5rem'
        }}>
          Loading star data...
        </div>
      )}
    </div>
  );
};

export default ThreeScene;