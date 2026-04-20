export const lessonData = {
  slug: 'hash-maps',
  title: 'HashMaps in Java',
  subtitle: 'O(1) lookup, insert, and delete — the most powerful tool in your kit.',
  badge: 'Lesson 9 · Data Structures',
  estimatedTime: '16 min',
  blocks: [
    {
      type: 'concept',
      id: 'what-is-hashmap',
      heading: 'What is a HashMap?',
      body: `A HashMap stores key-value pairs where every key is unique. Given a key, you can find its value in O(1) average time.

The secret: a hash function converts the key into an array index. The value is stored at that index. No searching needed — one computation, one lookup.

HashMap<String, Integer> map = new HashMap<>();
map.put("apple", 3);
map.put("banana", 7);
int count = map.get("apple"); // 3 — instantly

This is why HashMaps are everywhere in real code. Any problem requiring fast lookup, counting, or grouping should make you think HashMap first.`,
    },
    {
      type: 'concept',
      id: 'hashmap-operations',
      heading: 'Core Operations',
      body: `HashMap<String, Integer> map = new HashMap<>();

// Write
map.put("key", value);              // O(1) — insert or update
map.remove("key");                  // O(1) — delete

// Read
map.get("key");                     // O(1) — returns value or null
map.getOrDefault("key", 0);        // O(1) — returns default if missing
map.containsKey("key");            // O(1) — check if key exists

// Iterate
for (String key : map.keySet()) { ... }
for (int val : map.values()) { ... }
for (Map.Entry<String, Integer> e : map.entrySet()) {
    e.getKey();   e.getValue();
}`,
    },
    {
      type: 'worked-sample',
      id: 'frequency-count',
      heading: 'Frequency Counting — Classic Pattern',
      code: `String[] words = {"apple", "banana", "apple", "cherry", "banana"};
Map<String, Integer> freq = new HashMap<>();
for (String word : words) {
    freq.put(word, freq.getOrDefault(word, 0) + 1);
}
System.out.println(freq); // {apple=2, banana=2, cherry=1}`,
      steps: [
        { line: '2', explanation: 'Create an empty HashMap to store word → count.' },
        { line: '3-5', explanation: 'For each word: getOrDefault(word, 0) returns current count or 0 if not seen. Then add 1 and store back.' },
        { line: '6', explanation: 'After the loop, every word has its exact count. This pattern solves dozens of interview problems.' },
      ],
      result: '{apple=2, banana=2, cherry=1}',
    },
    {
      type: 'exercise',
      id: 'predict-hashmap-1',
      exerciseType: 'predict-output',
      heading: 'Predict the Output',
      prompt: 'What does this code print?',
      code: `Map<String, Integer> m = new HashMap<>();
m.put("a", 1);
m.put("b", 2);
m.put("a", 5);
System.out.println(m.get("a"));`,
      expectedAnswer: '5',
      options: ['1', '5', '6', 'null'],
      correctFeedback: {
        title: 'Correct — put overwrites existing keys',
        body: 'When you put("a", 5), it replaces the previous value 1. A HashMap keeps only one value per key.',
        reinforcement: 'This behavior is intentional. Use merge() or getOrDefault if you want to accumulate.',
      },
      wrongAnswerFeedback: {
        '1': { title: 'The second put("a", 5) overwrites the first', hint: 'HashMap allows only one value per key — later put wins', body: 'put("a", 1) sets a→1, then put("a", 5) replaces it. Last write wins.' },
        '6': { title: 'HashMap does not add values — it replaces them', hint: 'put replaces, it does not accumulate', body: 'To add values, use merge() or getOrDefault(key,0)+1. Plain put replaces.' },
        'null': { title: 'Key "a" exists — it returns 5', hint: 'null is returned only when the key does not exist', body: 'get returns null only for missing keys. "a" is present with value 5.' },
      },
    },
    {
      type: 'worked-sample',
      id: 'two-sum-sample',
      heading: 'Two Sum — HashMap Solves It in O(n)',
      code: `int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (seen.containsKey(complement)) {
            return new int[]{seen.get(complement), i};
        }
        seen.put(nums[i], i);
    }
    return new int[]{};
}`,
      steps: [
        { line: '2', explanation: 'Map stores number → index for all numbers seen so far.' },
        { line: '4', explanation: 'For each number, the complement is what we need to add to it to reach target.' },
        { line: '5-7', explanation: 'If the complement was seen before, we found our pair. Return both indices.' },
        { line: '8', explanation: 'Otherwise, record this number and its index for future lookups.' },
      ],
      result: 'twoSum([2,7,11,15], 9) → [0, 1] — O(n) vs O(n²) brute force',
    },
    {
      type: 'exercise',
      id: 'fill-hashmap-1',
      exerciseType: 'fill-in-code',
      heading: 'Fill in the Gap',
      prompt: 'Complete the code that counts how many times each character appears in a string:',
      codeTemplate: `Map<Character, Integer> charCount(String s) {
    Map<Character, Integer> map = new HashMap<>();
    for (char c : s.toCharArray()) {
        map.put(c, map.___(c, 0) + 1);
    }
    return map;
}`,
      blanks: [{ id: 'blank1', expectedValue: 'getOrDefault', label: 'blank1' }],
      hint: 'You need to get the current count, defaulting to 0 if the character has not been seen.',
      correctFeedback: {
        title: 'Correct — getOrDefault',
        body: 'getOrDefault(key, 0) returns the current value if present, or 0 if not. Then +1 increments it before storing back.',
        suggestion: 'Equivalent: map.merge(c, 1, Integer::sum) — one line version.',
      },
    },
    {
      type: 'exercise',
      id: 'choose-hashmap-1',
      exerciseType: 'choose-complexity',
      heading: 'Time Complexity',
      scenario: 'You check if a word exists in a HashMap containing 1,000,000 words.',
      question: 'What is the time complexity of containsKey()?',
      options: ['O(1)', 'O(n)', 'O(log n)'],
      expectedAnswer: 'O(1)',
      correctFeedback: {
        title: 'Correct — O(1) average',
        body: 'HashMap uses a hash function to compute the position directly. The million other entries are irrelevant.',
        reinforcement: 'Compare: a List.contains() is O(n) — it checks every element. This is why HashMap is preferred for lookup.',
      },
      wrongAnswerFeedback: {
        'O(n)': { title: 'That is List.contains() — HashMap is faster', body: 'HashMap calculates the position using a hash function. No iteration needed.' },
        'O(log n)': { title: 'That is TreeMap (sorted). HashMap is faster.', body: 'TreeMap maintains sorted order via a tree — O(log n). HashMap uses hashing — O(1).' },
      },
    },
    {
      type: 'exercise',
      id: 'fix-hashmap-1',
      exerciseType: 'fix-the-bug',
      heading: 'Fix the Bug',
      problem: 'This code crashes with NullPointerException when a key has not been seen before.',
      code: `Map<String, Integer> freq = new HashMap<>();
for (String word : words) {
    freq.put(word, freq.get(word) + 1);
}`,
      hint: 'freq.get(word) returns null when the word has not been added yet. Adding 1 to null crashes.',
      expectedFix: 'getOrDefault',
      correctFeedback: {
        title: 'Correct — use getOrDefault',
        body: 'Replace freq.get(word) with freq.getOrDefault(word, 0). This safely returns 0 for the first occurrence.',
        reinforcement: 'NullPointerException in HashMap code almost always means you forgot to handle the missing-key case.',
      },
    },
    {
      type: 'reflection',
      id: 'summary-hashmap',
      heading: 'What You Have Learned',
      keyInsights: [
        'HashMap gives O(1) average for put, get, remove, containsKey',
        'put() overwrites existing values — use getOrDefault to accumulate',
        'Frequency counting pattern: map.put(key, map.getOrDefault(key, 0) + 1)',
        'Two Sum: use HashMap to find complements in O(n) instead of O(n²)',
        'Use TreeMap when you need sorted keys (O(log n) operations)',
      ],
      rememberedPattern: 'When you see "find duplicates", "count occurrences", "group by", or "fast lookup" — HashMap is almost always the right tool.',
    },
  ],
}
