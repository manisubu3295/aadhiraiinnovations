import React from "react";
import "./CodeSnippet.css";

export default function CodeSnippet({ code }) {
  return (
    <pre className="code-snippet">
      <code>{code}</code>
    </pre>
  );
}
