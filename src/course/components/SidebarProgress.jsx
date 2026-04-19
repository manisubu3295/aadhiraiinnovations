import React from "react";
import "./SidebarProgress.css";

export default function SidebarProgress() {
  // Placeholder: Replace with dynamic lesson/section data
  return (
    <aside className="sidebar-progress">
      <div className="progress-header">Java DSA – Arrays</div>
      <div className="progress-section">
        <div className="section-title">Basics</div>
        <ul>
          <li className="active">What is an Array?</li>
          <li>Array Indexing</li>
          <li>Array Traversal</li>
        </ul>
      </div>
      <div className="progress-section">
        <div className="section-title">Core</div>
        <ul>
          <li>Searching</li>
          <li>Sorting</li>
        </ul>
      </div>
      <div className="progress-indicator">14% done</div>
    </aside>
  );
}
