export const lessonData = {
  slug: 'strings',
  title: 'Strings in Java',
  subtitle: 'Immutable sequences of characters — and why that changes everything.',
  badge: 'Lesson 8 · Foundations',
  estimatedTime: '14 min',
  blocks: [
    {
      type: 'concept',
      id: 'string-basics',
      heading: 'Strings in Java',
      body: `A String in Java is a sequence of characters. Unlike most languages, Java Strings are immutable — once created, the content cannot change.

String s = "hello";
s = s + " world"; // creates a NEW String, does not modify "hello"

This immutability matters for performance. Every concatenation creates a new object. Concatenating in a loop creates n objects — use StringBuilder instead.`,
    },
    {
      type: 'concept',
      id: 'string-methods',
      heading: 'Essential String Methods',
      body: `The most used String methods in DSA problems:

s.length()           → number of characters
s.charAt(i)          → character at index i
s.substring(i, j)    → characters from i to j-1
s.indexOf("ab")      → first position of "ab", or -1
s.contains("ab")     → true/false
s.toLowerCase()      → new lowercase String
s.trim()             → removes leading/trailing whitespace
s.toCharArray()      → converts to char[]
s.equals("hello")    → value comparison (never use ==)`,
    },
    {
      type: 'worked-sample',
      id: 'string-iteration',
      heading: 'Iterating Over Characters',
      code: `String s = "hello";
// Method 1: charAt
for (int i = 0; i < s.length(); i++) {
    char c = s.charAt(i);
}
// Method 2: toCharArray
for (char c : s.toCharArray()) {
    System.out.println(c);
}`,
      steps: [
        { line: '3-5', explanation: 's.length() returns 5 for "hello". charAt(i) gets character at position i.' },
        { line: '7-9', explanation: 'toCharArray() converts the String to a char[] once. The enhanced for loop then iterates over it.' },
        { line: 'Choice', explanation: 'Use charAt when you need the index. Use toCharArray when you only need the character.' },
      ],
      result: 'h e l l o (printed on separate lines)',
    },
    {
      type: 'exercise',
      id: 'predict-string-1',
      exerciseType: 'predict-output',
      heading: 'Predict the Output',
      prompt: 'What does this print?',
      code: `String s = "Hello World";
System.out.println(s.substring(6, 11));`,
      expectedAnswer: 'World',
      options: ['Hello', 'World', 'Hello World', ' World'],
      correctFeedback: {
        title: 'Correct — substring(6, 11)',
        body: 'substring(start, end) returns characters from index 6 up to but not including index 11. "Hello World": H=0, e=1, l=2, l=3, o=4, (space)=5, W=6, o=7, r=8, l=9, d=10.',
        reinforcement: 'Note: substring end is exclusive — a common off-by-one trap.',
      },
      wrongAnswerFeedback: {
        'Hello': { title: 'That is indexes 0-4', hint: 'substring(6, 11) starts at index 6', body: '"Hello" is at indexes 0-4. substring(6, 11) starts at the "W" at index 6.' },
        'Hello World': { title: 'That would need substring(0, 11)', hint: 'substring starts at 6, not 0', body: 'substring(6, 11) extracts only 5 characters starting from index 6.' },
        ' World': { title: 'Close — but the space is at index 5, not 6', hint: 'Index 6 is "W", not the space', body: 'The space is at index 5. substring(6, 11) starts at index 6 which is "W".' },
      },
    },
    {
      type: 'concept',
      id: 'string-comparison',
      heading: 'Always use .equals(), Never ==',
      body: `This is the most common Java String bug:

String a = "hello";
String b = "hello";
System.out.println(a == b);       // may print true (string pool)

String c = new String("hello");
System.out.println(a == c);       // prints false!
System.out.println(a.equals(c));  // prints true

== compares object references (memory addresses), not content.
.equals() compares character content.

In DSA problems, always use .equals() for String comparison.`,
    },
    {
      type: 'exercise',
      id: 'fill-string-1',
      exerciseType: 'fill-in-code',
      heading: 'Fill in the Gap',
      prompt: 'Complete this palindrome check — returns true if the string reads the same forwards and backwards:',
      codeTemplate: `boolean isPalindrome(String s) {
    String rev = new StringBuilder(s).reverse().toString();
    return s.___(rev);
}`,
      blanks: [{ id: 'blank1', expectedValue: 'equals', label: 'blank1' }],
      hint: 'You are comparing String values, not references.',
      correctFeedback: {
        title: 'Correct — .equals()',
        body: 'Using == would compare memory addresses and return false even when the content is identical. .equals() compares character-by-character.',
        suggestion: 'For case-insensitive comparison, use .equalsIgnoreCase().',
      },
    },
    {
      type: 'worked-sample',
      id: 'stringbuilder-sample',
      heading: 'StringBuilder — Efficient Concatenation',
      code: `// BAD: O(n²) — creates n new String objects
String result = "";
for (int i = 0; i < n; i++) {
    result += "a";   // new String object each time
}

// GOOD: O(n) — one mutable buffer
StringBuilder sb = new StringBuilder();
for (int i = 0; i < n; i++) {
    sb.append("a");  // modifies in place
}
String result2 = sb.toString();`,
      steps: [
        { line: '2-4', explanation: 'Each += creates a new String object and copies the previous content. For n iterations: 1+2+3...+n = n(n+1)/2 copy operations = O(n²).' },
        { line: '8-11', explanation: 'StringBuilder uses a resizable char array. append() adds to the buffer without creating new objects. O(n) total.' },
        { line: 'Rule', explanation: 'Never concatenate Strings in a loop. Use StringBuilder.append() then .toString() at the end.' },
      ],
      result: 'Both produce "aaa...a" but StringBuilder is O(n), += is O(n²)',
    },
    {
      type: 'exercise',
      id: 'choose-string-1',
      exerciseType: 'choose-complexity',
      heading: 'Time Complexity',
      scenario: 'You concatenate n strings together using += in a loop: result += strings[i].',
      question: 'What is the time complexity?',
      options: ['O(n)', 'O(n²)', 'O(log n)'],
      expectedAnswer: 'O(n²)',
      correctFeedback: {
        title: 'Correct — O(n²)',
        body: 'Each += copies the entire current string plus the new fragment. After k iterations, you copy k characters. Total: 1+2+...+n = O(n²).',
        reinforcement: 'This is a trap in interviews. Always mention StringBuilder when asked to build a string in a loop.',
      },
      wrongAnswerFeedback: {
        'O(n)': { title: 'That is StringBuilder. String += is worse.', body: 'String immutability means each += copies all previous content. For n concatenations: O(n²) total copies.' },
        'O(log n)': { title: 'String concatenation does not halve anything', body: 'O(log n) requires dividing the problem in half each step. Concatenation grows the string linearly.' },
      },
    },
    {
      type: 'exercise',
      id: 'fix-string-1',
      exerciseType: 'fix-the-bug',
      heading: 'Fix the Bug',
      problem: 'This function reverses a string but produces a wrong result.',
      code: `String reverse(String s) {
    String result = "";
    for (int i = 0; i < s.length(); i++) {
        result += s.charAt(i);
    }
    return result;
}`,
      hint: 'The loop goes forward but to reverse you need to go backward.',
      expectedFix: 's.length() - 1 - i',
      correctFeedback: {
        title: 'Correct direction fix',
        body: 'Use s.charAt(s.length() - 1 - i) to read characters from the end. Also consider StringBuilder for O(n) instead of O(n²).',
        reinforcement: 'Built-in: new StringBuilder(s).reverse().toString() — one liner, O(n).',
      },
    },
    {
      type: 'reflection',
      id: 'summary-strings',
      heading: 'What You Have Learned',
      keyInsights: [
        'Java Strings are immutable — every modification creates a new object',
        'Always use .equals() for String comparison, never ==',
        'String concatenation with += in a loop is O(n²) — use StringBuilder',
        'charAt(i) for character access, substring(start, end) for a slice (end is exclusive)',
        'toCharArray() converts to char[] for convenient iteration',
      ],
      rememberedPattern: 'If you are building a String in a loop, stop and use StringBuilder. This single change often fixes a timeout in competitive programming.',
    },
  ],
}
