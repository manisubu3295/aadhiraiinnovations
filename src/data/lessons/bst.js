export const lessonData = {
  slug: 'bst',
  title: 'Binary Search Trees',
  subtitle: 'A binary tree with a rule: left < root < right at every node.',
  badge: 'Lesson 17 · Advanced',
  estimatedTime: '18 min',
  blocks: [
    {
      type: 'concept',
      id: 'what-is-bst',
      heading: 'What is a BST?',
      body: `A Binary Search Tree is a binary tree with one extra rule:
For every node N:
- All values in N's left subtree are less than N.val
- All values in N's right subtree are greater than N.val

This rule applies recursively to every node, not just the root.

Because of this property, searching for a value takes O(h) time where h is the tree height. For a balanced BST, h = O(log n), giving O(log n) search — the same as binary search on a sorted array, but with efficient insert and delete.`,
    },
    {
      type: 'visual',
      id: 'bst-visual',
      component: 'ArrayVisual',
      props: { elements: [1, 3, 5, 7, 9, 11, 13], highlightIndex: 3, label: 'in-order' },
      caption: 'In-order traversal of a BST always produces sorted output. These 7 values correspond to a balanced BST with root=7.',
    },
    {
      type: 'worked-sample',
      id: 'bst-search',
      heading: 'BST Search — O(log n) Balanced',
      code: `TreeNode search(TreeNode root, int target) {
    if (root == null) return null;      // not found
    if (root.val == target) return root; // found!
    if (target < root.val)
        return search(root.left, target);  // must be in left
    else
        return search(root.right, target); // must be in right
}`,
      steps: [
        { line: '2-3', explanation: 'Base cases: null means not found; match means return the node.' },
        { line: '4-5', explanation: 'Target is smaller → go left. Everything in the right subtree is larger, so we can ignore it entirely.' },
        { line: '6-7', explanation: 'Target is larger → go right. We eliminated half the tree with one comparison.' },
        { line: 'Key', explanation: 'Each comparison eliminates one subtree. Balanced BST: O(log n). Degenerate BST (sorted input): O(n).' },
      ],
      result: 'search(root, 5): root=7 → left → root=3 → right → root=5 ✓ — 3 comparisons for 7 nodes',
    },
    {
      type: 'exercise',
      id: 'predict-bst-1',
      exerciseType: 'predict-output',
      heading: 'Predict the Path',
      prompt: 'BST: root=8, left=3, right=10. Searching for 10 — how many comparisons?',
      code: `// BST:     8
//        / \\
//       3   10
// search(root, 10)`,
      expectedAnswer: '2',
      options: ['1', '2', '3', '4'],
      correctFeedback: {
        title: 'Correct — 2 comparisons',
        body: 'Step 1: compare 10 with root 8 → go right. Step 2: compare 10 with node 10 → found! Two comparisons.',
        reinforcement: 'A balanced BST finds any element in at most log₂(n)+1 comparisons. For n=7 nodes: at most 3 comparisons.',
      },
      wrongAnswerFeedback: {
        '1': { title: '10 is not the root — one comparison is not enough', hint: 'First comparison is at root=8, not at node 10', body: 'Comparison 1: 10 > 8, go right. Comparison 2: 10 == 10, found. Total: 2.' },
        '3': { title: 'The search terminates as soon as it finds the value', hint: 'Node 10 is at depth 1 (one level below root)', body: '10 is a direct child of root. Root comparison + child comparison = 2.' },
        '4': { title: 'The tree is only 2 levels deep here', hint: 'Count the levels: root at level 1, its children at level 2', body: 'This BST has only 3 nodes. Maximum path length is 2.' },
      },
    },
    {
      type: 'worked-sample',
      id: 'bst-insert',
      heading: 'BST Insert — Recursive',
      code: `TreeNode insert(TreeNode root, int val) {
    if (root == null) return new TreeNode(val); // found insertion point
    if (val < root.val)
        root.left = insert(root.left, val);
    else if (val > root.val)
        root.right = insert(root.right, val);
    // val == root.val: duplicate, do nothing (or handle per requirement)
    return root;
}`,
      steps: [
        { line: '2', explanation: 'Reached an empty spot — this is where the new node goes.' },
        { line: '3-4', explanation: 'Value is smaller → recurse left. The returned node is reassigned to root.left (handles the null→new node case).' },
        { line: '5-6', explanation: 'Value is larger → recurse right. Same reassignment pattern.' },
        { line: '8', explanation: 'Return the (potentially updated) root so callers can reassign their child pointer.' },
      ],
      result: 'insert(BST, 4): navigates 8→3→right→null → places 4 as right child of 3',
    },
    {
      type: 'exercise',
      id: 'fill-bst-1',
      exerciseType: 'fill-in-code',
      heading: 'Fill in the Gap',
      prompt: 'Complete BST validation — check that every node satisfies the BST property:',
      codeTemplate: `boolean isValidBST(TreeNode node, long min, long max) {
    if (node == null) return true;
    if (node.val <= min || node.val >= max) return false;
    return isValidBST(node.left, min, node.val) &&
           isValidBST(node.___, node.val, max);
}
// Call: isValidBST(root, Long.MIN_VALUE, Long.MAX_VALUE)`,
      blanks: [{ id: 'blank1', expectedValue: 'right', label: 'blank1' }],
      hint: 'The right subtree is validated with node.val as the new minimum.',
      correctFeedback: {
        title: 'Correct — node.right',
        body: 'Right subtree: every value must be > node.val (new min) and < current max. node.left: every value must be < node.val (new max).',
        suggestion: 'Passing min/max bounds down the tree is the canonical approach — it catches violations that a naive "just check children" approach misses.',
      },
    },
    {
      type: 'exercise',
      id: 'trace-bst-1',
      exerciseType: 'trace',
      heading: 'Trace BST Validation',
      prompt: 'Is [5, 1, 4, null, null, 3, 6] a valid BST? (root=5, left=1, right=4, right.left=3, right.right=6)',
      code: `//        5
//       / \\
//      1   4
//         / \\
//        3   6
// isValidBST(root, MIN, MAX)?`,
      steps: [
        {
          line: 'root=5',
          description: 'Check 5: MIN < 5 < MAX ✓. Recurse left and right.',
          variables: { node: 5, min: 'MIN', max: 'MAX', valid: 'true so far' },
        },
        {
          line: 'node=4 (right child of 5)',
          description: 'Check 4: must be > 5 (min=5). But 4 < 5!',
          variables: { node: 4, min: 5, max: 'MAX', '4 > 5': 'false', result: '?' },
        },
        {
          line: 'Conclusion',
          description: 'Node 4 violates the BST property (it is in the right subtree but smaller than root 5).',
          variables: { isValid: 'false', reason: 'right child 4 < root 5' },
        },
      ],
      blanks: [{ stepIndex: 1, variable: 'result', expectedValue: 'false' }],
      correctFeedback: {
        title: 'Correct — not a valid BST',
        body: '4 is in the right subtree of 5, but 4 < 5. This violates the BST property. The min bound catches this: 4 <= 5 → return false.',
        reinforcement: 'This is exactly why the min/max bound approach is needed. A simple "left < root < right" check misses violations that span multiple levels.',
      },
      wrongFeedback: {
        title: 'Check the min constraint',
        body: 'Node 4 is in the right subtree of 5. All nodes in the right subtree must be > 5. Is 4 > 5?',
        hint: '4 is NOT greater than 5 → invalid BST → result is false.',
      },
    },
    {
      type: 'exercise',
      id: 'choose-bst-1',
      exerciseType: 'choose-complexity',
      heading: 'Time Complexity',
      scenario: 'You search for a value in a perfectly balanced BST with n nodes.',
      question: 'What is the time complexity?',
      options: ['O(1)', 'O(n)', 'O(log n)'],
      expectedAnswer: 'O(log n)',
      correctFeedback: {
        title: 'Correct — O(log n)',
        body: 'Each comparison eliminates half the remaining nodes. A balanced BST with n nodes has height log₂(n). At most log₂(n)+1 comparisons.',
        reinforcement: 'The key word is "balanced." An unbalanced BST degrades to O(n). Self-balancing trees (AVL, Red-Black) maintain O(log n) automatically.',
      },
      wrongAnswerFeedback: {
        'O(1)': { title: 'That would mean always finding in one comparison', body: 'Even in the best case (target is root), the search function makes 1 comparison. But we are analyzing worst case.' },
        'O(n)': { title: 'That is a degenerate BST (like a linked list)', body: 'A balanced BST is O(log n). Only a completely skewed BST (all nodes in one direction) degrades to O(n).' },
      },
    },
    {
      type: 'reflection',
      id: 'summary-bst',
      heading: 'What You Have Learned',
      keyInsights: [
        'BST rule: left subtree values < node.val < right subtree values (recursively)',
        'Search, insert, delete: O(log n) for balanced BST, O(n) for degenerate (skewed)',
        'In-order traversal of a BST always produces sorted output',
        'BST validation requires passing min/max bounds — not just checking immediate children',
        'Java\'s TreeMap and TreeSet are backed by a Red-Black tree (self-balancing BST) — O(log n) guaranteed',
      ],
      rememberedPattern: 'BST search template: null → not found, match → return, val < root → go left, val > root → go right. Each step discards half the tree.',
    },
  ],
}
