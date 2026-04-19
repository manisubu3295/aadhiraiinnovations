/**
 * Arrays in Java — Reference Lesson
 * Uses all 7 block types: concept, visual, worked-sample,
 * exercise (predict, fill-in, complexity, trace, drag-arrange), reflection
 */
export const lessonData = {
  slug: 'arrays',
  title: 'Arrays in Java',
  subtitle: 'The foundation of every data structure.',
  badge: 'Lesson 1 · Basics',
  estimatedTime: '18 min',
  blocks: [

    // ── 1. Concept ──────────────────────────────────────────────────
    {
      type: 'concept',
      id: 'what-is-array',
      heading: 'What is an Array?',
      body: `An array is a container that holds multiple values of the same type in contiguous memory. Each value has an index — a position number — starting at 0.

Think of it as a row of numbered mailboxes. Each mailbox holds exactly one value. You can reach any mailbox instantly if you know its number. That instant access is the whole point.`,
    },

    // ── 2. Visual ───────────────────────────────────────────────────
    {
      type: 'visual',
      id: 'array-memory-diagram',
      component: 'ArrayVisual',
      props: { elements: [10, 25, 8, 42, 17], label: 'arr' },
      caption: 'Five integers stored in memory. The number below each box is the index, starting at 0.',
    },

    // ── 3. Concept: zero-based ───────────────────────────────────────
    {
      type: 'concept',
      id: 'zero-based-indexing',
      heading: 'Zero-Based Indexing',
      body: `In Java, array indices start at 0, not 1.

- Index 0 → first element
- Index 1 → second element
- Index 4 → fifth element
- Last valid index → length - 1

Accessing an index that does not exist throws ArrayIndexOutOfBoundsException. The most common mistake: using length instead of length - 1 for the last element.`,
    },

    // ── 4. Exercise: Drag to arrange — concept order ─────────────────
    {
      type: 'exercise',
      id: 'drag-arrange-1',
      exerciseType: 'drag-arrange',
      heading: 'Order the Steps',
      prompt: 'Arrange these steps in the correct order to access an element by index:',
      items: [
        'Compute memory address: base + (index × element size)',
        'Know the base address of the array',
        'Know the index you want',
        'Read the value at that address',
      ],
      correctOrder: [
        'Know the base address of the array',
        'Know the index you want',
        'Compute memory address: base + (index × element size)',
        'Read the value at that address',
      ],
      hint: 'Array access is a two-step calculation before the actual read.',
      correctFeedback: {
        title: 'Correct order',
        body: 'This is exactly how the CPU accesses array elements. The address calculation happens in hardware — which is why array access is O(1).',
        reinforcement: 'Understanding this memory model is what separates engineers who truly understand data structures from those who just memorize syntax.',
      },
      wrongFeedback: {
        title: 'Not quite',
        body: 'Think about what you need to know before you can calculate anything.',
        hint: 'You need the starting address and the index before you can compute where to look.',
      },
    },

    // ── 5. Worked Sample ─────────────────────────────────────────────
    {
      type: 'worked-sample',
      id: 'access-element-sample',
      heading: 'Accessing an Element',
      code: `int[] arr = {10, 25, 8, 42, 17};
int x = arr[2];
int y = arr[arr.length - 1];
System.out.println(x);   // 8
System.out.println(y);   // 17`,
      steps: [
        { line: '1', explanation: 'Create an array of 5 integers. Java allocates 5 contiguous memory slots.' },
        { line: '2', explanation: 'arr[2] means "jump to index 2" — the third element. This is O(1): one memory calculation, one read.' },
        { line: '3', explanation: 'arr.length is 5. arr.length - 1 is 4. arr[4] = 17. This is the standard pattern for the last element.' },
        { line: '4-5', explanation: 'Both accesses are instant, regardless of how large the array is.' },
      ],
      result: 'x = 8   |   y = 17',
    },

    // ── 6. Exercise: Predict output ───────────────────────────────────
    {
      type: 'exercise',
      id: 'predict-output-1',
      exerciseType: 'predict-output',
      heading: 'Predict Output',
      prompt: 'What does this print?',
      code: `int[] nums = {3, 7, 2, 9};
System.out.println(nums[2]);`,
      expectedAnswer: '2',
      options: ['7', '2', '9', '3'],
      correctFeedback: {
        title: 'Correct — index 2 is the third element',
        body: 'You identified that nums[2] maps to the third slot: 3→0, 7→1, 2→2. Zero-based indexing is solid.',
        reinforcement: 'The most common interview mistake is confusing index and position. You did not make it.',
      },
      wrongAnswerFeedback: {
        '7': {
          title: '7 is at index 1, not 2',
          hint: 'Count from 0: index 0 → 3, index 1 → 7, index 2 → ?',
          body: 'You might be counting from 1 naturally. Java counts from 0. Index 2 is the third slot.',
          misconception: 'Natural counting starts at 1. Computer indexing starts at 0.',
        },
        '9': {
          title: '9 is one slot too far — that is index 3',
          hint: 'Index 2 is the third element. Index 3 is the fourth.',
          body: 'Off by one from the right. Re-count: 0→3, 1→7, 2→2, 3→9.',
          misconception: 'Classic off-by-one error when going right to left.',
        },
        '3': {
          title: '3 is at index 0 — the very first element',
          hint: 'The question asks for index 2, not index 0.',
          body: 'You may have read arr[0] instead of arr[2]. Start at 0 and count forward: 0→3, 1→7, 2→2.',
          misconception: 'Make sure you are reading the index in the brackets, not assuming it.',
        },
      },
    },

    // ── 7. Concept: length property ──────────────────────────────────
    {
      type: 'concept',
      id: 'length-property',
      heading: 'The .length Property',
      body: `Every Java array has a .length property — the number of elements it holds.

int[] arr = {5, 10, 15, 20};
arr.length → 4

Key facts:
- .length is read-only. You cannot change it.
- Valid indices are 0 through arr.length - 1.
- Use arr.length in loops so your code adapts to any array size.

for (int i = 0; i < arr.length; i++) {
    System.out.println(arr[i]);
}

Hardcoding 4 instead of arr.length is a maintenance bug waiting to happen.`,
    },

    // ── 8. Exercise: Fill in code ─────────────────────────────────────
    {
      type: 'exercise',
      id: 'fill-in-code-1',
      exerciseType: 'fill-in-code',
      heading: 'Fill in the Gap',
      prompt: 'Complete the code so it prints the LAST element of the array:',
      codeTemplate: `int[] arr = {5, 10, 15, 20};
System.out.println(arr[___]);`,
      blanks: [{ id: 'blank1', expectedValue: '3', label: 'blank1' }],
      hint: 'An array of length 4 has indices 0, 1, 2, 3. The last index is length - 1.',
      correctFeedback: {
        title: 'Spot on',
        body: 'The last index is always length - 1. For length 4, that is index 3.',
        suggestion: 'Production code usually uses arr[arr.length - 1] so it works for any array size.',
      },
    },

    // ── 9. Worked Sample: Loop + Accumulate ───────────────────────────
    {
      type: 'worked-sample',
      id: 'loop-sample',
      heading: 'Looping Through an Array',
      code: `int[] scores = {85, 92, 78, 95};
int sum = 0;
for (int i = 0; i < scores.length; i++) {
    sum += scores[i];
}
System.out.println(sum);`,
      steps: [
        { line: '1-2', explanation: 'Create an array and a sum accumulator.' },
        { line: '3', explanation: 'Loop from index 0 to length - 1 (i < length, not i <= length).' },
        { line: '4', explanation: 'Add each element to sum. After all 4 iterations: 85 + 92 + 78 + 95 = 350.' },
        { line: '6', explanation: 'Print the total. i < scores.length guarantees we never go out of bounds.' },
      ],
      result: '350',
    },

    // ── 10. Exercise: Trace ───────────────────────────────────────────
    {
      type: 'exercise',
      id: 'trace-1',
      exerciseType: 'trace',
      heading: 'Trace the Execution',
      prompt: 'Fill in the value of each variable as the code runs:',
      code: `int[] arr = {4, 7, 2};
int max = arr[0];
for (int i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
        max = arr[i];
    }
}`,
      steps: [
        {
          line: '1-2',
          description: 'arr is created. max starts as the first element.',
          variables: { 'arr[0]': 4, 'arr[1]': 7, 'arr[2]': 2, max: 4, i: '...' },
        },
        {
          line: '3 (i=1)',
          description: 'Loop starts. i=1. Check: arr[1]=7 > max=4? Yes.',
          variables: { 'arr[1]': 7, max: 4, i: 1, 'arr[i] > max': 'true' },
        },
        {
          line: '5 (i=1)',
          description: 'max is updated to arr[1] which is 7.',
          variables: { i: 1, 'arr[i]': 7, max: '?' },
        },
        {
          line: '3 (i=2)',
          description: 'i=2. Check: arr[2]=2 > max=7? No, skip.',
          variables: { i: 2, 'arr[2]': 2, max: 7, 'arr[i] > max': 'false' },
        },
      ],
      blanks: [
        { stepIndex: 2, variable: 'max', expectedValue: '7' },
      ],
      correctFeedback: {
        title: 'Correct trace',
        body: 'You correctly identified that max becomes 7 after the first iteration. The "find maximum" pattern works by updating max whenever a larger value is found.',
        reinforcement: 'Tracing through code mentally is one of the most important debugging skills. You just practiced it.',
      },
      wrongFeedback: {
        title: 'Not quite',
        body: 'After checking arr[1]=7 > max=4 (true), max is assigned arr[1]. What is arr[1]?',
        hint: 'max = arr[i] where i=1. arr[1] = 7.',
        misconception: 'max stores the largest value seen so far. After visiting 7, max becomes 7.',
      },
    },

    // ── 11. Exercise: Choose complexity ───────────────────────────────
    {
      type: 'exercise',
      id: 'choose-complexity-1',
      exerciseType: 'choose-complexity',
      heading: 'Time Complexity',
      scenario: 'You access arr[1000] directly by index in an array of 1,000,000 elements.',
      question: 'What is the time complexity of this access?',
      options: ['O(1)', 'O(n)', 'O(log n)'],
      expectedAnswer: 'O(1)',
      correctFeedback: {
        title: 'Correct — O(1)',
        body: 'Array index access is always constant time. The CPU computes the address in one step: base + (index × size). A 1M-element array is no slower to access than a 3-element one.',
        reinforcement: 'This is the superpower of arrays. No other data structure gives you O(1) access by position.',
      },
      wrongAnswerFeedback: {
        'O(n)': {
          title: 'That is linear search — not index access',
          body: 'O(n) would mean checking elements one by one. Array index access skips all that — it calculates the address directly.',
          misconception: 'Index access ≠ search. You already know where you are going.',
        },
        'O(log n)': {
          title: 'That is binary search on a sorted array',
          body: 'Binary search is O(log n) when you are searching for a value. Here you already know the index, so no searching is needed.',
          misconception: 'O(log n) requires repeatedly halving. Direct access requires one calculation.',
        },
      },
    },

    // ── 12. Exercise: Fix the Bug ─────────────────────────────────────
    {
      type: 'exercise',
      id: 'fix-the-bug-1',
      exerciseType: 'fix-the-bug',
      heading: 'Fix the Bug',
      problem: 'This loop is supposed to print all elements but skips the last one. Fix it.',
      code: `int[] data = {10, 20, 30, 40};
for (int i = 0; i < data.length - 1; i++) {
    System.out.println(data[i]);
}`,
      hint: 'The loop should visit indices 0, 1, 2, 3. Currently it stops at 2.',
      expectedFix: 'i < data.length',
      correctFeedback: {
        title: 'Correct fix',
        body: 'Removing the - 1 makes the loop run for all valid indices: 0, 1, 2, 3. i < data.length is the standard loop pattern.',
        reinforcement: 'Off-by-one errors in loop conditions are the single most common array bug. You found it.',
      },
    },

    // ── 13. Reflection ────────────────────────────────────────────────
    {
      type: 'reflection',
      id: 'summary',
      heading: 'What You Have Built',
      keyInsights: [
        'Arrays use 0-based indexing — the first element is at index 0, not 1',
        'Direct index access is O(1) — the CPU computes the address, no searching',
        'The last valid index is always arr.length - 1',
        'Use arr.length in loop conditions, not a hardcoded number',
        'Off-by-one in loop condition (< vs <=) is the most common array bug',
        'ArrayIndexOutOfBoundsException means you accessed an index that does not exist',
      ],
      rememberedPattern: 'Every time you write arr[i], pause and ask: is i definitely in range 0 to arr.length-1? That one-second check prevents most array bugs.',
    },
  ],
}
