export const lessonData = {
  slug: 'bubble-sort',
  title: 'Bubble Sort',
  subtitle: 'The simplest sort — and why you should understand it before moving on.',
  badge: 'Lesson 10 · Core Logic',
  estimatedTime: '14 min',
  blocks: [
    {
      type: 'concept',
      id: 'what-is-bubble',
      heading: 'What is Bubble Sort?',
      body: `Bubble sort repeatedly compares adjacent elements and swaps them if they are in the wrong order. With each pass through the array, the largest unsorted element "bubbles" to its correct position at the end.

After pass 1: the largest element is at the end.
After pass 2: the second largest is second from the end.
After n-1 passes: the array is sorted.

It is called "bubble sort" because small values float to the front and large values sink to the back, like bubbles rising through water.`,
    },
    {
      type: 'visual',
      id: 'bubble-visual',
      component: 'ArrayVisual',
      props: { elements: [5, 3, 8, 1, 9, 2], label: 'arr' },
      caption: 'Starting array. After one full pass, 9 will have "bubbled" to the last position.',
    },
    {
      type: 'worked-sample',
      id: 'bubble-code',
      heading: 'Bubble Sort — Implementation',
      code: `void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`,
      steps: [
        { line: '3', explanation: 'Outer loop runs n-1 times. After i passes, the last i elements are sorted.' },
        { line: '4', explanation: 'Inner loop only goes up to n-1-i. No need to compare the already-sorted tail.' },
        { line: '5-9', explanation: 'If two adjacent elements are out of order, swap them using a temp variable.' },
        { line: 'Overall', explanation: 'Worst case: n-1 + n-2 + ... + 1 = n(n-1)/2 comparisons = O(n²).' },
      ],
      result: '[1, 2, 3, 5, 8, 9] — sorted in ascending order',
    },
    {
      type: 'exercise',
      id: 'trace-bubble',
      exerciseType: 'trace',
      heading: 'Trace One Pass',
      prompt: 'Trace the first full pass of bubble sort on [5, 3, 1]. Fill in the array state after each swap:',
      code: `// arr = [5, 3, 1]
// Pass 1:
// j=0: arr[0]=5 > arr[1]=3? yes → swap → [3, 5, 1]
// j=1: arr[1]=5 > arr[2]=1? yes → swap → [3, 1, 5]
// After pass 1, arr = ?`,
      steps: [
        {
          line: 'Start',
          description: 'Initial array before any comparisons.',
          variables: { 'arr[0]': 5, 'arr[1]': 3, 'arr[2]': 1 },
        },
        {
          line: 'j=0',
          description: '5 > 3, so swap positions 0 and 1.',
          variables: { 'arr[0]': 3, 'arr[1]': 5, 'arr[2]': 1 },
        },
        {
          line: 'j=1',
          description: '5 > 1, so swap positions 1 and 2.',
          variables: { 'arr[0]': 3, 'arr[1]': '?', 'arr[2]': 5 },
        },
      ],
      blanks: [{ stepIndex: 2, variable: 'arr[1]', expectedValue: '1' }],
      correctFeedback: {
        title: 'Correct trace',
        body: 'After swapping 5 and 1: arr[1] becomes 1 and arr[2] becomes 5. The 5 has successfully "bubbled" to its final position.',
        reinforcement: 'Notice the largest element always ends up at the right position after one full pass — that is the key insight of bubble sort.',
      },
      wrongFeedback: {
        title: 'Check your swap',
        body: 'When arr[1]=5 and arr[2]=1, a swap puts the smaller value (1) into position 1. What is arr[1] after the swap?',
        hint: 'A swap exchanges: temp=arr[1], arr[1]=arr[2], arr[2]=temp. So arr[1] gets the old arr[2] value.',
      },
    },
    {
      type: 'concept',
      id: 'bubble-optimization',
      heading: 'Optimization: Early Exit',
      body: `If no swaps happen in a full pass, the array is already sorted. We can stop early:

void bubbleSortOptimized(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        boolean swapped = false;
        for (int j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        if (!swapped) break;  // sorted early!
    }
}

Best case (already sorted): O(n). Average and worst case: still O(n²).`,
    },
    {
      type: 'exercise',
      id: 'choose-bubble-1',
      exerciseType: 'choose-complexity',
      heading: 'Time Complexity',
      scenario: 'You run standard (non-optimized) bubble sort on an array of n elements.',
      question: 'What is the worst-case time complexity?',
      options: ['O(n)', 'O(n²)', 'O(n log n)'],
      expectedAnswer: 'O(n²)',
      correctFeedback: {
        title: 'Correct — O(n²)',
        body: 'Two nested loops, each running ~n times: n × n = n² comparisons. This is why bubble sort is impractical for large inputs.',
        reinforcement: 'Merge sort and quick sort are O(n log n) — the threshold where sorting becomes fast. Bubble sort is the baseline to understand before those.',
      },
      wrongAnswerFeedback: {
        'O(n)': { title: 'That is the best case with the early-exit optimization', body: 'Standard bubble sort always runs both loops: O(n²). Optimized version can achieve O(n) if already sorted.' },
        'O(n log n)': { title: 'That is merge sort and quick sort', body: 'Bubble sort has two nested full loops: O(n²). The O(n log n) algorithms use divide-and-conquer to avoid the quadratic behavior.' },
      },
    },
    {
      type: 'exercise',
      id: 'fix-bubble-1',
      exerciseType: 'fix-the-bug',
      heading: 'Fix the Bug',
      problem: 'This swap function does not actually swap the values — the array is unchanged.',
      code: `void swap(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
    // arr is unchanged after calling swap(arr[0], arr[1])
}`,
      hint: 'Java passes primitives by value. Changes to a and b do not affect the original array.',
      expectedFix: 'arr',
      correctFeedback: {
        title: 'Correct insight',
        body: 'To swap array elements, pass the array and indices directly: temp=arr[i]; arr[i]=arr[j]; arr[j]=temp. Passing int values creates copies.',
        reinforcement: 'Java is always pass-by-value. For primitives, that means the function gets a copy — modifying it changes nothing outside.',
      },
    },
    {
      type: 'reflection',
      id: 'summary-bubble',
      heading: 'What You Have Learned',
      keyInsights: [
        'Bubble sort compares adjacent pairs and swaps if out of order — O(n²) time',
        'After each full pass, the next largest element is in its final position',
        'The early-exit optimization makes already-sorted arrays O(n)',
        'Swap in Java requires the array and indices directly — not copied primitive values',
        'Bubble sort is a teaching tool, not a production algorithm — use Arrays.sort() in practice',
      ],
      rememberedPattern: 'Bubble sort is O(n²) because it uses two nested loops. Any time you see nested loops over the same array, think O(n²).',
    },
  ],
}
