import React from "react";
import "./FeedbackPanel.css";

export default function FeedbackPanel({ type, message }) {
  return (
    <div className={"feedback-panel " + type}>
      {type === "correct" ? "✅ " : "❌ "}
      {message}
    </div>
  );
}
