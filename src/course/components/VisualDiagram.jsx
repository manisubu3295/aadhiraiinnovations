import React from "react";
import "./VisualDiagram.css";

export default function VisualDiagram({ type, highlightIndex }) {
  // Placeholder: Render animated array visuals based on type
  if (type === "array-intro") {
    return (
      <div className="visual-array">
        {[7, 12, 5, 9].map((val, i) => (
          <div key={i} className={"array-box" + (highlightIndex === i ? " highlight" : "")}>{val}</div>
        ))}
      </div>
    );
  }
  // Add more diagram types as needed
  return null;
}
