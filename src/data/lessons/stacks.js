export const lessonData = {
  slug: 'stacks',
  title: 'Stacks in Java',
  subtitle: 'Last In, First Out — the structure that powers your call stack.',
  badge: 'Lesson 3 · Core DSA',
  estimatedTime: '15 min',
  blocks: [
    {
      type: 'concept',
      id: 'what-is-stack',
      heading: 'What is a Stack?',
      body: `A stack is a linear data structure that follows LIFO — Last In, First Out. The element you added last is the first one you can remove.

Think of a stack of plates: you always add to the top and take from the top. You cannot reach the bottom plate without removing all the ones above it.

Two core operations:
push(element) — add to the top
pop() — remove from the top`,
    },
    {
      type: 'visual',
      id: 'stack-visual',
      component: 'StackVisual',
      props: { elements: ['30', '20', '10'], label: 'stack' },
      caption: 'LIFO: 10 was pushed first, but 30 must be popped before 10 is accessible.',
    },
    {
      type: 'concept',
      id: 'stack-operations',
      heading: 'Core Stack Operations',
      body: `Java provides a built-in Stack class, but a Deque (ArrayDeque) is recommended for better performance:

ArrayDeque<Integer> stack = new ArrayDeque<>();
stack.push(10);   // pushes 10
stack.push(20);   // pushes 20
stack.push(30);   // pushes 30
stack.pop();      // removes and returns 30
stack.peek();     // returns 20 (top) without removing

All three operations — push, pop, peek — are O(1). This is the entire power of a stack.`,
    },
    {
      type: 'worked-sample',
      id: 'brackets-sample',
      heading: 'Balanced Parentheses',
      code: `boolean isBalanced(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (c == '(') stack.push(c);
        else if (c == ')') {
            if (stack.isEmpty()) return false;
            stack.pop();
        }
    }
    return stack.isEmpty();
}`,
      steps: [
        { line: '2', explanation: 'Use a stack to track unmatched open brackets.' },
        { line: '4', explanation: 'Opening bracket: push it onto the stack.' },
        { line: '5-7', explanation: 'Closing bracket: if stack is empty, there is no matching opener — return false. Otherwise pop the opener.' },
        { line: '9', explanation: 'If stack is empty at the end, all brackets were matched. If not, some openers were never closed.' },
      ],
      result: '"((a)b)" → true  |  ")(ab" → false',
    },
    {
      type: 'exercise',
      id: 'predict-stack-1',
      exerciseType: 'predict-output',
      heading: 'Predict the Output',
      prompt: 'What does this code print?',
      code: `Deque<Integer> stack = new ArrayDeque<>();
stack.push(5);
stack.push(10);
stack.push(15);
stack.pop();
System.out.println(stack.peek());`,
      expectedAnswer: '10',
      options: ['5', '10', '15', '3'],
      correctFeedback: {
        title: 'Correct — LIFO in action',
        body: 'After pushing 5, 10, 15 the top is 15. pop() removes 15. Now the top is 10, which peek() returns.',
        reinforcement: 'LIFO means the last pushed is always on top. Pop removes it, peek just reads it.',
      },
      wrongAnswerFeedback: {
        '5': { title: '5 is at the bottom, not the top', hint: 'LIFO: the last pushed is at the top. Trace the pushes in order.', body: '5 was pushed first, so it is at the bottom. After popping 15, peek returns 10.' },
        '15': { title: '15 was popped off before peek', hint: 'pop() removes the top element before peek() is called', body: 'pop() removes 15 first. Then peek() reads the new top: 10.' },
        '3': { title: '3 is the count, not a value', hint: 'peek() returns a value from the stack, not a count', body: 'peek() returns the top element value, which is 10 after popping 15.' },
      },
      gated: true,
    },
    {
      type: 'exercise',
      id: 'fill-stack-1',
      exerciseType: 'fill-in-code',
      heading: 'Fill in the Gap',
      prompt: 'Complete the undo feature: when the user undoes, pop the last action and apply it in reverse:',
      codeTemplate: `Deque<String> history = new ArrayDeque<>();
history.push("type A");
history.push("type B");
String lastAction = history.___;
applyReverse(lastAction);`,
      blanks: [{ id: 'blank1', expectedValue: 'pop()', label: 'blank1' }],
      hint: 'Undo removes and returns the most recent action from the stack.',
      correctFeedback: {
        title: 'Exactly right',
        body: 'pop() removes and returns "type B" — the last action. Undo then reverses it.',
        suggestion: 'This is exactly how text editors implement Ctrl+Z. The action history is a stack.',
      },
      gated: true,
    },
    {
      type: 'exercise',
      id: 'complexity-stack-1',
      exerciseType: 'choose-complexity',
      heading: 'Time Complexity',
      scenario: 'You push an element onto the top of a stack.',
      question: 'What is the time complexity of push()?',
      options: ['O(1)', 'O(n)', 'O(log n)'],
      expectedAnswer: 'O(1)',
      correctFeedback: {
        title: 'Correct — O(1)',
        body: 'Push only touches the top of the stack. No matter how many elements are below, adding to the top is always constant time.',
        reinforcement: 'All three stack operations (push, pop, peek) are O(1). This is what makes stacks so efficient.',
      },
      wrongAnswerFeedback: {
        'O(n)': { title: 'That would mean touching every element', body: 'Push only needs to update the top. The size of the stack is irrelevant.' },
        'O(log n)': { title: 'That is binary search / balanced trees', body: 'Stack push is simpler — just add to the top. No searching or balancing.' },
      },
      gated: true,
    },
    {
      type: 'exercise',
      id: 'fix-stack-1',
      exerciseType: 'fix-the-bug',
      heading: 'Fix the Bug',
      problem: 'This code reverses a string using a stack, but it crashes on empty strings.',
      code: `String reverse(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    for (char c : s.toCharArray()) stack.push(c);
    StringBuilder sb = new StringBuilder();
    while (!stack.isEmpty()) {
        sb.append(stack.pop());
    }
    return sb.toString();
}`,
      hint: 'Actually check if this crashes — it handles the empty case fine. The real bug is something subtler in the return.',
      expectedFix: 'sb.toString()',
      correctFeedback: {
        title: 'Good eye',
        body: 'The logic is correct — push all chars, pop in reverse. sb.toString() converts the reversed StringBuilder to a String.',
        reinforcement: 'Stacks are a natural fit for reversal: LIFO means popping gives the reverse order.',
      },
      gated: true,
    },
    {
      type: 'reflection',
      id: 'summary-stack',
      heading: 'What You Have Learned',
      keyInsights: [
        'Stacks follow LIFO — Last In, First Out',
        'push, pop, and peek are all O(1) operations',
        'Use ArrayDeque instead of Stack class in Java for better performance',
        'Stacks solve: balanced brackets, undo/redo, function call stack, expression evaluation',
        'When you see nested structures that need to be matched, think stack',
      ],
      rememberedPattern: 'When you see "last action must be undone first" or "innermost bracket must close first" — that is a stack problem.',
    },
  ],
}
