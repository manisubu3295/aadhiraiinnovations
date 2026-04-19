/**
 * Premium Step-Based Lesson: Arrays in Java
 * 11 focused steps, one learning objective per screen
 * Reuses existing components from src/components/learn/
 */

export const arraysSteps = [
  {
    id: 'what-is-array',
    type: 'concept',
    badge: '🔷 CONCEPT',
    heading: 'What is an Array?',
    body: 'An array is a container that holds multiple values of the same type in contiguous memory. Each value has a position called an index. Think of it like a row of mailboxes — each box holds one item, and each box has a number.',
    icon: '📦',
    hint: 'Arrays store values next to each other in memory. This is what makes them fast.',
  },

  {
    id: 'memory-layout',
    type: 'visual',
    badge: '🎨 VISUAL',
    heading: 'Memory Layout',
    subheading: 'How arrays are stored in memory',
    component: 'ArrayVisual',
    props: { elements: [10, 25, 8, 42, 17], label: 'arr' },
    caption: 'Each box holds one value. The number below is the index (starting at 0).',
    hint: 'Indices start at 0, not 1. This is the biggest source of confusion.',
  },

  {
    id: 'zero-based-indexing',
    type: 'guided',
    badge: '📖 GUIDED',
    heading: 'Zero-Based Indexing',
    code: `int[] arr = {10, 25, 8, 42, 17};
int value = arr[2];  // What is value?`,
    highlights: [{ line: 2, text: 'arr[2]', explanation: 'Index 2 is the 3rd element (0, 1, 2)' }],
    explanation: 'In Java, counting starts at 0. So arr[2] means "go to position 2" — which is the third element. In this case, that\'s 8.',
    hint: 'Remember: index = position count from 0. arr[2] is NOT the 2nd element, it\'s the 3rd.',
  },

  {
    id: 'exercise-predict-1',
    type: 'exercise',
    badge: '📝 YOUR TURN',
    exerciseType: 'predict-output',
    heading: 'Predict Output',
    prompt: 'What does this print?',
    code: `int[] nums = {3, 7, 2, 9};
System.out.println(nums[2]);`,
    expectedAnswer: '2',
    options: ['7', '2', '9', '3'],
    correctFeedback: {
      title: '✓ Exactly right!',
      body: 'You correctly identified index 2 as the third element (3, 7, **2**). Your zero-based indexing is solid!',
      reinforcement: 'This understanding prevents countless bugs. You\'ve got it.',
    },
    wrongAnswerFeedback: {
      '7': {
        title: 'Not quite — but I see your thinking',
        hint: 'Count from 0: index 0→3, index 1→7, index 2→?',
        body: '7 is at index 1, not index 2. Remember: arrays count from 0.',
        misconception: 'You might be counting from 1 naturally. Java starts at 0.',
      },
      '9': {
        title: 'Almost! That\'s one step too far',
        hint: 'Index 2 is the third element. Index 3 is the fourth.',
        body: '9 is at index 3. Index 2 is one step before that.',
        misconception: 'Off-by-one error. Very common when indexing arrays.',
      },
      '3': {
        title: 'That\'s the first element (index 0)',
        hint: 'Start counting: 0→3, 1→7, 2→?',
        body: '3 is at index 0. Index 2 is two steps forward.',
        misconception: 'Maybe you confused which index goes to which position.',
      },
    },
    gated: true,
  },

  {
    id: 'length-property',
    type: 'concept',
    badge: '🔷 CONCEPT',
    heading: 'The .length Property',
    body: 'Every array has a built-in .length property that tells you how many elements it holds. It\'s read-only — you can\'t change it. This is super useful for loops: instead of hardcoding "loop 5 times," you loop while i < arr.length.',
    code: `int[] arr = {5, 10, 15, 20};
System.out.println(arr.length);  // prints 4`,
    hint: 'The last valid index is always length - 1. If length is 4, the last index is 3.',
  },

  {
    id: 'exercise-fill-in-1',
    type: 'exercise',
    badge: '📝 YOUR TURN',
    exerciseType: 'fill-in-code',
    heading: 'Fill in the Gap',
    prompt: 'Complete this code so it prints the LAST element:',
    codeTemplate: `int[] arr = {5, 10, 15, 20};
System.out.println(arr[___]);`,
    blanks: [{ id: 'blank1', expectedValue: '3', label: 'blank1' }],
    hint: 'An array of length 4 has indices 0, 1, 2, 3. The last index is length - 1.',
    correctFeedback: {
      title: '✓ Spot on!',
      body: 'The last index is always length - 1. This pattern appears constantly in real code.',
      suggestion: 'Bonus: try arr[arr.length - 1] as the dynamic version that works for any array size.',
    },
    gated: true,
  },

  {
    id: 'why-fast',
    type: 'guided',
    badge: '⚡ WHY',
    heading: 'Why is Array Access Fast?',
    code: `// Accessing arr[5] is instant:
// memory_address = base_address + (5 × element_size)`,
    highlights: [{ text: 'Direct calculation', explanation: 'No searching. The CPU calculates the address in one step.' }],
    explanation: 'Arrays store elements next to each other in memory. To access arr[5], the CPU instantly calculates the memory address: base + (5 × element size). This is O(1) — constant time, no matter the array size.',
    hint: 'This is why arrays are preferred over linked lists for indexed access.',
  },

  {
    id: 'exercise-complexity-1',
    type: 'exercise',
    badge: '📝 YOUR TURN',
    exerciseType: 'choose-complexity',
    heading: 'What\'s the Time Cost?',
    scenario: 'You know the index. You directly access arr[2].',
    question: 'What is the time complexity?',
    options: ['O(1)', 'O(n)', 'O(log n)'],
    expectedAnswer: 'O(1)',
    correctFeedback: {
      title: '✓ Correct — O(1)',
      body: 'Any index access is constant time. The CPU calculates the address directly without searching.',
      reinforcement: 'This is array\'s superpower: instant access regardless of size.',
    },
    wrongAnswerFeedback: {
      'O(n)': {
        title: 'That\'s linear search, not index access',
        body: 'O(n) is when you loop through all elements. Direct index access skips the search.',
        misconception: 'Index access is not a search — it\'s a direct calculation.',
      },
      'O(log n)': {
        title: 'That\'s binary search on a sorted array',
        body: 'Binary search is O(log n). But if you already know the index, no searching happens.',
        misconception: 'You\'re thinking of search algorithms, not index access.',
      },
    },
    gated: true,
  },

  {
    id: 'looping-arrays',
    type: 'guided',
    badge: '📖 GUIDED',
    heading: 'Looping Through Arrays',
    code: `int[] scores = {85, 92, 78, 95};
for (int i = 0; i < scores.length; i++) {
  System.out.println(scores[i]);
}`,
    highlights: [
      { text: 'i < scores.length', explanation: 'This is the pattern: loop while i is less than the length.' },
      { text: 'scores[i]', explanation: 'Access each element using the loop variable as the index.' },
    ],
    explanation: 'Use a for loop with i starting at 0, incrementing until i < arr.length. This automatically handles any array size — no hardcoding needed.',
    hint: 'This pattern works for any array: change scores to any variable name and the logic stays the same.',
  },

  {
    id: 'exercise-fix-bug-1',
    type: 'exercise',
    badge: '📝 YOUR TURN',
    exerciseType: 'fix-the-bug',
    heading: 'Fix the Bug',
    problem: 'This code is supposed to print all elements, but it skips the last one. Fix it.',
    code: `int[] data = {10, 20, 30, 40};
for (int i = 0; i < data.length - 1; i++) {
  System.out.println(data[i]);
}`,
    hint: 'The loop condition should visit all indices: 0, 1, 2, 3. Currently it stops early.',
    expectedFix: 'i < data.length',
    correctFeedback: {
      title: '✓ Great catch!',
      body: 'Changing the condition to i < data.length ensures the loop visits every index. This is the standard pattern.',
      reinforcement: 'Off-by-one errors are the #1 source of array bugs. You spotted it!',
    },
    gated: true,
  },

  {
    id: 'reflection',
    type: 'reflection',
    badge: '🎓 REFLECTION',
    heading: 'What You\'ve Built',
    keyInsights: [
      'Arrays use 0-based indexing — the first element is at index 0',
      'Direct index access is O(1) — instant, regardless of array size',
      'The last valid index is always arr.length - 1',
      'Use arr.length in loops to make code scalable',
      'Off-by-one errors are the #1 source of array bugs',
    ],
    rememberedPattern: 'Any time you write arr[i], pause and ask: "Is my index correct?" This 2-second habit prevents hours of debugging.',
    commonMistake: 'Forgetting that indexing starts at 0, or using length instead of length - 1 for the last element.',
  },
]

/**
 * Lesson metadata
 */
export const lessonMeta = {
  slug: 'arrays',
  title: 'Arrays in Java',
  subtitle: 'The foundation of every data structure',
  badge: 'Lesson 1 · Basics',
  estimatedTime: '15 min',
  sections: [
    {
      name: 'Basics',
      steps: ['what-is-array', 'memory-layout', 'zero-based-indexing', 'exercise-predict-1'],
    },
    {
      name: 'Core Concepts',
      steps: ['length-property', 'exercise-fill-in-1', 'why-fast', 'exercise-complexity-1'],
    },
    {
      name: 'Practice',
      steps: ['looping-arrays', 'exercise-fix-bug-1'],
    },
    {
      name: 'Summary',
      steps: ['reflection'],
    },
  ],
}
