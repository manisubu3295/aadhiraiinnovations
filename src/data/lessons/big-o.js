export const lessonData = {
  slug: 'big-o',
  title: 'Big O Notation',
  subtitle: 'The language engineers use to compare algorithms.',
  badge: 'Lesson 7 · Foundations',
  estimatedTime: '16 min',
  blocks: [
    {
      type: 'concept',
      id: 'what-is-big-o',
      heading: 'What is Big O?',
      body: `Big O notation describes how an algorithm's runtime grows as the input size grows. It answers: "If I double the input, what happens to the time?"

We ignore constants and small terms because they become irrelevant at scale. We only care about the dominant growth factor.

O(n) means: if you double n, you roughly double the time.
O(n²) means: if you double n, you roughly quadruple the time.
O(log n) means: if you double n, you add just one more step.`,
    },
    {
      type: 'concept',
      id: 'why-it-matters',
      heading: 'Why It Matters',
      body: `Imagine two algorithms that both sum an array of numbers.

Algorithm A loops through every element: n operations.
Algorithm B uses a math formula: 1 operation.

On 10 elements the difference is small. On 10 million elements:
- Algorithm A: 10,000,000 operations
- Algorithm B: 1 operation

Big O lets you predict performance at scale before writing a single line of production code.`,
    },
    {
      type: 'worked-sample',
      id: 'o1-example',
      heading: 'O(1) — Constant Time',
      code: `int getFirst(int[] arr) {
    return arr[0];  // always 1 step
}

int addTwo(int a, int b) {
    return a + b;   // always 1 step
}`,
      steps: [
        { line: '2', explanation: 'Accessing arr[0] is one memory lookup. Array size does not matter.' },
        { line: '7', explanation: 'Addition is one CPU instruction. Input size does not matter.' },
        { line: 'Both', explanation: 'O(1) means the number of operations is constant — independent of input size. This is the best possible complexity.' },
      ],
      result: 'O(1) — same speed for n=1 or n=1,000,000',
    },
    {
      type: 'worked-sample',
      id: 'on-example',
      heading: 'O(n) — Linear Time',
      code: `int sum(int[] arr) {
    int total = 0;
    for (int i = 0; i < arr.length; i++) {
        total += arr[i];   // runs n times
    }
    return total;
}`,
      steps: [
        { line: '3-5', explanation: 'The loop runs once for each element. If n doubles, the loop runs twice as long.' },
        { line: 'Pattern', explanation: 'Any single loop that visits every element is O(n). Two nested loops over the same array would be O(n²).' },
      ],
      result: 'O(n) — time grows linearly with input',
    },
    {
      type: 'exercise',
      id: 'predict-big-o-1',
      exerciseType: 'predict-output',
      heading: 'Predict the Complexity',
      prompt: 'What is the Big O of this function?',
      code: `boolean contains(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) return true;
    }
    return false;
}`,
      expectedAnswer: 'O(n)',
      options: ['O(1)', 'O(n)', 'O(n²)', 'O(log n)'],
      correctFeedback: {
        title: 'Correct — O(n)',
        body: 'The loop visits up to n elements in the worst case (target not found). One loop over n elements = O(n).',
        reinforcement: 'Best case is O(1) if the first element matches. But Big O describes worst case by convention.',
      },
      wrongAnswerFeedback: {
        'O(1)': { title: 'That would mean always one step', hint: 'The loop can run up to n times', body: 'O(1) is only when the number of steps never depends on input size. A loop that visits every element is O(n).' },
        'O(n²)': { title: 'That needs two nested loops', hint: 'Count the loops: there is only one here', body: 'O(n²) happens with nested loops: for each of n elements, another loop of n. One loop = O(n).' },
        'O(log n)': { title: 'That requires halving the search space each step', hint: 'This checks every element sequentially — no halving', body: 'O(log n) is binary search. This is linear search — visiting each element one by one.' },
      },
    },
    {
      type: 'worked-sample',
      id: 'on2-example',
      heading: 'O(n²) — Quadratic Time',
      code: `void printAllPairs(int[] arr) {
    for (int i = 0; i < arr.length; i++) {
        for (int j = 0; j < arr.length; j++) {
            System.out.println(arr[i] + "," + arr[j]);
        }
    }
}`,
      steps: [
        { line: '2-5', explanation: 'Outer loop runs n times. For each outer iteration, the inner loop runs n times.' },
        { line: 'Math', explanation: 'n × n = n² operations total. If n=100, that is 10,000 prints. If n=1000, that is 1,000,000 prints.' },
        { line: 'Rule', explanation: 'Two nested loops over the same input = O(n²). This is why bubble sort and selection sort are slow on large inputs.' },
      ],
      result: 'O(n²) — time grows as the square of input',
    },
    {
      type: 'exercise',
      id: 'drag-arrange-big-o',
      exerciseType: 'drag-arrange',
      heading: 'Order by Speed',
      prompt: 'Arrange these complexities from fastest to slowest:',
      items: ['O(n²)', 'O(log n)', 'O(n)', 'O(1)', 'O(n log n)'],
      correctOrder: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)'],
      hint: 'Think about what happens when n = 1,000,000 for each.',
      correctFeedback: {
        title: 'Correct order',
        body: 'O(1) < O(log n) < O(n) < O(n log n) < O(n²). This ranking is one of the most important things to memorize in DSA.',
        reinforcement: 'Merge sort and heap sort are O(n log n) — fast sorting. Bubble sort is O(n²) — slow. This is why the algorithm choice matters.',
      },
      wrongFeedback: {
        title: 'Not quite right',
        body: 'Think about each at n = 1,000,000: O(1)=1 step, O(log n)≈20, O(n)=1M, O(n log n)≈20M, O(n²)=1 trillion.',
        hint: 'Constant < logarithmic < linear < linearithmic < quadratic.',
      },
    },
    {
      type: 'exercise',
      id: 'choose-complexity-big-o',
      exerciseType: 'choose-complexity',
      heading: 'What is the complexity?',
      scenario: 'You loop through an array once to find the maximum value.',
      question: 'What is the time complexity?',
      options: ['O(1)', 'O(n)', 'O(log n)'],
      expectedAnswer: 'O(n)',
      correctFeedback: {
        title: 'Correct — O(n)',
        body: 'Finding the max requires visiting every element at least once. No shortcut exists unless the array is sorted.',
        reinforcement: 'Any algorithm that must visit every element at least once is at least O(n). This is called a "linear scan."',
      },
      wrongAnswerFeedback: {
        'O(1)': { title: 'That would mean checking only one element', body: 'To be certain you have the max, you must check all n elements.' },
        'O(log n)': { title: 'That requires sorted data and halving', body: 'Binary search is O(log n) on sorted arrays. An unsorted max scan is O(n).' },
      },
    },
    {
      type: 'exercise',
      id: 'fix-big-o-1',
      exerciseType: 'fix-the-bug',
      heading: 'Fix the Bug',
      problem: 'This function claims to check if an array is sorted in O(1), but it is wrong.',
      code: `boolean isSorted(int[] arr) {
    // "Just check the first and last elements"
    return arr[0] <= arr[arr.length - 1];
}`,
      hint: 'Can you confirm sorted order by only looking at first and last?',
      expectedFix: 'for',
      correctFeedback: {
        title: 'Correct thinking',
        body: 'The fix requires a loop comparing each adjacent pair: arr[i] <= arr[i+1]. You cannot verify sorted order in O(1) — it requires O(n).',
        reinforcement: 'A counterexample: [1, 99, 2, 3, 4] has arr[0]=1 and arr[last]=4 with arr[0] <= arr[last], but it is NOT sorted.',
      },
    },
    {
      type: 'reflection',
      id: 'summary-big-o',
      heading: 'What You Have Learned',
      keyInsights: [
        'Big O describes how runtime grows as input size grows — not exact time',
        'O(1) < O(log n) < O(n) < O(n log n) < O(n²) — memorize this ranking',
        'A single loop = O(n). Two nested loops = O(n²)',
        'Binary search and tree operations are O(log n) because they halve the problem',
        'Big O describes worst case by convention unless stated otherwise',
      ],
      rememberedPattern: 'When you look at code, count the loops. One loop = O(n). Nested loops = O(n²). No loops and no recursion = O(1).',
    },
  ],
}
