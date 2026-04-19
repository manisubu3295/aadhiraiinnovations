import React, { useState } from "react";
import FeedbackPanel from "./FeedbackPanel";

export default function InteractiveTask({ prompt, options, correct }) {
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handleSelect = (option) => {
    setSelected(option);
    if (option === correct) {
      setFeedback({ type: "correct", message: "Great! You picked the right value." });
    } else {
      setFeedback({ type: "wrong", message: `Not quite. ${option} is not at that index. Try again!` });
    }
  };

  return (
    <div className="interactive-task">
      <div className="task-prompt">{prompt}</div>
      <div className="task-options">
        {options.map((opt, i) => (
          <button
            key={i}
            className={"task-option" + (selected === opt ? " selected" : "")}
            onClick={() => handleSelect(opt)}
            disabled={selected !== null}
          >
            {opt}
          </button>
        ))}
      </div>
      {feedback && <FeedbackPanel type={feedback.type} message={feedback.message} />}
    </div>
  );
}
