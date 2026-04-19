import React from "react";
import "./ContextPanel.css";

export default function ContextPanel() {
  // Placeholder: Replace with dynamic hints/notes
  return (
    <aside className="context-panel">
      <div className="context-title">Hints & Key Points</div>
      <ul>
        <li>Arrays use zero-based indexing.</li>
        <li>Accessing out-of-bounds indices causes errors.</li>
        <li>Remember: Index 3 is the fourth element.</li>
      </ul>
    </aside>
  );
}
