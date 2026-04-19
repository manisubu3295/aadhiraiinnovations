import React from "react";
import VisualDiagram from "./VisualDiagram";
import InteractiveTask from "./InteractiveTask";
import FeedbackPanel from "./FeedbackPanel";
import ReflectionBlock from "./ReflectionBlock";
import CodeSnippet from "./CodeSnippet";

export default function StepCard({ step, onNext, onPrev, isLast }) {
  return (
    <section className="step-card">
      {step.heading && <h2 className="step-heading">{step.heading}</h2>}
      {step.text && <div className="step-text">{step.text}</div>}
      {step.visual && <VisualDiagram {...step.visual} />}
      {step.task && <InteractiveTask {...step.task} />}
      {step.feedback && <FeedbackPanel {...step.feedback} />}
      {step.reflection && <ReflectionBlock {...step.reflection} />}
      {step.code && <CodeSnippet code={step.code} />}
      <div className="step-actions">
        {onPrev && <button onClick={onPrev} className="step-nav">Back</button>}
        <button onClick={onNext} className="step-nav">{isLast ? "Finish" : "Next Step"}</button>
      </div>
    </section>
  );
}
