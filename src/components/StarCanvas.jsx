import React, { useRef, useState, useEffect } from "react";

const StarCanvas = () => {
  const canvasRef = useRef(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [stars, setStars] = useState([
    { name: "Dubhe", x: 320, y: 150, mag: 1.79 },
    { name: "Merak", x: 280, y: 180, mag: 2.37 },
    { name: "Phecda", x: 350, y: 220, mag: 2.44 },
    { name: "Megrez", x: 390, y: 190, mag: 3.31 },
    { name: "Alioth", x: 450, y: 170, mag: 1.77 },
    { name: "Mizar", x: 510, y: 140, mag: 2.23 },
    { name: "Alkaid", x: 570, y: 120, mag: 1.85 },
    { name: "Polaris", x: 670, y: 50, mag: 1.97 },
    { name: "Arcturus", x: 200, y: 500, mag: 0.04 },
    { name: "Vega", x: 600, y: 400, mag: 0.03 },
    { name: "Sirius", x: 150, y: 600, mag: -1.46 },
    { name: "Betelgeuse", x: 100, y: 450, mag: 0.5 },
    { name: "Rigel", x: 580, y: 300, mag: 0.18 },
    { name: "Aldebaran", x: 240, y: 620, mag: 0.87 },
    { name: "Spica", x: 450, y: 580, mag: 1.04 },
    { name: "Antares", x: 50, y: 200, mag: 1.06 },
    { name: "Altair", x: 370, y: 430, mag: 0.76 },
    { name: "Capella", x: 50, y: 90, mag: 0.08 },
    { name: "Procyon", x: 640, y: 290, mag: 0.38 },
    { name: "Fomalhaut", x: 500, y: 660, mag: 1.16 },
    { name: "Deneb", x: 610, y: 210, mag: 1.25 },
    { name: "Canopus", x: 660, y: 520, mag: -0.72 },
    { name: "Achernar", x: 470, y: 670, mag: 0.46 },
    { name: "Alpha Centauri", x: 520, y: 50, mag: -0.01 },
    { name: "Bellatrix", x: 300, y: 300, mag: 1.64 },
    { name: "Regulus", x: 430, y: 490, mag: 1.35 },
    { name: "Castor", x: 70, y: 100, mag: 1.58 },
    { name: "Pollux", x: 120, y: 150, mag: 1.14 },
    { name: "Alnilam", x: 330, y: 370, mag: 1.69 },
    { name: "Mintaka", x: 350, y: 350, mag: 2.25 },
    { name: "Alnitak", x: 340, y: 340, mag: 1.74 },
    { name: "Zubenelgenubi", x: 430, y: 200, mag: 2.75 },
    { name: "Diphda", x: 390, y: 250, mag: 2.02 },
    { name: "Gacrux", x: 140, y: 620, mag: 1.59 },
    { name: "Acrux", x: 160, y: 610, mag: 0.76 },
    { name: "Elnath", x: 450, y: 100, mag: 1.65 },
    { name: "Alpheratz", x: 230, y: 340, mag: 2.06 },
    { name: "Sadalmelik", x: 560, y: 450, mag: 2.95 },
    { name: "Sadr", x: 480, y: 430, mag: 2.23 },
    { name: "Alhena", x: 170, y: 380, mag: 1.93 },
    { name: "Menkalinan", x: 350, y: 90, mag: 1.9 },
    { name: "Zosma", x: 440, y: 320, mag: 2.56 },
    { name: "Suhail", x: 500, y: 540, mag: 2.21 },
    { name: "Rasalhague", x: 320, y: 450, mag: 2.08 },
  ]);
  const [connections, setConnections] = useState([]);
  const [draggingStar, setDraggingStar] = useState(null);
  const [hoveredStar, setHoveredStar] = useState(null); // State for the hovered star
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 }); // State for tooltip position

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
    </div>
  );
};

export default StarCanvas;
