import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Container from '../components/ui/Container'
import LessonLayout from '../components/learn/LessonLayout'
import CodeBlock from '../components/learn/CodeBlock'
import { javaDsaLessons, getPrevLesson, getNextLesson } from '../data/javaDsaLessons'

function usePageSchema() {
  useEffect(() => {
    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': 'Linked Lists in Java — Complete DSA Guide',
      'description': 'Master linked lists with singly and doubly linked implementations. Learn node pointers, traversal, reversal, and solve real-world problems.',
      'url': 'https://www.aadhiraiinnovations.com/learn/java-dsa/linked-list',
      'author': {
        '@type': 'Organization',
        'name': 'Aadhirai Innovations',
      },
    }

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'What is a linked list?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'A linked list is a dynamic data structure where each element (node) points to the next one. Unlike arrays, linked lists don\'t require contiguous memory, making insertion/deletion efficient.',
          },
        },
        {
          '@type': 'Question',
          'name': 'What is the difference between singly and doubly linked lists?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Singly linked: each node points to the next node only. Doubly linked: each node points to both the next and previous nodes, allowing backward traversal.',
          },
        },
        {
          '@type': 'Question',
          'name': 'What is the time complexity of inserting in a linked list?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'O(1) if you have a pointer to the previous node. O(n) if you need to find the position first.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Why use linked lists over arrays?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Linked lists are better for frequent insertions/deletions at any position (O(1) vs O(n)). Arrays are better for random access (O(1) vs O(n)).',
          },
        },
        {
          '@type': 'Question',
          'name': 'How do you reverse a linked list?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Use three pointers (prev, current, next) to reverse the links iteratively. Time: O(n), Space: O(1). Or use recursion: O(n) time, O(n) space.',
          },
        },
      ],
    }

    const article = document.createElement('script')
    article.type = 'application/ld+json'
    article.setAttribute('data-schema', 'article')
    article.text = JSON.stringify(articleSchema)
    document.head.appendChild(article)

    const faq = document.createElement('script')
    faq.type = 'application/ld+json'
    faq.setAttribute('data-schema', 'faqpage')
    faq.text = JSON.stringify(faqSchema)
    document.head.appendChild(faq)

    return () => {
      article.remove()
      faq.remove()
    }
  }, [])
}

