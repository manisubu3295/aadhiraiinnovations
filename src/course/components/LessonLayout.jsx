import React from "react";
import SidebarProgress from "./SidebarProgress";
import ContextPanel from "./ContextPanel";
import "./LessonLayout.css";

export default function LessonLayout({ children }) {
  return (
    <div className="lesson-layout">
      <SidebarProgress />
      <main className="lesson-canvas">{children}</main>
      <ContextPanel />
    </div>
  );
}
