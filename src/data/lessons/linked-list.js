export const lessonData = {
  slug: 'linked-list',
  title: 'Linked Lists in Java',
  subtitle: 'Dynamic chains where every node points to the next.',
  badge: 'Lesson 2 · Core DSA',
  estimatedTime: '18 min',
  blocks: [
    {
      type: 'concept',
      id: 'what-is-ll',
      heading: 'What is a Linked List?',
      body: `A linked list is a sequence of nodes where each node holds a value and a reference (pointer) to the next node. Unlike arrays, nodes are not stored in contiguous memory — they can be anywhere, connected only by pointers.

This gives linked lists one key advantage: insertion and deletion at the front are O(1). No shifting needed. The trade-off: you cannot access element N directly. You must traverse from the head.`,
    },
    {
      type: 'visual',
      id: 'll-diagram',
      component: 'PointerVisual',
      props: { nodes: [{ value: 10, id: 'a' }, { value: 25, id: 'b' }, { value: 8, id: 'c' }, { value: 42, id: 'd' }], label: 'list' },
      caption: 'Each node holds a value and a pointer to the next node. The last node points to null.',
    },
    {
      type: 'concept',
      id: 'node-structure',
      heading: 'The Node Structure',
      body: `In Java, a linked list node is a simple class with two fields:

class Node {
    int data;
    Node next;
    Node(int data) {
        this.data = data;
        this.next = null;
    }
}

The linked list itself only needs a head pointer. All other nodes are reachable by following next pointers.`,
    },
    {
      type: 'worked-sample',
      id: 'traversal-sample',
      heading: 'Traversing a Linked List',
      code: `Node current = head;
while (current != null) {
    System.out.println(current.data);
    current = current.next;
}`,
      steps: [
        { line: '1', explanation: 'Start at head. current points to the first node.' },
        { line: '2', explanation: 'Loop while current is not null — not past the end.' },
        { line: '3', explanation: 'Print the value of the current node.' },
        { line: '4', explanation: 'Move forward by following the next pointer.' },
      ],
      result: 'Prints: 10 → 25 → 8 → 42',
    },
    {
      type: 'exercise',
      id: 'predict-ll-1',
      exerciseType: 'predict-output',
      heading: 'Predict the Output',
      prompt: 'List is: 5 → 12 → 3. What does this code print?',
      code: `Node current = head;
int count = 0;
while (current != null) {
    count++;
    current = current.next;
}
System.out.println(count);`,
      expectedAnswer: '3',
      options: ['1', '2', '3', '12'],
      correctFeedback: {
        title: 'Correct — O(n) traversal',
        body: 'The loop visits each of the 3 nodes once, incrementing count each time. Result: 3.',
        reinforcement: 'Counting nodes requires traversal — exactly why linked list length is O(n).',
      },
      wrongAnswerFeedback: {
        '1': { title: 'That would stop after the first node', hint: 'The while loop continues while current != null', body: 'count increments once per node visited. 3 nodes → count = 3.' },
        '2': { title: 'Off by one', hint: 'Trace through: count 0→1 (node 5) →2 (node 12) →3 (node 3)', body: 'All 3 nodes are visited before current becomes null.' },
        '12': { title: 'That is a node value, not the count', hint: 'count is a separate counter, unrelated to node values', body: 'The code counts how many nodes exist (3), not what values they hold.' },
      },
      gated: true,
    },
    {
      type: 'concept',
      id: 'insert-front',
      heading: 'Inserting at the Front — O(1)',
      body: `The biggest advantage of linked lists: inserting at the front is O(1).

Three steps:
1. Create a new node
2. Point new node's next to current head
3. Update head to the new node

newNode.next = head;
head = newNode;

Compare this to arrays: inserting at front means shifting every element right — O(n). Linked lists eliminate that cost entirely.`,
    },
    {
      type: 'exercise',
      id: 'fill-ll-1',
      exerciseType: 'fill-in-code',
      heading: 'Fill in the Gap',
      prompt: 'Complete the code to insert a new node at the front:',
      codeTemplate: `Node newNode = new Node(value);
newNode.next = ___;
head = newNode;`,
      blanks: [{ id: 'blank1', expectedValue: 'head', label: 'blank1' }],
      hint: 'The new node must point to what was previously the first node.',
      correctFeedback: {
        title: 'Exactly right',
        body: 'newNode.next = head links the new node to the rest of the list. Then head = newNode makes it the new first.',
        suggestion: 'Pattern: create → link → update head. Three steps, always in this order.',
      },
      gated: true,
    },
    {
      type: 'exercise',
      id: 'complexity-ll-1',
      exerciseType: 'choose-complexity',
      heading: 'Time Complexity',
      scenario: 'You want to access the element at index 5 in a singly linked list.',
      question: 'What is the time complexity?',
      options: ['O(1)', 'O(n)', 'O(log n)'],
      expectedAnswer: 'O(n)',
      correctFeedback: {
        title: 'Correct — O(n)',
        body: 'Unlike arrays, linked lists have no direct index. You traverse from head, following next pointers one by one.',
        reinforcement: 'Core trade-off: arrays O(1) access, linked lists O(1) front insert/delete.',
      },
      wrongAnswerFeedback: {
        'O(1)': { title: 'That is array-style access, not linked list', body: 'Arrays compute the address directly. Linked lists follow pointers — one step per node.' },
        'O(log n)': { title: 'Binary search needs index access, which linked lists lack', body: 'You cannot jump to the middle of a linked list without traversing there first.' },
      },
      gated: true,
    },
    {
      type: 'exercise',
      id: 'fix-ll-1',
      exerciseType: 'fix-the-bug',
      heading: 'Fix the Bug',
      problem: 'This code tries to delete the head node but does nothing.',
      code: `public void deleteHead() {
    head = head;
}`,
      hint: 'Deleting the head means the second node becomes the new head.',
      expectedFix: 'head = head.next',
      correctFeedback: {
        title: 'Perfect fix',
        body: 'head = head.next moves the head pointer to the second node, effectively removing the first. The old head is garbage-collected.',
        reinforcement: 'Always ask: after deletion, is the head pointer correctly updated?',
      },
      gated: true,
    },
    {
      type: 'reflection',
      id: 'summary-ll',
      heading: 'What You Have Learned',
      keyInsights: [
        'Linked lists are chains of nodes connected by pointers, not contiguous memory',
        'Front insertion and deletion are O(1) — the key advantage over arrays',
        'Index access requires O(n) traversal — no direct addressing',
        'Always save next before overwriting current.next or you lose the rest of the list',
        'The core trade-off: linked lists win at O(1) insert/delete, arrays win at O(1) access',
      ],
      rememberedPattern: 'When traversing or modifying a linked list, always save the next pointer before changing current.next. One missing save and the rest of the list is gone.',
    },
  ],
}
