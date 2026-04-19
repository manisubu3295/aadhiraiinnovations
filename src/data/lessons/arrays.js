export const lessonData = {
  slug: 'arrays',
  title: 'Arrays in Java',
  subtitle: 'The foundation of every data structure.',
  badge: 'Lesson 1 · Basics',
  estimatedTime: '15 min',
  blocks: [
    {
      type: 'concept',
      id: 'what-is-array',
      heading: 'What is an Array?',
      body: `An array is a container that holds a fixed number of values of the same type. Think of it like a row of mailboxes, where each box holds one value, and each box has a unique address (index).

The key insight: **arrays give us instant access to any element** if we know its position. No searching needed. Just ask for the box number, and you get the value in constant time.

In Java, we declare arrays like this:
- \`int[] numbers;\` — declares an array of integers
- \`numbers = new int[5];\` — creates space for 5 integers
- \`int[] numbers = {10, 20, 30};\` — shorthand: declare + initialize in one line

Every element has an **index** (position) that starts at 0, not 1. This is one of the biggest sources of bugs for new programmers.`,
    },

    {
      type: 'visual',
      id: 'array-intro-visual',
      component: 'ArrayVisual',
      props: { elements: [10, 25, 8, 42, 17], label: 'arr' },
      caption: 'An array of 5 integers. Each box holds one value. The number below is the index (starting at 0).',
    },

    {
      type: 'concept',
      id: 'indexing-pattern',
      heading: 'Zero-Based Indexing',
      body: `In Java arrays, counting starts at 0:
- Index 0 → first element
- Index 1 → second element
- Index 4 → fifth element

The last valid index is always **length - 1**. If your array has 5 elements, the valid indices are 0, 1, 2, 3, 4. Index 5 would crash the program with an \`ArrayIndexOutOfBoundsException\`.

**Mental model:** Think of the index as "how many steps from the beginning," not "which position." Step 0 = first position.`,
    },

    {
      type: 'worked-sample',
      id: 'access-element-sample',
      heading: 'Accessing an Element',
      code: `int[] arr = {10, 25, 8, 42, 17};
int x = arr[1];
int y = arr[4];
System.out.println(x); // prints 25
System.out.println(y); // prints 17`,
      steps: [
        {
          line: '1',
          explanation: 'Create an array with 5 values. These are stored in memory in order.',
        },
        {
          line: '2',
          explanation: 'Access arr[1] — go to index 1 (the second position). That value is 25.',
        },
        {
          line: '3',
          explanation: 'Access arr[4] — go to index 4 (the fifth position). That value is 17.',
        },
        {
          line: '4-5',
          explanation: 'Print the results. Direct array access is instant — no searching needed.',
        },
      ],
      result: 'x = 25, y = 17',
    },

    {
      type: 'exercise',
      id: 'predict-output-1',
      exerciseType: 'predict-output',
      heading: 'Your Turn: Predict Output',
      prompt: 'What does this code print?',
      code: `int[] nums = {3, 7, 2, 9};
System.out.println(nums[2]);`,
      expectedAnswer: '2',
      options: ['7', '2', '9', '3'],
      correctFeedback: {
        title: '✓ Exactly right!',
        body: 'You identified that index 2 is the third element (3, 7, **2**). Your understanding of zero-based indexing is solid.',
        reinforcement: 'This is one of the most common sources of bugs — confusing index and position. You already have the right instinct.',
      },
      wrongAnswerFeedback: {
        '7': {
          title: 'Not quite — but I see your thinking',
          hint: 'Which index is 7 at?',
          body: '7 is at index 1, not index 2. Remember: arrays start at 0. So index 2 is the **third** slot, not the second.',
          misconception: 'You may be counting from 1 like natural language. Java counts from 0.',
        },
        '9': {
          title: 'Almost, but 9 is one slot too far',
          hint: 'Count the indices: 0, 1, 2...',
          body: '9 is at index 3. Index 2 is one step before that — which is 2.',
          misconception: 'Off-by-one from the right side. Re-count from index 0.',
        },
        '3': {
          title: 'That\'s the value at index 0',
          hint: 'The question asks for index 2, not 0',
          body: '3 is the first element (index 0). Index 2 is two steps forward from there.',
          misconception: 'You may have confused index 0 with index 2. Write it out: index 0→3, 1→7, 2→2.',
        },
      },
    },

    {
      type: 'exercise',
      id: 'fill-in-code-1',
      exerciseType: 'fill-in-code',
      heading: 'Fill in the Gap',
      prompt: 'Complete this code so it prints the LAST element of the array.',
      codeTemplate: `int[] arr = {5, 10, 15, 20};
System.out.println(arr[___]);`,
      blanks: [{ id: 'blank1', expectedValue: '3', label: 'blank1' }],
      hint: 'An array of length 4 has valid indices 0, 1, 2, 3. The last index is length - 1.',
      correctFeedback: {
        title: '✓ Spot on!',
        body: 'The last index is always length - 1. For length 4, that\'s index 3. This exact pattern — `arr[arr.length - 1]` — appears constantly in real code.',
        suggestion: 'Bonus: try `arr[arr.length - 1]` as the dynamic version that works for any array size.',
      },
      wrongAnswerFeedback: {
        '4': {
          title: 'Close, but that\'s out of bounds',
          body: 'Index 4 doesn\'t exist in a 4-element array (indices are 0–3). Java would throw an ArrayIndexOutOfBoundsException. The last valid index is 3.',
          misconception: 'You may be thinking "length 4 means index 4," but remember: the last index is always length - 1.',
        },
      },
    },

    {
      type: 'concept',
      id: 'array-length-property',
      heading: 'The `.length` Property',
      body: `Every array in Java has a built-in `.length` property that tells you how many elements it holds. It's read-only — you can't change it after the array is created.

\`\`\`java
int[] arr = {5, 10, 15, 20};
System.out.println(arr.length); // prints 4
\`\`\`

This is super useful for loops. Instead of hardcoding "loop 4 times," you can loop until \`i < arr.length\`:
\`\`\`java
for (int i = 0; i < arr.length; i++) {
  System.out.println(arr[i]);
}
\`\`\`

Now if you add an element later, your loop adapts automatically. This is a key pattern in real code.`,
    },

    {
      type: 'exercise',
      id: 'choose-complexity-1',
      exerciseType: 'choose-complexity',
      heading: 'What\'s the Time Cost?',
      scenario: 'You know the index. You access arr[2] directly.',
      question: 'What is the time complexity of accessing arr[2]?',
      options: ['O(1)', 'O(n)', 'O(log n)'],
      expectedAnswer: 'O(1)',
      correctFeedback: {
        title: '✓ Correct — O(1)',
        body: 'Any index access in an array is constant time, regardless of array size. The computer calculates the exact memory address directly: base + (index × element size). No searching needed.',
        reinforcement: 'This O(1) access is what makes arrays so powerful. Any other data structure would need to search.',
      },
      wrongAnswerFeedback: {
        'O(n)': {
          title: 'That would be if you searched element by element',
          body: 'O(n) is what happens when you search linearly through the array. But direct index access is instant — the CPU knows exactly where to look in memory.',
        },
        'O(log n)': {
          title: 'That\'s binary search, not direct access',
          body: 'Binary search is O(log n) when finding an element in a *sorted* array. But if you already know the index, you skip all searching.',
        },
      },
    },

    {
      type: 'concept',
      id: 'array-memory-layout',
      heading: 'Why Arrays Are Fast: Memory Layout',
      body: `Arrays are fast because they store elements **contiguously** in memory. All elements sit next to each other.

When you ask for \`arr[5]\`, the CPU computes:
\`\`\`
memory address = base address + (5 × size of one element)
\`\`\`

For example, if an \`int\` is 4 bytes and \`arr\` starts at address 1000:
- arr[0] is at 1000
- arr[1] is at 1004
- arr[2] is at 1008
- arr[5] is at 1000 + (5 × 4) = 1020

The CPU does this math instantly — **one step**. It doesn't iterate. This is why array access is O(1).

Compare to a linked list, where you have to follow pointers from node to node. That's O(n) in the worst case.`,
    },

    {
      type: 'worked-sample',
      id: 'loop-and-print',
      heading: 'Looping Through Arrays',
      code: `int[] scores = {85, 92, 78, 95};
for (int i = 0; i < scores.length; i++) {
  System.out.println("Score: " + scores[i]);
}`,
      steps: [
        {
          line: '1',
          explanation: 'Create an array of 4 scores.',
        },
        {
          line: '2',
          explanation: 'Loop from i = 0 to i < 4 (since length is 4).',
        },
        {
          line: '3',
          explanation: 'Each iteration prints the current score. i goes 0, 1, 2, 3.',
        },
      ],
      result: `Score: 85
Score: 92
Score: 78
Score: 95`,
    },

    {
      type: 'exercise',
      id: 'fix-the-bug-1',
      exerciseType: 'fix-the-bug',
      heading: 'Fix the Bug',
      problem: 'This code is supposed to print all elements, but it skips the last one. Fix it.',
      code: `int[] data = {10, 20, 30, 40};
for (int i = 0; i < data.length - 1; i++) {
  System.out.println(data[i]);
}`,
      hint: 'The loop condition should visit all indices: 0, 1, 2, 3. Currently it stops at 2.',
      expectedFix: 'i < data.length',
      correctFeedback: {
        title: '✓ Nice catch!',
        body: 'Changing `i < data.length - 1` to `i < data.length` ensures the loop runs for all indices. This is the standard pattern — always use `i < array.length` in for loops.',
        reinforcement: 'Off-by-one errors are the #1 source of array bugs. You spotted it!',
      },
    },

    {
      type: 'reflection',
      id: 'summary',
      heading: 'What You\'ve Built So Far',
      keyInsights: [
        'Arrays use 0-based indexing — the first element is at index 0, not 1',
        'Direct index access is O(1) — constant time, regardless of array size',
        'The last valid index is always length - 1',
        'Arrays store elements contiguously in memory, which is why they\'re fast',
        'The `.length` property tells you how many elements the array holds',
        'Off-by-one errors are the #1 source of array bugs — always double-check your indices',
      ],
      rememberedPattern: 'Any time you see `arr[i]`, ask: "Is the index correct?" A 2-second habit prevents hours of debugging.',
    },
  ],
}
