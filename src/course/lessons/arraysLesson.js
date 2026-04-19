// Step-based lesson for Java DSA – Arrays
const steps = [
  {
    type: "concept",
    heading: "What is an Array?",
    text: "A collection of items stored at contiguous memory locations.",
    visual: { type: "array-intro" },
  },
  {
    type: "visual",
    heading: "Visualizing an Array",
    text: "See how values are stored and accessed by index.",
    visual: { type: "array-intro", highlightIndex: null },
  },
  {
    type: "explanation",
    heading: "Indexing in Arrays",
    text: "Accessing index 2 gives you the third element.",
    visual: { type: "array-intro", highlightIndex: 2 },
  },
  {
    type: "interaction",
    heading: "Try It Yourself",
    task: {
      prompt: "What value is at index 3?",
      options: [7, 12, 5, 9],
      correct: 9,
    },
  },
  {
    type: "feedback",
    feedback: {
      correct: "Great! You picked the right value at index 3.",
      wrong: "Remember, array indices start at 0. Try again.",
      explain: "Index 3 is the fourth element.",
    },
  },
  {
    type: "reflection",
    reflection: {
      points: [
        "Arrays use zero-based indexing.",
        "Accessing out-of-bounds indices causes errors.",
      ],
      commonMistake: "Confusing index 3 with the third element.",
    },
  },
  {
    type: "continue",
    heading: "Next: Array Traversal",
    text: "Ready to learn how to loop through arrays?",
  },
];

export default steps;
