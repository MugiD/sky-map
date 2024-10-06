"use client";
import React, { useRef, useState, useEffect } from "react";
import starsData from "./stars.json";
import { Button } from "./ui/button";

const StarCanvas = () => {
  const canvasRef = useRef(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [stars, setStars] = useState(starsData);
  const [draggingStar, setDraggingStar] = useState(null);
  const [hoveredStar, setHoveredStar] = useState(null); // State for the hovered star
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 }); // State for tooltip position
  const [connections, setConnections] = useState([]);

  // Load connections from localStorage on the client side
  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      const savedConnections = localStorage.getItem("connections");
      if (savedConnections) {
        setConnections(JSON.parse(savedConnections));
      }
    }
  }, []);

  // Save connections to localStorage whenever they change
  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("connections", JSON.stringify(connections));
    }
  }, [connections]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Draw the stars
    stars.forEach((star) => {
      drawStar(ctx, star);
    });

    // Draw the connections
    connections.forEach((connection) => {
      drawLine(ctx, connection[0], connection[1]);
    });
  }, [stars, connections]);

  const drawStar = (ctx, star) => {
    // Size and brightness based on star magnitude
    const size = Math.max(3 * (5 - star.mag), 3); // Brighter stars = bigger, dimmer = smaller
    const opacity = Math.max(1 - star.mag / 5, 0.3); // Brighter stars = more opaque, dimmer = less opaque

    ctx.beginPath();
    ctx.arc(star.x, star.y, size / 2, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`; // White stars with variable opacity
    ctx.fill();
  };

  const drawLine = (ctx, startStar, endStar) => {
    ctx.beginPath();
    ctx.moveTo(startStar.x, startStar.y);
    ctx.lineTo(endStar.x, endStar.y);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"; // White lines at half opacity
    ctx.lineWidth = 3;
    ctx.stroke();
  };

  const getStarAtPosition = (x, y) => {
    return stars.find((star) => {
      const distance = Math.sqrt((star.x - x) ** 2 + (star.y - y) ** 2);
      return distance < 10; // Star clickable area radius
    });
  };

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const star = getStarAtPosition(x, y);

    if (star) {
      setHoveredStar(star.name);
      setTooltipPosition({ x: star.x, y: star.y + 15 }); // Position the tooltip just under the star
    } else {
      setHoveredStar(null);
    }
  };

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const clickedStar = getStarAtPosition(x, y);
    if (clickedStar) {
      setDraggingStar(clickedStar);
    }
  };

  const handleMouseUp = (e) => {
    if (draggingStar) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const targetStar = getStarAtPosition(x, y);
      if (targetStar && targetStar !== draggingStar) {
        setConnections([...connections, [draggingStar, targetStar]]);
      }
      setDraggingStar(null);
    }
  };

  const clearConnections = () => {
    localStorage.removeItem("connections");
    setConnections([]);
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={700}
        height={700}
        style={{ background: "black", display: "block" }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove} // Add mouse move event
      />
      {/* Tooltip for displaying star name */}
      {hoveredStar && (
        <div
          style={{
            position: "absolute",
            color: "white",
            background: "rgba(0, 0, 0, 0.7)",
            borderRadius: "5px",
            padding: "5px",
            pointerEvents: "none",
            left: tooltipPosition.x,
            top: tooltipPosition.y,
          }}
        >
          {hoveredStar}
        </div>
      )}

      <Button
        className="absolute left-[10px] bottom-[10px]"
        variant="destructive"
        onClick={clearConnections}
      >
        Clear Constellations
      </Button>
    </div>
  );
};

export default StarCanvas;
