export const lessonData = {
  slug: 'tree-traversal',
  title: 'Tree Traversal — DFS & BFS',
  subtitle: 'Two strategies for visiting every node. One uses a stack, the other a queue.',
  badge: 'Lesson 16 · Advanced',
  estimatedTime: '19 min',
  blocks: [
    {
      type: 'concept',
      id: 'dfs-vs-bfs',
      heading: 'DFS vs BFS — The Core Difference',
      body: `Every tree traversal visits each node exactly once. The question is: in what order?

DFS (Depth-First Search) — go deep first, then backtrack.
Uses a stack (or recursion, which uses the call stack).
Traverses one complete path from root to leaf before backtracking.

BFS (Breadth-First Search) — visit all nodes at the current level before going deeper.
Uses a queue.
Traverses level by level: all children before any grandchildren.

When to use each:
DFS: path finding, tree height, balance checking, pre/in/post-order
BFS: shortest path, level-order output, finding nodes closest to root`,
    },
    {
      type: 'worked-sample',
      id: 'dfs-recursive',
      heading: 'DFS — Three Orderings',
      code: `// Pre-order: Root → Left → Right
void preOrder(TreeNode node) {
    if (node == null) return;
    visit(node.val);       // process NOW (before children)
    preOrder(node.left);
    preOrder(node.right);
}

// In-order: Left → Root → Right (sorted for BST!)
void inOrder(TreeNode node) {
    if (node == null) return;
    inOrder(node.left);
    visit(node.val);       // process BETWEEN children
    inOrder(node.right);
}

// Post-order: Left → Right → Root
void postOrder(TreeNode node) {
    if (node == null) return;
    postOrder(node.left);
    postOrder(node.right);
    visit(node.val);       // process AFTER children
}`,
      steps: [
        { line: '2-7', explanation: 'Pre-order: process root first, then recurse. Use for: creating a copy, serializing a tree, expression tree evaluation.' },
        { line: '9-15', explanation: 'In-order: left first, then root, then right. On a BST this produces sorted output.' },
        { line: '17-23', explanation: 'Post-order: process root last. Use for: deleting a tree, computing folder sizes (need child sizes first).' },
      ],
      result: 'Tree [4, 2, 6, 1, 3, 5, 7]: pre=[4,2,1,3,6,5,7] | in=[1,2,3,4,5,6,7] | post=[1,3,2,5,7,6,4]',
    },
    {
      type: 'exercise',
      id: 'predict-traversal-1',
      exerciseType: 'predict-output',
      heading: 'Predict the Traversal',
      prompt: 'Tree: root=1, root.left=2, root.right=3. What does pre-order produce?',
      code: `//     1
//    / \\
//   2   3
// preOrder: Root, Left, Right`,
      expectedAnswer: '1 2 3',
      options: ['2 1 3', '1 2 3', '2 3 1', '1 3 2'],
      correctFeedback: {
        title: 'Correct — Root first (1), then left (2), then right (3)',
        body: 'Pre-order: visit root 1, recurse left → visit 2, recurse right → visit 3. Result: 1 2 3.',
        reinforcement: 'Mnemonic: pre = root is processed first (before children). Post = root is processed last (after children). In = root is in the middle.',
      },
      wrongAnswerFeedback: {
        '2 1 3': { title: 'That is in-order (Left, Root, Right)', hint: 'Pre-order visits the ROOT first, not the left child first', body: 'In-order: left (2), root (1), right (3) = 2 1 3. Pre-order: root (1), left (2), right (3) = 1 2 3.' },
        '2 3 1': { title: 'That is post-order (Left, Right, Root)', hint: 'Post-order visits root LAST. Pre-order visits root FIRST.', body: 'Post-order: 2 3 1. Pre-order: 1 2 3.' },
        '1 3 2': { title: 'Pre-order goes left before right', hint: 'Pre-order is Root → Left → Right, not Root → Right → Left', body: 'After the root (1), go left (2) before going right (3).' },
      },
    },
    {
      type: 'worked-sample',
      id: 'bfs-sample',
      heading: 'BFS — Level Order Traversal',
      code: `List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    while (!queue.isEmpty()) {
        int size = queue.size();  // nodes at this level
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            level.add(node.val);
            if (node.left  != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        result.add(level);
    }
    return result;
}`,
      steps: [
        { line: '4-5', explanation: 'Start the queue with only the root.' },
        { line: '6-7', explanation: 'Each iteration of the outer while processes one complete level. queue.size() tells us how many nodes are at the current level.' },
        { line: '9-13', explanation: 'Process exactly size nodes (this level only). Add their children to the queue for the next level.' },
        { line: '15', explanation: 'After processing all nodes at this level, add the level list to result.' },
      ],
      result: 'Tree [3, 9, 20, null, null, 15, 7] → [[3], [9, 20], [15, 7]]',
    },
    {
      type: 'exercise',
      id: 'drag-traversal',
      exerciseType: 'drag-arrange',
      heading: 'Order the Steps',
      prompt: 'Arrange the steps of BFS level-order traversal:',
      items: [
        'Poll a node from queue, process it',
        'Add root to queue',
        'Repeat while queue is not empty',
        'Add current node\'s children to queue',
        'Snapshot queue.size() as current level width',
      ],
      correctOrder: [
        'Add root to queue',
        'Repeat while queue is not empty',
        'Snapshot queue.size() as current level width',
        'Poll a node from queue, process it',
        'Add current node\'s children to queue',
      ],
      hint: 'Initialize, then loop. Inside the loop: capture level size, then process that many nodes.',
      correctFeedback: {
        title: 'Correct order',
        body: 'The key insight is capturing queue.size() BEFORE processing the level. This tells you exactly how many nodes belong to the current level.',
        reinforcement: 'The size snapshot is the trick that separates plain BFS from level-order BFS. Without it, you cannot tell where one level ends and the next begins.',
      },
      wrongFeedback: {
        title: 'Not quite',
        body: 'The queue.size() snapshot must happen at the start of each level iteration, before any polling.',
        hint: 'Add root → loop → snapshot size → process size nodes → add their children → next iteration.',
      },
    },
    {
      type: 'exercise',
      id: 'choose-traversal-1',
      exerciseType: 'choose-complexity',
      heading: 'Time Complexity',
      scenario: 'You run BFS on a binary tree with n nodes to find the shortest path to a target.',
      question: 'What is the time complexity?',
      options: ['O(1)', 'O(n)', 'O(log n)'],
      expectedAnswer: 'O(n)',
      correctFeedback: {
        title: 'Correct — O(n)',
        body: 'BFS visits every node at most once. In the worst case (target not found), it processes all n nodes.',
        reinforcement: 'BFS guarantees finding the shortest path in terms of number of edges — but it still takes O(n) time in the worst case.',
      },
      wrongAnswerFeedback: {
        'O(1)': { title: 'BFS must visit nodes until it finds the target', body: 'O(1) would mean finding the answer without any traversal.' },
        'O(log n)': { title: 'That requires structured data like a sorted tree', body: 'BFS on a general binary tree is O(n). O(log n) traversal only works on balanced BSTs with structural guarantees.' },
      },
    },
    {
      type: 'exercise',
      id: 'fix-traversal-1',
      exerciseType: 'fix-the-bug',
      heading: 'Fix the Bug',
      problem: 'This BFS does not correctly separate levels — all nodes end up in one list.',
      code: `List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    List<Integer> level = new ArrayList<>();  // Bug: created once outside loop
    while (!queue.isEmpty()) {
        TreeNode node = queue.poll();
        level.add(node.val);
        if (node.left  != null) queue.offer(node.left);
        if (node.right != null) queue.offer(node.right);
    }
    result.add(level);
    return result;
}`,
      hint: 'A new List<Integer> must be created for each level, and the size snapshot is missing.',
      expectedFix: 'int size = queue.size()',
      correctFeedback: {
        title: 'Correct — level list must be created per iteration, and size snapshot needed',
        body: 'Move List<Integer> level = new ArrayList<>() inside the while loop. Add int size = queue.size() and process only size nodes per iteration.',
        reinforcement: 'Missing the per-level list creation is the most common BFS level-order bug.',
      },
    },
    {
      type: 'reflection',
      id: 'summary-traversal',
      heading: 'What You Have Learned',
      keyInsights: [
        'DFS goes deep first (uses stack/recursion); BFS goes wide first (uses queue)',
        'Three DFS orderings: pre-order (root first), in-order (root middle), post-order (root last)',
        'In-order on a BST produces sorted output — use it to verify a BST',
        'BFS level-order: snapshot queue.size() to know the current level width',
        'Both visit all n nodes → O(n) time. BFS uses O(n) space (queue); DFS uses O(h) space (call stack, h = height)',
      ],
      rememberedPattern: 'DFS template: if null return, recurse left, recurse right. BFS template: queue with root, while not empty, snapshot size, process size nodes, add children.',
    },
  ],
}
