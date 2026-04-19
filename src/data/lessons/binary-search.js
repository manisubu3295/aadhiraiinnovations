export const lessonData = {
  slug: 'binary-search',
  title: 'Binary Search in Java',
  subtitle: 'Cut the search space in half with every single step.',
  badge: 'Lesson 5 · Core DSA',
  estimatedTime: '16 min',
  blocks: [
    {
      type: 'concept',
      id: 'what-is-bs',
      heading: 'What is Binary Search?',
      body: `Binary search finds a target value in a sorted array by repeatedly halving the search space.

Instead of checking every element (O(n)), you check the middle element each step:
- If it equals the target — found it
- If the target is smaller — search the left half
- If the target is larger — search the right half

With each comparison you eliminate half the remaining elements. On an array of 1,000,000 elements, you find the answer in at most 20 comparisons. That is O(log n).`,
    },
    {
      type: 'visual',
      id: 'bs-visual',
      component: 'ArrayVisual',
      props: { elements: [2, 7, 13, 21, 35, 48, 56], highlightIndex: 3, label: 'sorted' },
      caption: 'Index 3 (value 21) is the midpoint of this sorted array. Binary search always checks the middle first.',
    },
    {
      type: 'worked-sample',
      id: 'bs-iterative',
      heading: 'Binary Search — Iterative',
      code: `int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
      steps: [
        { line: '2', explanation: 'left and right define the current search window — initially the whole array.' },
        { line: '3', explanation: 'Continue while the window has at least one element (left <= right).' },
        { line: '4', explanation: 'Use left + (right - left) / 2 instead of (left + right) / 2 to prevent integer overflow.' },
        { line: '5', explanation: 'Found the target — return its index.' },
        { line: '6', explanation: 'Target is in the right half — move left boundary past mid.' },
        { line: '7', explanation: 'Target is in the left half — move right boundary before mid.' },
        { line: '9', explanation: 'Window is empty — target not found, return -1.' },
      ],
      result: 'binarySearch([2,7,13,21,35,48,56], 35) → 4',
    },
    {
      type: 'exercise',
      id: 'predict-bs-1',
      exerciseType: 'predict-output',
      heading: 'Predict the Output',
      prompt: 'Array: [1, 3, 5, 7, 9]. Target: 7. How many comparisons does binary search make?',
      code: `// arr = [1, 3, 5, 7, 9], target = 7
// Step 1: left=0, right=4, mid=2, arr[2]=5 < 7 → go right
// Step 2: left=3, right=4, mid=3, arr[3]=7 == 7 → found!`,
      expectedAnswer: '2',
      options: ['1', '2', '3', '5'],
      correctFeedback: {
        title: 'Correct — 2 comparisons',
        body: 'Step 1 checks index 2 (value 5), goes right. Step 2 checks index 3 (value 7), found. Two comparisons for 5 elements.',
        reinforcement: 'Linear search on 5 elements might take 4 comparisons. Binary search needed 2. This advantage grows enormously with scale.',
      },
      wrongAnswerFeedback: {
        '1': { title: 'The first comparison does not hit the target', hint: 'mid of [0..4] is 2, and arr[2]=5, not 7', body: 'First comparison finds 5, not 7. A second comparison is needed.' },
        '3': { title: 'Only 2 comparisons were needed', hint: 'After going right, the new window is [3..4] with mid=3', body: 'arr[3]=7 matches on the second comparison. Done in 2 steps.' },
        '5': { title: 'Linear search would need up to 5. Binary search is faster.', hint: 'Binary search eliminates half on each step', body: '5 comparisons is linear search. Binary search found 7 in just 2.' },
      },
      gated: true,
    },
    {
      type: 'concept',
      id: 'overflow-fix',
      heading: 'The Overflow Bug — A Classic Mistake',
      body: `Many engineers write:
int mid = (left + right) / 2;

This works for small arrays but has a hidden bug: if left and right are both near Integer.MAX_VALUE, their sum overflows to a negative number.

The safe version:
int mid = left + (right - left) / 2;

This gives the same result mathematically but never overflows because (right - left) cannot exceed the array size, which fits in an int.

This is a real bug that existed in Java's Arrays.binarySearch() until 2006.`,
    },
    {
      type: 'exercise',
      id: 'fill-bs-1',
      exerciseType: 'fill-in-code',
      heading: 'Fill in the Gap',
      prompt: 'Complete the safe mid calculation that avoids integer overflow:',
      codeTemplate: `int left = 0, right = arr.length - 1;
while (left <= right) {
    int mid = left + (___ - left) / 2;
    // rest of search...
}`,
      blanks: [{ id: 'blank1', expectedValue: 'right', label: 'blank1' }],
      hint: 'You want: left plus half the distance between left and right.',
      correctFeedback: {
        title: 'Exactly right',
        body: 'left + (right - left) / 2 is mathematically identical to (left + right) / 2 but never overflows.',
        suggestion: 'Always use this form. It is a standard interview expectation for binary search.',
      },
      gated: true,
    },
    {
      type: 'exercise',
      id: 'complexity-bs-1',
      exerciseType: 'choose-complexity',
      heading: 'Time Complexity',
      scenario: 'You run binary search on a sorted array of 1,000,000 elements.',
      question: 'What is the worst-case number of comparisons?',
      options: ['O(1)', 'O(n)', 'O(log n)'],
      expectedAnswer: 'O(log n)',
      correctFeedback: {
        title: 'Correct — O(log n)',
        body: 'log2(1,000,000) ≈ 20. Binary search finds the answer in at most 20 comparisons, regardless of input. This is the power of halving.',
        reinforcement: 'O(log n) means doubling the input only adds one more comparison. It scales beautifully.',
      },
      wrongAnswerFeedback: {
        'O(1)': { title: 'That would mean always finding in one step', body: 'Only a direct hash lookup is O(1). Binary search does multiple comparisons — just far fewer than O(n).' },
        'O(n)': { title: 'That is linear search — checking every element', body: 'Binary search eliminates half with each comparison. For 1M elements: ~20 steps, not 1,000,000.' },
      },
      gated: true,
    },
    {
      type: 'exercise',
      id: 'fix-bs-1',
      exerciseType: 'fix-the-bug',
      heading: 'Fix the Bug',
      problem: 'This binary search runs forever on arrays where the target is not present.',
      code: `int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
      hint: 'When does the loop terminate? What happens when left equals right but is not the target?',
      expectedFix: 'left <= right',
      correctFeedback: {
        title: 'Correct fix',
        body: 'left < right stops one step too early. When left == right there is still one element to check. left <= right ensures that final element is examined.',
        reinforcement: 'This exact off-by-one error is the most common binary search bug. Always use left <= right.',
      },
      gated: true,
    },
    {
      type: 'reflection',
      id: 'summary-bs',
      heading: 'What You Have Learned',
      keyInsights: [
        'Binary search requires a sorted array and works by halving the search space each step',
        'Time complexity is O(log n) — for 1M elements, at most 20 comparisons',
        'Use left + (right - left) / 2, never (left + right) / 2, to avoid integer overflow',
        'The loop condition must be left <= right, not left < right, or you miss the last element',
        'Binary search variants: find first occurrence, find last occurrence, find insertion point',
      ],
      rememberedPattern: 'Binary search template: while (left <= right), mid = left + (right-left)/2, narrow window by moving left or right past mid. Return -1 outside loop.',
    },
  ],
}
