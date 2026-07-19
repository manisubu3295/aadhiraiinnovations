export const lessonData = {
  slug: 'hash-sets',
  title: 'HashSets & Deduplication',
  subtitle: 'O(1) existence check — the fastest way to ask "have I seen this before?"',
  badge: 'Lesson 15 · Data Structures',
  estimatedTime: '13 min',
  blocks: [
    {
      type: 'concept',
      id: 'what-is-hashset',
      heading: 'What is a HashSet?',
      body: `A HashSet stores unique values with O(1) average add, remove, and contains operations. It is a HashMap without values — just keys.

Set<Integer> seen = new HashSet<>();
seen.add(5);
seen.add(10);
seen.add(5);           // duplicate — ignored silently
seen.contains(10);     // true — O(1)
seen.contains(99);     // false — O(1)
seen.size();           // 2 — only unique values stored

The core use: instantly answer "have I seen this value before?" without searching or sorting.`,
    },
    {
      type: 'concept',
      id: 'set-vs-map',
      heading: 'HashSet vs HashMap — When to Use Each',
      body: `HashSet: you only care whether something EXISTS.
HashMap: you care about something's ASSOCIATED DATA.

HashSet examples:
- Has this email been registered before?
- Are there duplicate values in this array?
- Has this node been visited in a graph?

HashMap examples:
- How many times has each word appeared?
- What is each user's score?
- Map each number to its index in the array

Rule: if you need a value, use Map. If you only need membership, use Set.`,
    },
    {
      type: 'worked-sample',
      id: 'dedup-sample',
      heading: 'Contains Duplicate — O(n) with HashSet',
      code: `boolean hasDuplicate(int[] nums) {
    Set<Integer> seen = new HashSet<>();
    for (int n : nums) {
        if (seen.contains(n)) return true;
        seen.add(n);
    }
    return false;
}`,
      steps: [
        { line: '2', explanation: 'Empty set to track all values encountered.' },
        { line: '4', explanation: 'Before adding a value, check if we have seen it before. O(1) check.' },
        { line: '5', explanation: 'First time seeing this value — record it.' },
        { line: '7', explanation: 'Finished without finding a duplicate.' },
      ],
      result: 'hasDuplicate([1,2,3,1]) → true  |  hasDuplicate([1,2,3]) → false — O(n)',
    },
    {
      type: 'exercise',
      id: 'predict-set-1',
      exerciseType: 'predict-output',
      heading: 'Predict the Output',
      prompt: 'What does this code print?',
      code: `Set<String> s = new HashSet<>();
s.add("a");
s.add("b");
s.add("a");
System.out.println(s.size());`,
      expectedAnswer: '2',
      options: ['1', '2', '3', 'error'],
      correctFeedback: {
        title: 'Correct — size is 2',
        body: 'HashSet silently ignores duplicate adds. "a" was added twice but stored once. {a, b} → size 2.',
        reinforcement: 'This silent deduplication is the defining feature of all Set implementations in Java.',
      },
      wrongAnswerFeedback: {
        '1': { title: 'Both "a" and "b" are distinct — they both stay', hint: 'HashSet stores all unique values. "a" and "b" are different.', body: '"a" appears once (second add is ignored), "b" appears once. Total: 2 unique values.' },
        '3': { title: 'The second "a" add is silently ignored', hint: 'Sets only store unique values', body: 'add("a") twice = only one "a" stored. {a, b} = 2 elements.' },
        'error': { title: 'Java sets never throw for duplicate adds', hint: 'HashSet.add() returns false for duplicates but does not throw', body: 'add() returns a boolean: true if added, false if already present. No exception.' },
      },
    },
    {
      type: 'worked-sample',
      id: 'longest-consecutive',
      heading: 'Longest Consecutive Sequence — O(n)',
      code: `int longestConsecutive(int[] nums) {
    Set<Integer> set = new HashSet<>();
    for (int n : nums) set.add(n);
    int best = 0;
    for (int n : set) {
        if (!set.contains(n - 1)) {    // start of a sequence
            int len = 1;
            while (set.contains(n + len)) len++;
            best = Math.max(best, len);
        }
    }
    return best;
}`,
      steps: [
        { line: '2-3', explanation: 'Load all values into a set for O(1) lookup.' },
        { line: '5-6', explanation: 'Only start counting from a sequence start (no n-1 in set).' },
        { line: '7-8', explanation: 'Count how far the consecutive sequence extends using the set for O(1) checks.' },
        { line: 'Key', explanation: 'Each number is visited at most twice total → O(n) despite the while loop inside a for loop.' },
      ],
      result: 'longestConsecutive([100,4,200,1,3,2]) → 4  (sequence: 1,2,3,4)',
    },
    {
      type: 'exercise',
      id: 'fill-set-1',
      exerciseType: 'fill-in-code',
      heading: 'Fill in the Gap',
      prompt: 'Complete the function that returns elements appearing in both arrays (intersection):',
      codeTemplate: `List<Integer> intersection(int[] a, int[] b) {
    Set<Integer> setA = new HashSet<>();
    for (int x : a) setA.add(x);
    List<Integer> result = new ArrayList<>();
    for (int x : b) {
        if (setA.___(x)) result.add(x);
    }
    return result;
}`,
      blanks: [{ id: 'blank1', expectedValue: 'contains', label: 'blank1' }],
      hint: 'You need to check whether each element of b exists in setA.',
      correctFeedback: {
        title: 'Correct — contains(x)',
        body: 'setA.contains(x) checks in O(1) if x was in array a. This gives O(n+m) total vs O(n×m) with nested loops.',
        suggestion: 'Java has Set.retainAll() as a one-liner: setA.retainAll(Arrays.stream(b).boxed().collect(Collectors.toSet())).',
      },
    },
    {
      type: 'exercise',
      id: 'choose-set-1',
      exerciseType: 'choose-complexity',
      heading: 'Time Complexity',
      scenario: 'You check if an element exists in a HashSet with 1,000,000 elements.',
      question: 'What is the time complexity of contains()?',
      options: ['O(1)', 'O(n)', 'O(log n)'],
      expectedAnswer: 'O(1)',
      correctFeedback: {
        title: 'Correct — O(1) average',
        body: 'Like HashMap, HashSet computes the hash to find the element directly. One calculation, no searching.',
        reinforcement: 'TreeSet is O(log n) because it keeps elements sorted in a tree. Use TreeSet when you need sorted order; HashSet otherwise.',
      },
      wrongAnswerFeedback: {
        'O(n)': { title: 'That is List.contains() — not HashSet', body: 'A List checks elements one by one. HashSet uses hashing for O(1) lookup.' },
        'O(log n)': { title: 'That is TreeSet (sorted), not HashSet', body: 'TreeSet maintains sorted order via a red-black tree — O(log n). HashSet uses hashing — O(1).' },
      },
    },
    {
      type: 'exercise',
      id: 'fix-set-1',
      exerciseType: 'fix-the-bug',
      heading: 'Fix the Bug',
      problem: 'This code is supposed to find the first non-repeating character but uses the wrong data structure.',
      code: `char firstUnique(String s) {
    Map<Character, Integer> freq = new HashMap<>();
    for (char c : s.toCharArray())
        freq.put(c, freq.getOrDefault(c, 0) + 1);
    Set<Character> seen = new HashSet<>();
    for (char c : s.toCharArray())
        if (!seen.contains(c)) return c;  // Bug: this returns first char, not first unique
    return ' ';
}`,
      hint: 'The seen set is not needed. You already have frequency counts in freq.',
      expectedFix: 'freq.get(c) == 1',
      correctFeedback: {
        title: 'Correct fix',
        body: 'Replace !seen.contains(c) with freq.get(c) == 1. The frequency map already has the information — the set is redundant and wrong.',
        reinforcement: 'Always ask: do I need this data structure, or do I already have what I need? Redundant structures add confusion and bugs.',
      },
    },
    {
      type: 'reflection',
      id: 'summary-set',
      heading: 'What You Have Learned',
      keyInsights: [
        'HashSet stores unique values with O(1) add, remove, contains',
        'Use Set when you need membership check; use Map when you need associated data',
        'Duplicate adds are silently ignored — add() returns false, not an exception',
        'Classic patterns: has-duplicate, set intersection, visited-node tracking, sequence start detection',
        'TreeSet is O(log n) and keeps elements sorted; HashSet is O(1) but unordered',
      ],
      rememberedPattern: 'When you catch yourself writing "have I seen this before?", reach for a HashSet. It is the fastest answer to that question.',
    },
  ],
}
