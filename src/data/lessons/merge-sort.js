export const lessonData = {
  slug: 'merge-sort',
  title: 'Merge Sort',
  subtitle: 'Divide in half, sort each half, merge — and suddenly O(n log n).',
  badge: 'Lesson 11 · Core Logic',
  estimatedTime: '18 min',
  blocks: [
    {
      type: 'concept',
      id: 'merge-idea',
      heading: 'The Core Idea',
      body: `Merge sort uses divide and conquer:

1. Divide the array in half
2. Recursively sort each half
3. Merge the two sorted halves into one sorted array

The key insight: merging two sorted arrays into one is O(n). And dividing log(n) times means total work is O(n log n).

This is fundamentally different from bubble sort. Instead of fixing one element at a time, we divide the problem until it is trivial (a single element) and build the solution back up.`,
    },
    {
      type: 'worked-sample',
      id: 'merge-sort-code',
      heading: 'Merge Sort — Implementation',
      code: `void mergeSort(int[] arr, int left, int right) {
    if (left >= right) return;  // base case: 1 element
    int mid = left + (right - left) / 2;
    mergeSort(arr, left, mid);        // sort left half
    mergeSort(arr, mid + 1, right);   // sort right half
    merge(arr, left, mid, right);     // merge the two
}

void merge(int[] arr, int left, int mid, int right) {
    int[] temp = new int[right - left + 1];
    int i = left, j = mid + 1, k = 0;
    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) temp[k++] = arr[i++];
        else                   temp[k++] = arr[j++];
    }
    while (i <= mid)   temp[k++] = arr[i++];
    while (j <= right) temp[k++] = arr[j++];
    System.arraycopy(temp, 0, arr, left, temp.length);
}`,
      steps: [
        { line: '2', explanation: 'Base case: a single element is already sorted. Stop dividing.' },
        { line: '3-6', explanation: 'Find the midpoint. Recursively sort both halves. Then merge.' },
        { line: '10-14', explanation: 'Compare the front of each half. Take the smaller one into temp each time.' },
        { line: '15-16', explanation: 'Copy any remaining elements from the half that was not exhausted.' },
        { line: '17', explanation: 'Copy temp back into the original array at the correct position.' },
      ],
      result: '[5, 3, 8, 1] → [3, 5] + [1, 8] → merge → [1, 3, 5, 8]',
    },
    {
      type: 'concept',
      id: 'merge-complexity',
      heading: 'Why O(n log n)?',
      body: `Two facts combine to give O(n log n):

Fact 1: The array is divided in half each time.
How many times can you halve n? log₂(n) times.
An array of 8 splits into: 8 → 4, 4 → 2, 2 → 1. That is 3 = log₂(8) levels.

Fact 2: At each level, the total merging work is O(n).
Level 1: merge 2 halves of size n/2 → n comparisons.
Level 2: merge 4 halves of size n/4 → n comparisons total.
Level k: merge 2^k halves → n comparisons total.

Total: n comparisons × log n levels = O(n log n).`,
    },
    {
      type: 'exercise',
      id: 'trace-merge',
      exerciseType: 'trace',
      heading: 'Trace the Merge',
      prompt: 'Two sorted halves are being merged. Trace what temp looks like:',
      code: `// left half:  [1, 5]
// right half: [2, 4]
// Merge: compare fronts, take smaller
// Step 1: 1 vs 2 → take 1 → temp = [1, ?, ?, ?]
// Step 2: 5 vs 2 → take 2 → temp = [1, 2, ?, ?]
// Step 3: 5 vs 4 → take 4 → temp = [1, 2, 4, ?]
// Step 4: 4 exhausted → take 5 → temp = ?`,
      steps: [
        {
          line: 'Step 1',
          description: 'Compare 1 and 2. 1 is smaller. Take 1.',
          variables: { 'temp[0]': 1, 'left ptr': 'moves to 5', 'right ptr': 'stays at 2' },
        },
        {
          line: 'Step 2',
          description: 'Compare 5 and 2. 2 is smaller. Take 2.',
          variables: { 'temp[1]': 2, 'left ptr': 'stays at 5', 'right ptr': 'moves to 4' },
        },
        {
          line: 'Step 3-4',
          description: 'Compare 5 and 4. 4 smaller. Take 4. Right exhausted. Take 5.',
          variables: { 'temp[2]': 4, 'temp[3]': '?', 'result': '[1, 2, 4, ?]' },
        },
      ],
      blanks: [{ stepIndex: 2, variable: 'temp[3]', expectedValue: '5' }],
      correctFeedback: {
        title: 'Perfect trace',
        body: 'After right half is exhausted, remaining left elements (just 5) are copied directly. Final: [1, 2, 4, 5].',
        reinforcement: 'The merge step is the clever part of merge sort. Two sorted halves merge in O(n) — no comparisons wasted.',
      },
      wrongFeedback: {
        title: 'Check step 4',
        body: 'Once the right half is exhausted (both 2 and 4 are used), remaining elements from the left half copy directly. Only 5 remains.',
        hint: 'The left half still has [5] remaining. Copy it to temp[3].',
      },
    },
    {
      type: 'exercise',
      id: 'predict-merge-1',
      exerciseType: 'predict-output',
      heading: 'Predict the Output',
      prompt: 'After merging these two sorted subarrays, what is the first element?',
      code: `// left:  [2, 6, 8]
// right: [1, 4, 9]
// After full merge, result[0] = ?`,
      expectedAnswer: '1',
      options: ['1', '2', '4', '6'],
      correctFeedback: {
        title: 'Correct — 1 is the smallest',
        body: 'The merge compares the fronts of both halves: 2 vs 1. 1 is smaller, so it goes first in the result.',
        reinforcement: 'The first element of a merged array is always the smaller of the two half-front elements.',
      },
      wrongAnswerFeedback: {
        '2': { title: 'Check the right half first element', hint: 'Compare left[0]=2 and right[0]=1. Which is smaller?', body: '1 < 2, so 1 goes first.' },
        '4': { title: '4 is the second element of the right half', hint: 'Merge starts by comparing left[0] and right[0]', body: 'The merge starts with 2 vs 1. 1 wins the first position.' },
        '6': { title: '6 is the second element of the left half', hint: 'The merge starts at the beginning of both halves', body: 'First comparison is left[0]=2 vs right[0]=1. 1 is placed first.' },
      },
    },
    {
      type: 'exercise',
      id: 'choose-merge-1',
      exerciseType: 'choose-complexity',
      heading: 'Time Complexity',
      scenario: 'You run merge sort on an array of n elements.',
      question: 'What is the time complexity in all cases?',
      options: ['O(n)', 'O(n²)', 'O(n log n)'],
      expectedAnswer: 'O(n log n)',
      correctFeedback: {
        title: 'Correct — O(n log n) always',
        body: 'Merge sort divides log n times and does O(n) work per level. Critically, this is O(n log n) in best, average, AND worst case — unlike quick sort.',
        reinforcement: 'This guaranteed O(n log n) makes merge sort preferred for sorting linked lists and for external sorting (too large for RAM).',
      },
      wrongAnswerFeedback: {
        'O(n)': { title: 'O(n) would mean one pass — merge sort has log n passes', body: 'Each level of recursion does O(n) work, and there are log n levels: n log n total.' },
        'O(n²)': { title: 'That is bubble sort — merge sort is faster', body: 'Merge sort avoids redundant comparisons by merging sorted halves. Result: O(n log n) instead of O(n²).' },
      },
    },
    {
      type: 'exercise',
      id: 'fix-merge-1',
      exerciseType: 'fix-the-bug',
      heading: 'Fix the Bug',
      problem: 'This base case causes infinite recursion.',
      code: `void mergeSort(int[] arr, int left, int right) {
    if (left == right) return; // BUG
    int mid = left + (right - left) / 2;
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
}`,
      hint: 'What happens when left > right? Can that occur?',
      expectedFix: 'left >= right',
      correctFeedback: {
        title: 'Correct — use >= not ==',
        body: 'If left > right (empty subarray), the function must return immediately. left == right handles one element, but left > right must also be handled.',
        reinforcement: 'Always use >= for recursive base cases in divide-and-conquer to handle edge cases where the window becomes empty.',
      },
    },
    {
      type: 'reflection',
      id: 'summary-merge',
      heading: 'What You Have Learned',
      keyInsights: [
        'Merge sort uses divide and conquer: split in half, sort recursively, merge back',
        'Time complexity is O(n log n) in all cases — best, average, and worst',
        'Space complexity is O(n) — needs a temporary array for merging',
        'The merge step is O(n): two pointers walk through both sorted halves once',
        'Merge sort is stable — equal elements maintain their relative order',
      ],
      rememberedPattern: 'Merge sort template: base case (≤1 element), find mid, recurse left, recurse right, merge. If you can split a problem in half and merge solutions in linear time, you get O(n log n).',
    },
  ],
}
