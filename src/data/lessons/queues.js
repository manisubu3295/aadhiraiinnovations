export const lessonData = {
  slug: 'queues',
  title: 'Queues in Java',
  subtitle: 'First In, First Out — the structure that powers scheduling and search.',
  badge: 'Lesson 4 · Core DSA',
  estimatedTime: '14 min',
  blocks: [
    {
      type: 'concept',
      id: 'what-is-queue',
      heading: 'What is a Queue?',
      body: `A queue is a linear data structure that follows FIFO — First In, First Out. The first element added is the first one removed. Exactly like a checkout line: you join at the back and exit from the front.

Two core operations:
enqueue (offer) — add to the back
dequeue (poll) — remove from the front

This is the opposite of a stack. Where a stack gives you the newest element, a queue gives you the oldest.`,
    },
    {
      type: 'concept',
      id: 'queue-operations',
      heading: 'Queue Operations in Java',
      body: `Java provides the Queue interface, commonly backed by LinkedList or ArrayDeque:

Queue<Integer> queue = new LinkedList<>();
queue.offer(10);   // enqueue 10 → [10]
queue.offer(20);   // enqueue 20 → [10, 20]
queue.offer(30);   // enqueue 30 → [10, 20, 30]
queue.poll();      // dequeue → returns 10, queue is [20, 30]
queue.peek();      // returns 20 (front) without removing

All operations are O(1). The queue never needs to shift elements around.`,
    },
    {
      type: 'worked-sample',
      id: 'bfs-sample',
      heading: 'BFS — Why Queues Power Graph Search',
      code: `void bfs(int start) {
    Queue<Integer> queue = new LinkedList<>();
    boolean[] visited = new boolean[n];
    queue.offer(start);
    visited[start] = true;
    while (!queue.isEmpty()) {
        int node = queue.poll();
        System.out.print(node + " ");
        for (int neighbor : adj.get(node)) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                queue.offer(neighbor);
            }
        }
    }
}`,
      steps: [
        { line: '2-5', explanation: 'Enqueue the starting node and mark it visited.' },
        { line: '6', explanation: 'Process until the queue is empty.' },
        { line: '7-8', explanation: 'Dequeue the oldest node and print it.' },
        { line: '9-12', explanation: 'Enqueue all unvisited neighbors. They will be processed in the order they were discovered — level by level.' },
      ],
      result: 'Visits nodes in level-order (breadth-first)',
    },
    {
      type: 'exercise',
      id: 'predict-queue-1',
      exerciseType: 'predict-output',
      heading: 'Predict the Output',
      prompt: 'What does this code print?',
      code: `Queue<String> q = new LinkedList<>();
q.offer("A");
q.offer("B");
q.offer("C");
q.poll();
System.out.println(q.peek());`,
      expectedAnswer: 'B',
      options: ['A', 'B', 'C', 'null'],
      correctFeedback: {
        title: 'Correct — FIFO in action',
        body: 'A was enqueued first, so poll() removes A. The new front is B, which peek() returns.',
        reinforcement: 'FIFO means the oldest element is always at the front. poll() removes it, peek() reads it.',
      },
      wrongAnswerFeedback: {
        'A': { title: 'A was removed by poll()', hint: 'FIFO: the first enqueued is the first dequeued', body: 'A was added first so poll() removes A. B is now at the front.' },
        'C': { title: 'C is at the back, not the front', hint: 'peek() reads from the front, not the back', body: 'C was enqueued last so it is at the back. Front is B after A is removed.' },
        'null': { title: 'The queue still has elements', hint: 'Only poll() on an empty queue returns null', body: 'After poll() removes A, the queue has B and C. peek() returns B.' },
      },
      gated: true,
    },
    {
      type: 'exercise',
      id: 'fill-queue-1',
      exerciseType: 'fill-in-code',
      heading: 'Fill in the Gap',
      prompt: 'Complete this print-queue function that prints and removes all elements:',
      codeTemplate: `void printAll(Queue<Integer> q) {
    while (!q.isEmpty()) {
        System.out.println(q.___());
    }
}`,
      blanks: [{ id: 'blank1', expectedValue: 'poll', label: 'blank1' }],
      hint: 'You want to remove and print each element from the front.',
      correctFeedback: {
        title: 'Exactly right',
        body: 'poll() removes and returns the front element each iteration, draining the queue in FIFO order.',
        suggestion: 'Use peek() when you only want to read without removing. Use poll() when you need to consume.',
      },
      gated: true,
    },
    {
      type: 'exercise',
      id: 'complexity-queue-1',
      exerciseType: 'choose-complexity',
      heading: 'Time Complexity',
      scenario: 'You want to enqueue a new task at the back of a job queue with 1000 tasks already in it.',
      question: 'What is the time complexity of offer()?',
      options: ['O(1)', 'O(n)', 'O(log n)'],
      expectedAnswer: 'O(1)',
      correctFeedback: {
        title: 'Correct — O(1)',
        body: 'offer() adds to the back of the queue in constant time. The 1000 existing tasks are irrelevant — no shifting or searching needed.',
        reinforcement: 'Both offer() and poll() are O(1). This is why queues are ideal for real-time scheduling.',
      },
      wrongAnswerFeedback: {
        'O(n)': { title: 'No shifting happens in a linked-list-backed queue', body: 'A queue backed by LinkedList or a circular buffer adds to the back pointer in O(1). No element needs to move.' },
        'O(log n)': { title: 'That is a priority queue (heap)', body: 'A regular FIFO queue is O(1). A priority queue that maintains order is O(log n) per insertion.' },
      },
      gated: true,
    },
    {
      type: 'exercise',
      id: 'fix-queue-1',
      exerciseType: 'fix-the-bug',
      heading: 'Fix the Bug',
      problem: 'This code is meant to process jobs in the order they arrived, but processes them in reverse.',
      code: `Deque<String> jobs = new ArrayDeque<>();
jobs.push("Job-1");
jobs.push("Job-2");
jobs.push("Job-3");
while (!jobs.isEmpty()) {
    process(jobs.poll());
}`,
      hint: 'push() adds to the front of a Deque, not the back. Use a method that adds to the back.',
      expectedFix: 'jobs.offer',
      correctFeedback: {
        title: 'Correct fix',
        body: 'push() on a Deque adds to the front (stack behavior). offer() adds to the back (queue behavior). Using offer() ensures FIFO processing.',
        reinforcement: 'ArrayDeque can act as both stack and queue. push/pop = stack. offer/poll = queue. Never mix them.',
      },
      gated: true,
    },
    {
      type: 'reflection',
      id: 'summary-queue',
      heading: 'What You Have Learned',
      keyInsights: [
        'Queues follow FIFO — First In, First Out, opposite of a stack',
        'offer() and poll() are both O(1) operations',
        'Queues power BFS graph traversal, job scheduling, and event processing',
        'Use ArrayDeque or LinkedList to back your Queue in Java',
        'Never mix push/pop (stack) with offer/poll (queue) on the same Deque',
      ],
      rememberedPattern: 'When you need to process things in the order they arrived — print jobs, network packets, BFS nodes — use a queue.',
    },
  ],
}
