export const lessonData = {
  slug: 'binary-trees',
  title: 'Binary Trees',
  subtitle: 'The structure that powers databases, file systems, and search.',
  badge: 'Lesson 12 · Advanced',
  estimatedTime: '20 min',
  blocks: [
    {
      type: 'concept',
      id: 'what-is-tree',
      heading: 'What is a Binary Tree?',
      body: `A binary tree is a hierarchical structure where each node has at most two children: a left child and a right child.

Every tree has a root — the topmost node with no parent. Nodes with no children are called leaves.

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) { this.val = val; }
}

Unlike arrays and linked lists (linear), trees are non-linear. They branch. This branching structure makes many operations O(log n) instead of O(n).`,
    },
    {
      type: 'concept',
      id: 'tree-terminology',
      heading: 'Key Terminology',
      body: `Root — the top node (no parent)
Parent — a node with children
Child — a node connected below a parent
Leaf — a node with no children
Height — longest path from root to a leaf
Depth — distance from root to a given node
Level — all nodes at the same depth

A balanced binary tree with n nodes has height ≈ log₂(n).
An array of 1,000,000 elements → a balanced tree has height ≈ 20.
This is why tree operations like search, insert, delete can be O(log n).`,
    },
    {
      type: 'worked-sample',
      id: 'tree-traversal-inorder',
      heading: 'In-Order Traversal (Left → Root → Right)',
      code: `void inOrder(TreeNode node) {
    if (node == null) return;    // base case
    inOrder(node.left);          // visit left subtree
    System.out.print(node.val); // process root
    inOrder(node.right);         // visit right subtree
}`,
      steps: [
        { line: '2', explanation: 'Base case: null means we reached past a leaf. Stop and return.' },
        { line: '3', explanation: 'Recurse into the entire left subtree first.' },
        { line: '4', explanation: 'Only process this node after all left children are done.' },
        { line: '5', explanation: 'Then recurse into the right subtree.' },
        { line: 'Key', explanation: 'In-order on a Binary Search Tree always produces sorted output. This is the tree traversal you will use most.' },
      ],
      result: 'For a BST with values 1-7, in-order prints: 1 2 3 4 5 6 7',
    },
    {
      type: 'exercise',
      id: 'predict-tree-1',
      exerciseType: 'predict-output',
      heading: 'Predict the Output',
      prompt: 'Tree: root=4, left=2, right=6. What does in-order traversal print?',
      code: `//       4
//      / \\
//     2   6
// inOrder visits: left, root, right`,
      expectedAnswer: '2 4 6',
      options: ['4 2 6', '2 4 6', '2 6 4', '4 6 2'],
      correctFeedback: {
        title: 'Correct — in-order is left, root, right',
        body: 'Visit left subtree (just 2), then root (4), then right subtree (just 6). Result: 2 4 6.',
        reinforcement: 'Remember in-order with "Left Root Right" — alphabetically, L comes before R, and root is in the middle.',
      },
      wrongAnswerFeedback: {
        '4 2 6': { title: 'That is pre-order (Root, Left, Right)', hint: 'In-order visits left BEFORE root', body: 'Pre-order: root first. In-order: left, then root, then right.' },
        '2 6 4': { title: 'That is post-order (Left, Right, Root)', hint: 'In-order visits root before right, not after', body: 'Post-order: root last. In-order: root is in the middle.' },
        '4 6 2': { title: 'That would be reverse order starting from root', hint: 'In-order traversal: left subtree first', body: 'Start with the entire left subtree, then root, then right.' },
      },
    },
    {
      type: 'worked-sample',
      id: 'tree-height',
      heading: 'Tree Height — Recursive Pattern',
      code: `int height(TreeNode node) {
    if (node == null) return 0;
    int leftHeight  = height(node.left);
    int rightHeight = height(node.right);
    return 1 + Math.max(leftHeight, rightHeight);
}`,
      steps: [
        { line: '2', explanation: 'A null node has height 0 — it does not exist.' },
        { line: '3-4', explanation: 'Recursively get the height of both subtrees.' },
        { line: '5', explanation: 'This node adds 1 to the taller subtree height.' },
        { line: 'Pattern', explanation: 'This recursive pattern — base case null, recurse left, recurse right, combine — appears in most tree problems.' },
      ],
      result: 'A tree with root, left child, and right child has height 2',
    },
    {
      type: 'exercise',
      id: 'trace-tree-1',
      exerciseType: 'trace',
      heading: 'Trace Tree Height',
      prompt: 'Trace the height function on a tree: root=1, root.left=2 (leaf), root.right=null.',
      code: `//   1
//  /
// 2 (leaf)
// height(root)?`,
      steps: [
        {
          line: 'height(1)',
          description: 'Call height on root (value 1). Not null, so recurse.',
          variables: { node: 1, 'left call': 'height(2)', 'right call': 'height(null)' },
        },
        {
          line: 'height(2)',
          description: 'Node 2 is a leaf. Both children are null.',
          variables: { node: 2, leftHeight: 0, rightHeight: 0, returns: '1 + max(0,0) = 1' },
        },
        {
          line: 'height(null)',
          description: 'Null node returns 0 immediately.',
          variables: { node: 'null', returns: 0 },
        },
        {
          line: 'height(1) final',
          description: 'Back at root: leftHeight=1, rightHeight=0. Compute result.',
          variables: { leftHeight: 1, rightHeight: 0, result: '?' },
        },
      ],
      blanks: [{ stepIndex: 3, variable: 'result', expectedValue: '2' }],
      correctFeedback: {
        title: 'Correct — height is 2',
        body: '1 + max(1, 0) = 2. The tree has two levels: the root at level 1 and its left child at level 2.',
        reinforcement: 'This recursive pattern (recurse both ways, combine with 1+max) is the exact template for tree height, diameter, and many balance problems.',
      },
      wrongFeedback: {
        title: 'Check the combination',
        body: '1 + Math.max(leftHeight, rightHeight) = 1 + Math.max(1, 0) = 1 + 1 = ?',
        hint: 'leftHeight = 1 (from node 2). rightHeight = 0 (null child). 1 + max(1, 0) = ?',
      },
    },
    {
      type: 'exercise',
      id: 'choose-tree-1',
      exerciseType: 'choose-complexity',
      heading: 'Time Complexity',
      scenario: 'You run in-order traversal on a binary tree with n nodes.',
      question: 'What is the time complexity?',
      options: ['O(1)', 'O(n)', 'O(log n)'],
      expectedAnswer: 'O(n)',
      correctFeedback: {
        title: 'Correct — O(n)',
        body: 'Traversal visits every node exactly once. No matter how the tree is shaped, n nodes require n visits.',
        reinforcement: 'Any traversal (in-order, pre-order, post-order, BFS) is O(n). Only search/insert in a BST can be O(log n) — and only if the tree is balanced.',
      },
      wrongAnswerFeedback: {
        'O(1)': { title: 'That would mean visiting only one node', body: 'Traversal means visiting every node. n nodes = n operations = O(n).' },
        'O(log n)': { title: 'That is BST search — not traversal', body: 'BST search skips one half at each level: O(log n). Traversal visits all nodes: O(n).' },
      },
    },
    {
      type: 'exercise',
      id: 'fix-tree-1',
      exerciseType: 'fix-the-bug',
      heading: 'Fix the Bug',
      problem: 'This tree count function returns 0 for every non-empty tree.',
      code: `int countNodes(TreeNode node) {
    if (node == null) return 0;
    return countNodes(node.left) + countNodes(node.right);
}`,
      hint: 'You are recursively counting children but never counting the current node itself.',
      expectedFix: '1 +',
      correctFeedback: {
        title: 'Correct — add 1 for the current node',
        body: 'return 1 + countNodes(left) + countNodes(right). Each node counts itself plus all its descendants.',
        reinforcement: 'This is the missing-1 pattern in tree recursion. Whenever you are counting, summing, or measuring, ask: did I include the current node?',
      },
    },
    {
      type: 'reflection',
      id: 'summary-trees',
      heading: 'What You Have Learned',
      keyInsights: [
        'A binary tree node has a value, a left child, and a right child',
        'Traversal (in/pre/post-order) visits every node: O(n)',
        'In-order traversal on a BST produces sorted output',
        'The recursive pattern: base case (null → 0/null), recurse left, recurse right, combine',
        'A balanced tree has height O(log n) — this is why BST search can be O(log n)',
      ],
      rememberedPattern: 'Most tree problems follow: if null return base, recurse left, recurse right, combine results. If you can define "combine" correctly, recursion does the rest.',
    },
  ],
}
