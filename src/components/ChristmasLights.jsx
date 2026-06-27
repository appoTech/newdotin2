import React from "react";
import "../css/ChristmasLights.css"; // Create this CSS file

const ChristmasLights = () => {
  const colors = ["red", "green", "blue", "yellow", "purple" ,"red", "green", "blue", "yellow", "purple", "red", "green", "blue", "yellow", "purple", "red", "green", "blue", "yellow", "purple", "red", "green", "blue", "yellow", "purple", "red", "green", "blue", "yellow", "purple"];
  return (
    <div className="christmas-lights">
      {colors.map((color, index) => (
        <span
          key={index}
          className="light"
          style={{
            backgroundColor: color,
            animationDelay: `${index * 0.2}s`,
          }}
        ></span>
      ))}
    </div>
  );
};

export default ChristmasLights;
