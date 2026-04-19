export const lessonData = {
  slug: 'recursion',
  title: 'Recursion in Java',
  subtitle: 'A function that calls itself — until it does not.',
  badge: 'Lesson 6 · Intermediate',
  estimatedTime: '17 min',
  blocks: [
    {
      type: 'concept',
      id: 'what-is-recursion',
      heading: 'What is Recursion?',
      body: `Recursion is when a function calls itself to solve a smaller version of the same problem. Every recursive solution has two parts:

Base case — the condition where the function stops calling itself. Without it, you get infinite recursion and a StackOverflowError.

Recursive case — the function calls itself with a smaller input, making progress toward the base case.

Think of Russian dolls: each doll contains a smaller doll, until you reach the smallest one (the base case).`,
    },
    {
      type: 'worked-sample',
      id: 'factorial-sample',
      heading: 'Factorial — The Classic Example',
      code: `int factorial(int n) {
    if (n <= 1) return 1;       // base case
    return n * factorial(n - 1); // recursive case
}
// factorial(5) = 5 * 4 * 3 * 2 * 1 = 120`,
      steps: [
        { line: '2', explanation: 'Base case: factorial(0) and factorial(1) both equal 1. This stops the recursion.' },
        { line: '3', explanation: 'Recursive case: factorial(n) = n times factorial(n-1). Each call reduces n by 1.' },
        { line: '5', explanation: 'Trace: factorial(5) calls factorial(4) → factorial(3) → ... → factorial(1) = 1. Then unwinds: 2, 6, 24, 120.' },
      ],
      result: 'factorial(5) → 120',
    },
    {
      type: 'concept',
      id: 'call-stack',
      heading: 'The Call Stack — What Happens Inside',
      body: `When factorial(5) runs, each recursive call is pushed onto the call stack:

factorial(5) — waiting
  factorial(4) — waiting
    factorial(3) — waiting
      factorial(2) — waiting
        factorial(1) — returns 1

Then it unwinds (LIFO — like a stack!):
        1 returned
      2 * 1 = 2 returned
    3 * 2 = 6 returned
  4 * 6 = 24 returned
5 * 24 = 120 returned

Each stack frame holds its own n, waiting for the call below it to return. Deep recursion means many frames — this is why you can get StackOverflowError.`,
    },
    {
      type: 'exercise',
      id: 'predict-rec-1',
      exerciseType: 'predict-output',
      heading: 'Predict the Output',
      prompt: 'What does this print?',
      code: `int mystery(int n) {
    if (n == 0) return 0;
    return 1 + mystery(n - 1);
}
System.out.println(mystery(4));`,
      expectedAnswer: '4',
      options: ['0', '1', '4', '10'],
      correctFeedback: {
        title: 'Correct — it counts down to 0',
        body: 'mystery(4) = 1 + mystery(3) = 1 + 1 + mystery(2) = ... = 1+1+1+1+0 = 4.',
        reinforcement: 'This is just a recursive way to count: each call adds 1, base case adds 0.',
      },
      wrongAnswerFeedback: {
        '0': { title: 'That is the base case return value, not the final answer', hint: 'Trace: mystery(4) = 1 + mystery(3). What does mystery(3) return?', body: 'mystery returns 0 only when n==0, but the calling frames all add 1. Total: 4.' },
        '1': { title: 'Only the last call before base case returns 1', hint: 'mystery(4) = 1 + mystery(3). That is 1 plus something, not just 1.', body: 'Each non-base call adds 1. Four recursive calls → 4.' },
        '10': { title: 'That would be 1+2+3+4 — you might be thinking of summing n', hint: 'Each call adds 1, not its own n value', body: 'mystery adds 1 per call (not n), so 4 calls = 4.' },
      },
      gated: true,
    },
    {
      type: 'concept',
      id: 'fibonacci',
      heading: 'Fibonacci and the Memoization Problem',
      body: `Fibonacci with naive recursion is famously slow:

int fib(int n) {
    if (n <= 1) return n;
    return fib(n-1) + fib(n-2);
}

fib(5) calls fib(4) and fib(3). fib(4) also calls fib(3). fib(3) is computed twice. This exponential overlap grows to O(2^n).

Memoization stores computed results so you never recalculate:

Map<Integer, Long> memo = new HashMap<>();
long fib(int n) {
    if (n <= 1) return n;
    if (memo.containsKey(n)) return memo.get(n);
    long result = fib(n-1) + fib(n-2);
    memo.put(n, result);
    return result;
}

Now O(n) — each value computed exactly once.`,
    },
    {
      type: 'exercise',
      id: 'fill-rec-1',
      exerciseType: 'fill-in-code',
      heading: 'Fill in the Gap',
      prompt: 'Complete the recursive sum: sum of all numbers from 1 to n.',
      codeTemplate: `int sum(int n) {
    if (n == 1) return 1;
    return n + sum(___);
}`,
      blanks: [{ id: 'blank1', expectedValue: 'n - 1', label: 'blank1' }],
      hint: 'sum(n) = n + sum of all numbers below n. What is the argument for the recursive call?',
      correctFeedback: {
        title: 'Correct',
        body: 'sum(n) = n + sum(n-1). Each call reduces the problem. sum(1) = 1 (base case). sum(3) = 3+2+1 = 6.',
        suggestion: 'This pattern — return n + recursive(n-1) — appears everywhere: sum, count, max, product.',
      },
      gated: true,
    },
    {
      type: 'exercise',
      id: 'complexity-rec-1',
      exerciseType: 'choose-complexity',
      heading: 'Time Complexity',
      scenario: 'Naive Fibonacci: fib(n) calls fib(n-1) and fib(n-2), with no memoization.',
      question: 'What is the time complexity?',
      options: ['O(n)', 'O(n²)', 'O(2^n)'],
      expectedAnswer: 'O(2^n)',
      correctFeedback: {
        title: 'Correct — O(2^n)',
        body: 'Each call branches into two calls. The call tree has 2^n nodes. fib(50) would require over a quadrillion operations without memoization.',
        reinforcement: 'With memoization it becomes O(n). This is one of the most dramatic optimizations in computer science.',
      },
      wrongAnswerFeedback: {
        'O(n)': { title: 'That would be with memoization', body: 'Naive Fibonacci recomputes the same values many times. Without memoization the call tree doubles at every level — O(2^n).' },
        'O(n²)': { title: 'Closer, but still understating the growth', body: 'Naive Fibonacci is worse than quadratic. Each level doubles: fib(n) has roughly 2^n total function calls.' },
      },
      gated: true,
    },
    {
      type: 'exercise',
      id: 'fix-rec-1',
      exerciseType: 'fix-the-bug',
      heading: 'Fix the Bug',
      problem: 'This recursive function causes a StackOverflowError for any input.',
      code: `int factorial(int n) {
    return n * factorial(n - 1);
}`,
      hint: 'What is missing that would stop the infinite recursion?',
      expectedFix: 'if (n <= 1) return 1',
      correctFeedback: {
        title: 'Correct — the base case was missing',
        body: 'Without a base case, factorial() calls itself forever. Adding if (n <= 1) return 1 stops the recursion at the smallest valid input.',
        reinforcement: 'Every recursive function must have a base case. If you write recursion and get StackOverflowError, a missing or incorrect base case is almost always the reason.',
      },
      gated: true,
    },
    {
      type: 'reflection',
      id: 'summary-recursion',
      heading: 'What You Have Learned',
      keyInsights: [
        'Every recursive function needs a base case — without it you get infinite recursion',
        'The call stack holds one frame per active recursive call — deep recursion uses a lot of memory',
        'Naive recursive Fibonacci is O(2^n) — memoization makes it O(n)',
        'Recursion is the foundation for trees, graphs, divide-and-conquer, and backtracking',
        'When a problem can be reduced to a smaller version of itself, think recursion',
      ],
      rememberedPattern: 'Write the base case first. Then write the recursive case assuming the function works correctly for n-1. If both are right, the whole thing works.',
    },
  ],
}