export default function JavaDsaLinkedListPage() {
  usePageSchema()

  const prevLesson = getPrevLesson('linked-list')
  const nextLesson = getNextLesson('linked-list')

  return (
    <LessonLayout
      breadcrumbItems={[
        { label: 'Learn', href: '/learn' },
        { label: 'Java DSA', href: '/learn/java-dsa' },
        { label: 'Linked Lists' },
      ]}
      prev={prevLesson ? { label: `Previous: ${prevLesson.title}`, href: `/learn/java-dsa/${prevLesson.slug}` } : null}
      next={nextLesson ? {
        label: `Next: ${nextLesson.title}`,
        href: `/learn/java-dsa/${nextLesson.slug}`,
        available: nextLesson.available,
      } : null}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-semibold px-3 py-1 rounded-full bg-purple-100 text-purple-700">Lesson 2 · Core DSA</span>
          <span className="text-sm text-slate-500">12 min read</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#0B1F3A] leading-[1.1]">
          Linked Lists in Java
        </h1>
        <p className="text-xl text-slate-600 mt-4">
          Dynamic data structure with efficient insertion and deletion.
        </p>
      </motion.div>

      {/* Introduction */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="prose prose-slate max-w-none mb-12"
      >
        <h2 className="text-2xl font-bold text-[#0B1F3A] mt-8 mb-4">What is a Linked List?</h2>
        <p className="text-lg text-slate-700 leading-relaxed mb-4">
          A <strong>linked list</strong> is a dynamic data structure where data is stored in <strong>nodes</strong>, and each node points to the next one. Imagine a train with coaches — each coach knows only which coach comes next, not the entire train.
        </p>
        <p className="text-lg text-slate-700 leading-relaxed">
          Unlike arrays (which use contiguous memory), linked lists can grow or shrink dynamically. This makes them ideal when you don't know the size in advance or need frequent insertions/deletions.
        </p>
      </motion.section>

      {/* Node Structure */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-[#0B1F3A] mb-4">Node Structure</h2>
        <CodeBlock
          code={`// Node class (building block of linked list)
class Node {
  int data;
  Node next;

  Node(int data) {
    this.data = data;
    this.next = null;  // Initially points to nothing
  }
}

// Creating nodes
Node head = new Node(10);       // First node
head.next = new Node(20);       // Second node
head.next.next = new Node(30);  // Third node
// Now: 10 → 20 → 30 → null`}
          title="Linked List Nodes"
        />
      </motion.section>

      {/* Complexity Table */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-[#0B1F3A] mb-4">Time & Space Complexity</h2>
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white mb-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-4 py-3 font-semibold text-[#0B1F3A]">Operation</th>
                <th className="text-left px-4 py-3 font-semibold text-[#0B1F3A]">Time</th>
                <th className="text-left px-4 py-3 font-semibold text-[#0B1F3A]">Why?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="px-4 py-3 font-medium text-slate-900">Access element at index</td>
                <td className="px-4 py-3 font-mono text-[#0B1F3A]">O(n)</td>
                <td className="px-4 py-3 text-slate-600">Must traverse from head</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-900">Insert at head</td>
                <td className="px-4 py-3 font-mono text-[#0B1F3A]">O(1)</td>
                <td className="px-4 py-3 text-slate-600">Immediate, no traversal</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-900">Insert at position</td>
                <td className="px-4 py-3 font-mono text-[#0B1F3A]">O(n)</td>
                <td className="px-4 py-3 text-slate-600">Find position, then O(1) insert</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-900">Delete node</td>
                <td className="px-4 py-3 font-mono text-[#0B1F3A]">O(n)</td>
                <td className="px-4 py-3 text-slate-600">Find and update pointers</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-900">Search</td>
                <td className="px-4 py-3 font-mono text-[#0B1F3A]">O(n)</td>
                <td className="px-4 py-3 text-slate-600">Must check each node</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-900">Space</td>
                <td className="px-4 py-3 font-mono text-[#0B1F3A]">O(n)</td>
                <td className="px-4 py-3 text-slate-600">Stores n elements + n pointers</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.section>

      {/* Common Operations */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-[#0B1F3A] mb-4">Common Operations</h2>

        <h3 className="text-xl font-semibold text-[#0B1F3A] mt-6 mb-3">Traverse the List</h3>
        <CodeBlock
          code={`public static void traverse(Node head) {
  Node current = head;
  while (current != null) {
    System.out.print(current.data + " → ");
    current = current.next;
  }
  System.out.println("null");  // Print end
}

// Output: 10 → 20 → 30 → null`}
        />

        <h3 className="text-xl font-semibold text-[#0B1F3A] mt-6 mb-3">Insert at Head (O(1))</h3>
        <CodeBlock
          code={`public static Node insertAtHead(Node head, int newData) {
  Node newNode = new Node(newData);
  newNode.next = head;  // Point new node to old head
  return newNode;       // New node becomes head
}

// Usage:
head = insertAtHead(head, 5);  // 5 → 10 → 20 → 30`}
        />

        <h3 className="text-xl font-semibold text-[#0B1F3A] mt-6 mb-3">Search for a Value</h3>
        <CodeBlock
          code={`public static boolean search(Node head, int target) {
  Node current = head;
  while (current != null) {
    if (current.data == target) {
      return true;
    }
    current = current.next;
  }
  return false;  // Not found
}`}
        />
      </motion.section>

      {/* Example Problem: Reverse a Linked List */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-[#0B1F3A] mb-4">Classic Problem: Reverse a Linked List</h2>
        <p className="text-lg text-slate-700 mb-4">
          <strong>Problem:</strong> Given a linked list, reverse it. Input: 1 → 2 → 3 → null, Output: 3 → 2 → 1 → null
        </p>
        <CodeBlock
          code={`// Iterative approach: O(n) time, O(1) space
public static Node reverse(Node head) {
  Node prev = null;
  Node current = head;

  while (current != null) {
    Node nextTemp = current.next;  // Save next
    current.next = prev;            // Reverse the link
    prev = current;                 // Move prev forward
    current = nextTemp;             // Move current forward
  }

  return prev;  // New head
}

// Step by step (for 1→2→3):
// Initial: 1→2→3, prev=null
// Step 1: null←1  2→3 (1 now points to null)
// Step 2: null←1←2  3 (2 now points to 1)
// Step 3: null←1←2←3 (3 now points to 2)
// Result: 3→2→1→null`}
        />
      </motion.section>

      {/* Common Mistakes */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-[#0B1F3A] mb-6">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          {[
            {
              title: 'Losing the Head Pointer',
              description: 'If you don\'t save the head, you can\'t traverse the list anymore.',
              code: 'head = head.next;  // ❌ Lost the head!\nNode temp = head; // ✓ Save head first',
            },
            {
              title: 'Null Pointer Exception',
              description: 'Trying to access .next on a null node crashes the program.',
              code: 'current = current.next.next;  // ❌ What if current.next is null?\ncurrent = current.next;      // ✓ Check each step',
            },
            {
              title: 'Not Updating Pointers During Deletion',
              description: 'Deleting a node without fixing the links leaves broken pointers.',
              code: 'prev.next = null;  // ❌ Broken connection\nprev.next = current.next;  // ✓ Skip the deleted node',
            },
            {
              title: 'Infinite Loop',
              description: 'If you create a cycle, traversal never ends.',
              code: 'current.next = prev;  // ❌ Creates cycle\ncurrent.next = null;   // ✓ Proper termination',
            },
          ].map((mistake) => (
            <div key={mistake.title} className="p-4 rounded-lg border border-amber-200 bg-amber-50">
              <h4 className="font-semibold text-amber-900 mb-2">{mistake.title}</h4>
              <p className="text-sm text-amber-800 mb-3">{mistake.description}</p>
              <CodeBlock code={mistake.code} />
            </div>
          ))}
        </div>
      </motion.section>

      {/* Summary */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="mb-12 p-6 rounded-lg bg-slate-100 border-l-4 border-[#0B1F3A]"
      >
        <h2 className="text-2xl font-bold text-[#0B1F3A] mb-4">Summary</h2>
        <ul className="space-y-3 list-none">
          <li className="flex gap-3">
            <span className="text-xl font-bold text-[#0B1F3A]">✓</span>
            <span className="text-slate-700"><strong>Dynamic size:</strong> Grows/shrinks as needed, unlike fixed arrays</span>
          </li>
          <li className="flex gap-3">
            <span className="text-xl font-bold text-[#0B1F3A]">✓</span>
            <span className="text-slate-700"><strong>Efficient insertion/deletion:</strong> O(1) at head, O(n) elsewhere</span>
          </li>
          <li className="flex gap-3">
            <span className="text-xl font-bold text-[#0B1F3A]">✓</span>
            <span className="text-slate-700"><strong>Slow random access:</strong> O(n) to reach any node</span>
          </li>
          <li className="flex gap-3">
            <span className="text-xl font-bold text-[#0B1F3A]">✓</span>
            <span className="text-slate-700"><strong>Use when:</strong> Frequent insertions/deletions, unknown size, implement stacks/queues</span>
          </li>
        </ul>
      </motion.section>
    </LessonLayout>
  )
}
