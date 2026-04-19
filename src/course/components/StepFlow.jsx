import React, { useState } from "react";
import StepCard from "./StepCard";
import steps from "../lessons/arraysLesson";

export default function StepFlow() {
  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex];
  const goNext = () => setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  const goPrev = () => setStepIndex((i) => Math.max(i - 1, 0));

  return (
    <div>
      <StepCard step={step} onNext={goNext} onPrev={goPrev} isLast={stepIndex === steps.length - 1} />
    </div>
  );
}
