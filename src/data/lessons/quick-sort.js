export const lessonData = {
  slug: 'quick-sort',
  title: 'Quick Sort',
  subtitle: 'Pick a pivot, partition around it, recurse — O(n log n) average.',
  badge: 'Lesson 13 · Core Logic',
  estimatedTime: '18 min',
  blocks: [
    {
      type: 'concept',
      id: 'quick-idea',
      heading: 'The Core Idea',
      body: `Quick sort picks one element as the pivot and rearranges the array so that:
- All elements smaller than the pivot are to its left
- All elements larger than the pivot are to its right

The pivot is now in its final sorted position. Recursively sort both halves.

Unlike merge sort which always divides exactly in half, quick sort's split depends on the pivot choice. A good pivot splits the array roughly in half → O(n log n). A bad pivot (always min or max) → O(n²).

Average case: O(n log n). Worst case: O(n²). In practice, quick sort is often faster than merge sort due to better cache performance.`,
    },
    {
      type: 'worked-sample',
      id: 'partition-sample',
      heading: 'The Partition Step — Lomuto Scheme',
      code: `int partition(int[] arr, int low, int high) {
    int pivot = arr[high];   // last element as pivot
    int i = low - 1;          // boundary of smaller elements
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(arr, i, j); // move smaller element left
        }
    }
    swap(arr, i + 1, high);  // place pivot in final position
    return i + 1;             // pivot's index
}`,
      steps: [
        { line: '2', explanation: 'Choose the last element as pivot. All elements will be compared to this.' },
        { line: '3', explanation: 'i marks the boundary: everything at index ≤ i is smaller than pivot.' },
        { line: '4-8', explanation: 'Walk j from low to high-1. When arr[j] ≤ pivot, expand the left partition by incrementing i and swapping arr[i] with arr[j].' },
        { line: '9-10', explanation: 'Place pivot at i+1 (between the two partitions). Return its final index.' },
      ],
      result: '[3,1,5,2,4] with pivot=4 → [3,1,2,4,5] — pivot 4 is now at index 3',
    },
    {
      type: 'worked-sample',
      id: 'quicksort-sample',
      heading: 'Quick Sort — Full Algorithm',
      code: `void quickSort(int[] arr, int low, int high) {
    if (low >= high) return;         // base case
    int pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);    // sort left of pivot
    quickSort(arr, pi + 1, high);   // sort right of pivot
}

// Call: quickSort(arr, 0, arr.length - 1);`,
      steps: [
        { line: '2', explanation: 'Base case: zero or one element is already sorted.' },
        { line: '3', explanation: 'Partition returns the pivot\'s final index. Everything left is smaller, everything right is larger.' },
        { line: '4-5', explanation: 'Recursively sort both sub-arrays. The pivot itself never moves again.' },
      ],
      result: 'Sorts in-place — no extra array needed (unlike merge sort)',
    },
    {
      type: 'exercise',
      id: 'predict-qsort-1',
      exerciseType: 'predict-output',
      heading: 'Predict the Pivot Position',
      prompt: 'Array: [3, 6, 8, 10, 1, 2, 1]. Pivot = arr[high] = 1. After partition, what index is pivot at?',
      code: `// arr = [3, 6, 8, 10, 1, 2, 1]
// pivot = arr[6] = 1
// All elements <= 1: only arr[4]=1
// After partition: [1, 1, 8, 10, 6, 2, 3] or similar
// Pivot's final position?`,
      expectedAnswer: '1',
      options: ['0', '1', '2', '6'],
      correctFeedback: {
        title: 'Correct — pivot lands at index 1',
        body: 'Elements ≤ 1: two 1s (indices 4 and 6). After partition, pivot (1) sits at index 1 with one smaller-or-equal element to its left.',
        reinforcement: 'The partition step guarantees: all left of pivot < pivot, all right of pivot ≥ pivot. The pivot never moves again.',
      },
      wrongAnswerFeedback: {
        '0': { title: 'Index 0 would mean nothing is smaller than pivot', hint: 'arr[4]=1 is also equal to pivot, so it goes to the left partition', body: 'Elements ≤ pivot (1): arr[4]=1. That is 1 element. Pivot goes to index i+1 = 0+1 = 1.' },
        '2': { title: 'That would require 2 elements smaller than pivot', hint: 'Count elements strictly ≤ 1 in the array', body: 'Only arr[4]=1 is ≤ 1. So i ends at 0 and pivot is placed at i+1 = 1.' },
        '6': { title: 'That is where pivot started, not where it ends', hint: 'partition() moves the pivot from arr[high] to its sorted position', body: 'The pivot starts at index 6 but the algorithm moves it to its correct sorted position.' },
      },
    },
    {
      type: 'exercise',
      id: 'drag-qsort-1',
      exerciseType: 'drag-arrange',
      heading: 'Order the Steps',
      prompt: 'Arrange the steps of quick sort in correct execution order:',
      items: [
        'Recursively sort right sub-array',
        'Choose a pivot element',
        'Recursively sort left sub-array',
        'Return if sub-array has 0 or 1 elements',
        'Partition array around pivot',
      ],
      correctOrder: [
        'Return if sub-array has 0 or 1 elements',
        'Choose a pivot element',
        'Partition array around pivot',
        'Recursively sort left sub-array',
        'Recursively sort right sub-array',
      ],
      hint: 'Start with the base case. Then the main work. Then the recursive calls.',
      correctFeedback: {
        title: 'Correct order',
        body: 'Base case first, then partition (main work), then recurse both sides. This is the template for all divide-and-conquer algorithms.',
        reinforcement: 'Notice: unlike merge sort, the work (partition) happens BEFORE the recursive calls, not after.',
      },
      wrongFeedback: {
        title: 'Not quite',
        body: 'In quick sort, partition happens BEFORE recursion. In merge sort, merge happens AFTER recursion. This is the key structural difference.',
        hint: 'Base case → pivot → partition → recurse left → recurse right.',
      },
    },
    {
      type: 'exercise',
      id: 'choose-qsort-1',
      exerciseType: 'choose-complexity',
      heading: 'Time Complexity',
      scenario: 'Quick sort on a randomly shuffled array of n elements.',
      question: 'What is the average-case time complexity?',
      options: ['O(n)', 'O(n²)', 'O(n log n)'],
      expectedAnswer: 'O(n log n)',
      correctFeedback: {
        title: 'Correct — O(n log n) average',
        body: 'On average, each partition splits the array roughly in half. log n levels of recursion × O(n) partition work = O(n log n).',
        reinforcement: 'Worst case is O(n²) when pivot is always min or max (already sorted array with last-element pivot). This is why production code uses randomized pivot selection.',
      },
      wrongAnswerFeedback: {
        'O(n)': { title: 'That would mean one pass only', body: 'Quick sort recurses log n levels, each requiring O(n) partition work.' },
        'O(n²)': { title: 'That is worst case, not average', body: 'O(n²) happens when pivots are always extreme values. Random data produces O(n log n) average.' },
      },
    },
    {
      type: 'exercise',
      id: 'fix-qsort-1',
      exerciseType: 'fix-the-bug',
      heading: 'Fix the Bug',
      problem: 'This quick sort infinite-loops on single-element sub-arrays.',
      code: `void quickSort(int[] arr, int low, int high) {
    if (low > high) return;
    int pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
}`,
      hint: 'What happens when low == high (single element)? Does the function return?',
      expectedFix: 'low >= high',
      correctFeedback: {
        title: 'Correct fix',
        body: 'low > high handles empty sub-arrays but misses the single-element case (low == high). Using low >= high covers both correctly.',
        reinforcement: 'Always use >= for divide-and-conquer base cases to handle both empty and single-element sub-arrays.',
      },
    },
    {
      type: 'reflection',
      id: 'summary-qsort',
      heading: 'What You Have Learned',
      keyInsights: [
        'Quick sort: choose pivot, partition around it, recurse both sides — O(n log n) average',
        'Partition places pivot at its final sorted position in O(n)',
        'Worst case O(n²) occurs when pivot is always min or max — use random pivot to avoid',
        'Quick sort is in-place (O(1) extra space) vs merge sort which needs O(n) extra space',
        'In practice, quick sort is often faster than merge sort due to cache locality',
      ],
      rememberedPattern: 'Quick sort template: base case (low >= high), partition (pivot goes to final position), recurse left and right. The partition step is where all the work happens.',
    },
  ],
}
