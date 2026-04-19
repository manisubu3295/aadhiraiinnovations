import React from "react";
import "./ReflectionBlock.css";

export default function ReflectionBlock({ points, commonMistake }) {
  return (
    <div className="reflection-block">
      <div className="reflection-title">What to Remember</div>
      <ul>
        {points && points.map((p, i) => <li key={i}>{p}</li>)}
      </ul>
      {commonMistake && <div className="reflection-mistake">Common mistake: {commonMistake}</div>}
    </div>
  );
}
