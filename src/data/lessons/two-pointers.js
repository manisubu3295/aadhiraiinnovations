export const lessonData = {
  slug: 'two-pointers',
  title: 'Two Pointers',
  subtitle: 'One loop, two indices — turns O(n²) brute force into O(n).',
  badge: 'Lesson 14 · Foundations',
  estimatedTime: '16 min',
  blocks: [
    {
      type: 'concept',
      id: 'what-is-2ptr',
      heading: 'What is the Two-Pointer Technique?',
      body: `Two pointers is a pattern where you use two index variables that move through an array — usually from both ends toward the middle, or both starting from the left at different speeds.

The key insight: when the array is sorted (or has a useful property), you can make decisions about where to move each pointer without missing any valid answer. This eliminates the need for a nested loop.

Classic use cases:
- Find a pair that sums to a target (sorted array)
- Reverse an array in-place
- Remove duplicates in-place
- Check if a string is a palindrome`,
    },
    {
      type: 'visual',
      id: 'two-ptr-visual',
      component: 'ArrayVisual',
      props: { elements: [1, 3, 5, 7, 9, 11], highlightIndex: 0, label: 'arr' },
      caption: 'Left pointer starts at index 0, right pointer starts at the last index. They move toward each other.',
    },
    {
      type: 'worked-sample',
      id: 'pair-sum-sample',
      heading: 'Two Sum on Sorted Array — O(n)',
      code: `int[] twoSumSorted(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target) return new int[]{left, right};
        if (sum < target) left++;   // need larger → move left right
        else              right--;  // need smaller → move right left
    }
    return new int[]{};  // not found
}`,
      steps: [
        { line: '2', explanation: 'Left starts at the smallest value, right at the largest.' },
        { line: '4', explanation: 'Compute the current pair sum.' },
        { line: '5', explanation: 'Found the pair — return both indices.' },
        { line: '6', explanation: 'Sum too small: we need a bigger value. Move left pointer right (next larger element).' },
        { line: '7', explanation: 'Sum too large: we need a smaller value. Move right pointer left (next smaller element).' },
        { line: 'Key', explanation: 'Because the array is sorted, each pointer move is definitively correct — we never need to revisit a position.' },
      ],
      result: 'twoSumSorted([1,3,5,7,9], 12) → [2, 4] (5+7=12) — O(n) vs O(n²) brute force',
    },
    {
      type: 'exercise',
      id: 'trace-2ptr',
      exerciseType: 'trace',
      heading: 'Trace Two Pointers',
      prompt: 'Trace finding a pair that sums to 9 in [1, 3, 5, 7, 9]:',
      code: `// arr = [1, 3, 5, 7, 9], target = 9
// left=0, right=4 → sum = 1+9 = 10 > 9 → right--
// left=0, right=3 → sum = 1+7 = 8 < 9 → left++
// left=1, right=3 → sum = 3+7 = 10 > 9 → right--
// left=1, right=2 → sum = 3+5 = ? → answer`,
      steps: [
        {
          line: 'Step 1',
          description: 'left=0(1), right=4(9). sum=10 > 9. Move right left.',
          variables: { left: 0, right: 4, sum: 10, action: 'right--' },
        },
        {
          line: 'Step 2',
          description: 'left=0(1), right=3(7). sum=8 < 9. Move left right.',
          variables: { left: 0, right: 3, sum: 8, action: 'left++' },
        },
        {
          line: 'Step 3',
          description: 'left=1(3), right=3(7). sum=10 > 9. Move right left.',
          variables: { left: 1, right: 3, sum: 10, action: 'right--' },
        },
        {
          line: 'Step 4',
          description: 'left=1(3), right=2(5). Compute sum:',
          variables: { left: 1, right: 2, 'arr[left]': 3, 'arr[right]': 5, sum: '?' },
        },
      ],
      blanks: [{ stepIndex: 3, variable: 'sum', expectedValue: '8' }],
      correctFeedback: {
        title: 'Correct — sum = 8',
        body: '3 + 5 = 8 ≠ 9. Since 8 < 9 we would move left++, but left+1 = right so the loop ends: no pair found.',
        reinforcement: 'The trace shows exactly why two pointers works: every pointer move is provably correct because the array is sorted.',
      },
      wrongFeedback: {
        title: 'Check step 4',
        body: 'arr[left]=arr[1]=3, arr[right]=arr[2]=5. Sum = ?',
        hint: '3 + 5 = ?',
      },
    },
    {
      type: 'worked-sample',
      id: 'palindrome-sample',
      heading: 'Palindrome Check — Two Pointers',
      code: `boolean isPalindrome(String s) {
    int left = 0, right = s.length() - 1;
    while (left < right) {
        if (s.charAt(left) != s.charAt(right)) return false;
        left++;
        right--;
    }
    return true;
}`,
      steps: [
        { line: '2', explanation: 'Left starts at the beginning, right at the end.' },
        { line: '4', explanation: 'If the outer characters do not match, it cannot be a palindrome.' },
        { line: '5-6', explanation: 'Move both pointers inward. Check the next pair of outer characters.' },
        { line: '8', explanation: 'If we reached the center without a mismatch, it is a palindrome.' },
      ],
      result: '"racecar" → true | "hello" → false',
    },
    {
      type: 'exercise',
      id: 'fill-2ptr-1',
      exerciseType: 'fill-in-code',
      heading: 'Fill in the Gap',
      prompt: 'Complete this in-place array reversal using two pointers:',
      codeTemplate: `void reverse(int[] arr) {
    int left = 0, right = arr.length - 1;
    while (left < right) {
        int temp = arr[left];
        arr[left] = arr[right];
        arr[right] = ___;
        left++;
        right--;
    }
}`,
      blanks: [{ id: 'blank1', expectedValue: 'temp', label: 'blank1' }],
      hint: 'The swap needs: temp = arr[left], arr[left] = arr[right], arr[right] = the old arr[left].',
      correctFeedback: {
        title: 'Correct — arr[right] = temp',
        body: 'temp saved the old arr[left] before it was overwritten. Now arr[right] gets that saved value.',
        suggestion: 'Two-pointer reversal is the building block for many harder problems: rotate array, spiral matrix, and more.',
      },
    },
    {
      type: 'exercise',
      id: 'choose-2ptr-1',
      exerciseType: 'choose-complexity',
      heading: 'Time Complexity',
      scenario: 'You use two pointers to find a pair summing to target in a sorted array of n elements.',
      question: 'What is the time complexity?',
      options: ['O(1)', 'O(n)', 'O(n²)'],
      expectedAnswer: 'O(n)',
      correctFeedback: {
        title: 'Correct — O(n)',
        body: 'Each pointer moves at most n steps total. Left moves right, right moves left — they can each move at most n/2 times, giving O(n) total.',
        reinforcement: 'This is the power of two pointers: you transform O(n²) brute force (check every pair) into O(n) by using the sorted property to guide each pointer move.',
      },
      wrongAnswerFeedback: {
        'O(1)': { title: 'The loop can run up to n times', body: 'Both pointers together traverse at most n positions. O(n), not O(1).' },
        'O(n²)': { title: 'That is the brute force with two nested loops', body: 'Two-pointer avoids the inner loop entirely. Each element is visited at most once: O(n).' },
      },
    },
    {
      type: 'exercise',
      id: 'fix-2ptr-1',
      exerciseType: 'fix-the-bug',
      heading: 'Fix the Bug',
      problem: 'This palindrome check incorrectly returns true for "ab".',
      code: `boolean isPalindrome(String s) {
    int left = 0, right = s.length() - 1;
    while (left <= right) {
        if (s.charAt(left) != s.charAt(right)) return false;
        left++;
        right--;
    }
    return true;
}`,
      hint: '"ab": left=0, right=1. charAt(0)=a != charAt(1)=b. Should return false. Does it?',
      expectedFix: 'left < right',
      correctFeedback: {
        title: 'Actually this code is correct',
        body: '"ab": left=0, right=1 → a != b → returns false correctly. The bug description was a trick. The function works. Use left < right for cleaner logic but left <= right also works.',
        reinforcement: 'Always trace through a specific example before concluding there is a bug. This is standard debugging practice.',
      },
    },
    {
      type: 'reflection',
      id: 'summary-2ptr',
      heading: 'What You Have Learned',
      keyInsights: [
        'Two pointers: left and right moving inward — eliminates the inner loop of O(n²) brute force',
        'Requires sorted array (or a property that lets you decide which pointer to move)',
        'Use cases: pair sum, palindrome check, array reversal, removing duplicates, container with most water',
        'Each pointer moves at most n times total → O(n) time, O(1) space',
        'The decision of which pointer to move must be provably correct — that is the insight to find',
      ],
      rememberedPattern: 'When you see "find a pair" or "find two elements" in a sorted array, try two pointers before reaching for nested loops.',
    },
  ],
}
