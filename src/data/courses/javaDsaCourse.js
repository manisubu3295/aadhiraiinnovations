/**
 * Java DSA Course — Full Roadmap
 * 5 Levels · 15 Modules · 45 Lessons
 *
 * status: 'live' | 'soon' | 'planned'
 * Each live lesson must have a corresponding /learn/java-dsa/[slug] route.
 */

export const course = {
  id: 'java-dsa',
  title: 'Java DSA — Data Structures & Algorithms',
  subtitle: 'A complete mentor-guided system. From your first array to dynamic programming.',
  totalLessons: 45,
  liveLessons: 6,
  estimatedHours: 60,

  levels: [
    {
      id: 'l1',
      level: 1,
      title: 'Foundations',
      subtitle: 'Build the mental model before writing a single algorithm.',
      color: '#0B1F3A',
      modules: [
        {
          id: 'm1',
          title: 'First Principles',
          lessons: [
            { id: 'arrays', title: 'Arrays in Java', slug: 'arrays', status: 'live', estimatedTime: '15 min', exerciseCount: 4 },
            { id: 'strings', title: 'Strings in Java', slug: 'strings', status: 'soon', estimatedTime: '12 min', exerciseCount: 3 },
            { id: 'math-basics', title: 'Math for DSA', slug: 'math-basics', status: 'planned', estimatedTime: '10 min', exerciseCount: 3 },
          ],
        },
        {
          id: 'm2',
          title: 'Complexity',
          lessons: [
            { id: 'big-o', title: 'Big O Notation', slug: 'big-o', status: 'soon', estimatedTime: '14 min', exerciseCount: 4 },
            { id: 'space-complexity', title: 'Space Complexity', slug: 'space-complexity', status: 'planned', estimatedTime: '10 min', exerciseCount: 3 },
            { id: 'complexity-patterns', title: 'Common Complexity Patterns', slug: 'complexity-patterns', status: 'planned', estimatedTime: '12 min', exerciseCount: 3 },
          ],
        },
        {
          id: 'm3',
          title: 'Two-Pointer Technique',
          lessons: [
            { id: 'two-pointers', title: 'Two Pointers', slug: 'two-pointers', status: 'planned', estimatedTime: '16 min', exerciseCount: 4 },
            { id: 'sliding-window', title: 'Sliding Window', slug: 'sliding-window', status: 'planned', estimatedTime: '16 min', exerciseCount: 4 },
            { id: 'prefix-sum', title: 'Prefix Sum', slug: 'prefix-sum', status: 'planned', estimatedTime: '12 min', exerciseCount: 3 },
          ],
        },
      ],
    },

    {
      id: 'l2',
      level: 2,
      title: 'Core Logic',
      subtitle: 'The algorithms every engineer must know cold.',
      color: '#1E3A5F',
      modules: [
        {
          id: 'm4',
          title: 'Searching',
          lessons: [
            { id: 'binary-search', title: 'Binary Search', slug: 'binary-search', status: 'live', estimatedTime: '16 min', exerciseCount: 4 },
            { id: 'binary-search-variants', title: 'Binary Search Variants', slug: 'binary-search-variants', status: 'planned', estimatedTime: '14 min', exerciseCount: 4 },
            { id: 'linear-search', title: 'Linear Search & When to Use It', slug: 'linear-search', status: 'planned', estimatedTime: '10 min', exerciseCount: 3 },
          ],
        },
        {
          id: 'm5',
          title: 'Sorting',
          lessons: [
            { id: 'bubble-sort', title: 'Bubble Sort', slug: 'bubble-sort', status: 'planned', estimatedTime: '12 min', exerciseCount: 3 },
            { id: 'merge-sort', title: 'Merge Sort', slug: 'merge-sort', status: 'planned', estimatedTime: '18 min', exerciseCount: 4 },
            { id: 'quick-sort', title: 'Quick Sort', slug: 'quick-sort', status: 'planned', estimatedTime: '18 min', exerciseCount: 4 },
          ],
        },
        {
          id: 'm6',
          title: 'Linked Lists',
          lessons: [
            { id: 'linked-list', title: 'Linked Lists in Java', slug: 'linked-list', status: 'live', estimatedTime: '18 min', exerciseCount: 4 },
            { id: 'doubly-linked', title: 'Doubly Linked Lists', slug: 'doubly-linked', status: 'planned', estimatedTime: '16 min', exerciseCount: 4 },
            { id: 'fast-slow-pointer', title: 'Fast & Slow Pointer', slug: 'fast-slow-pointer', status: 'planned', estimatedTime: '14 min', exerciseCount: 4 },
          ],
        },
      ],
    },

    {
      id: 'l3',
      level: 3,
      title: 'Data Structures',
      subtitle: 'The containers that shape how algorithms think.',
      color: '#2D5282',
      modules: [
        {
          id: 'm7',
          title: 'Stack & Queue',
          lessons: [
            { id: 'stack', title: 'Stacks in Java', slug: 'stack', status: 'live', estimatedTime: '15 min', exerciseCount: 4 },
            { id: 'queue', title: 'Queues in Java', slug: 'queue', status: 'live', estimatedTime: '14 min', exerciseCount: 4 },
            { id: 'monotonic-stack', title: 'Monotonic Stack', slug: 'monotonic-stack', status: 'planned', estimatedTime: '16 min', exerciseCount: 4 },
          ],
        },
        {
          id: 'm8',
          title: 'Hashing',
          lessons: [
            { id: 'hash-maps', title: 'HashMaps in Java', slug: 'hash-maps', status: 'soon', estimatedTime: '16 min', exerciseCount: 4 },
            { id: 'hash-sets', title: 'HashSets & Deduplication', slug: 'hash-sets', status: 'planned', estimatedTime: '12 min', exerciseCount: 3 },
            { id: 'frequency-counting', title: 'Frequency Counting Pattern', slug: 'frequency-counting', status: 'planned', estimatedTime: '14 min', exerciseCount: 4 },
          ],
        },
        {
          id: 'm9',
          title: 'Heaps & Priority Queues',
          lessons: [
            { id: 'heaps', title: 'Heaps & PriorityQueue', slug: 'heaps', status: 'planned', estimatedTime: '18 min', exerciseCount: 4 },
            { id: 'top-k', title: 'Top K Pattern', slug: 'top-k', status: 'planned', estimatedTime: '14 min', exerciseCount: 4 },
            { id: 'heap-sort', title: 'Heap Sort', slug: 'heap-sort', status: 'planned', estimatedTime: '14 min', exerciseCount: 3 },
          ],
        },
      ],
    },

    {
      id: 'l4',
      level: 4,
      title: 'Advanced Thinking',
      subtitle: 'Recursive patterns and structural reasoning.',
      color: '#3D6B9E',
      modules: [
        {
          id: 'm10',
          title: 'Recursion',
          lessons: [
            { id: 'recursion', title: 'Recursion in Java', slug: 'recursion', status: 'live', estimatedTime: '17 min', exerciseCount: 4 },
            { id: 'backtracking', title: 'Backtracking', slug: 'backtracking', status: 'planned', estimatedTime: '20 min', exerciseCount: 4 },
            { id: 'divide-conquer', title: 'Divide & Conquer', slug: 'divide-conquer', status: 'planned', estimatedTime: '16 min', exerciseCount: 4 },
          ],
        },
        {
          id: 'm11',
          title: 'Trees',
          lessons: [
            { id: 'binary-trees', title: 'Binary Trees', slug: 'binary-trees', status: 'soon', estimatedTime: '20 min', exerciseCount: 4 },
            { id: 'tree-traversal', title: 'Tree Traversal (DFS / BFS)', slug: 'tree-traversal', status: 'planned', estimatedTime: '18 min', exerciseCount: 4 },
            { id: 'bst', title: 'Binary Search Trees', slug: 'bst', status: 'planned', estimatedTime: '18 min', exerciseCount: 4 },
          ],
        },
        {
          id: 'm12',
          title: 'Intervals & Greedy',
          lessons: [
            { id: 'intervals', title: 'Interval Problems', slug: 'intervals', status: 'planned', estimatedTime: '16 min', exerciseCount: 4 },
            { id: 'greedy', title: 'Greedy Algorithms', slug: 'greedy', status: 'planned', estimatedTime: '16 min', exerciseCount: 4 },
            { id: 'activity-selection', title: 'Activity Selection & Scheduling', slug: 'activity-selection', status: 'planned', estimatedTime: '14 min', exerciseCount: 3 },
          ],
        },
      ],
    },

    {
      id: 'l5',
      level: 5,
      title: 'Mastery',
      subtitle: 'Graphs, dynamic programming, and systems thinking.',
      color: '#4A80BE',
      modules: [
        {
          id: 'm13',
          title: 'Graphs',
          lessons: [
            { id: 'graph-basics', title: 'Graphs — Representation', slug: 'graph-basics', status: 'planned', estimatedTime: '16 min', exerciseCount: 4 },
            { id: 'graph-bfs-dfs', title: 'BFS & DFS on Graphs', slug: 'graph-bfs-dfs', status: 'planned', estimatedTime: '20 min', exerciseCount: 4 },
            { id: 'shortest-path', title: 'Shortest Path (Dijkstra)', slug: 'shortest-path', status: 'planned', estimatedTime: '22 min', exerciseCount: 4 },
          ],
        },
        {
          id: 'm14',
          title: 'Dynamic Programming',
          lessons: [
            { id: 'dp-intro', title: 'DP — Memoization vs Tabulation', slug: 'dp-intro', status: 'planned', estimatedTime: '20 min', exerciseCount: 4 },
            { id: 'dp-1d', title: '1D DP Patterns', slug: 'dp-1d', status: 'planned', estimatedTime: '18 min', exerciseCount: 4 },
            { id: 'dp-2d', title: '2D DP & Grid Problems', slug: 'dp-2d', status: 'planned', estimatedTime: '20 min', exerciseCount: 4 },
          ],
        },
        {
          id: 'm15',
          title: 'System Thinking',
          lessons: [
            { id: 'complexity-analysis', title: 'Advanced Complexity Analysis', slug: 'complexity-analysis', status: 'planned', estimatedTime: '16 min', exerciseCount: 3 },
            { id: 'problem-patterns', title: 'Recognizing Problem Patterns', slug: 'problem-patterns', status: 'planned', estimatedTime: '18 min', exerciseCount: 4 },
            { id: 'interview-strategy', title: 'Interview Strategy & Walkthrough', slug: 'interview-strategy', status: 'planned', estimatedTime: '20 min', exerciseCount: 3 },
          ],
        },
      ],
    },
  ],
}

/**
 * Flat lookup: slug → lesson metadata
 * Useful for linking lesson pages to their course metadata.
 */
export const lessonIndex = Object.fromEntries(
  course.levels.flatMap(level =>
    level.modules.flatMap(mod =>
      mod.lessons.map(lesson => [lesson.slug, { ...lesson, levelId: level.id, levelTitle: level.title, moduleTitle: mod.title }])
    )
  )
)
