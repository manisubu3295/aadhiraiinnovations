import { useEffect } from 'react'
import { motion } from 'framer-motion'
import LessonLayout from '../components/learn/LessonLayout'
import CodeBlock from '../components/learn/CodeBlock'
import { getPrevLesson, getNextLesson } from '../data/javaDsaLessons'

function usePageSchema() {
  useEffect(() => {
    const schema = { '@context': 'https://schema.org', '@type': 'Article', 'headline': 'Queues in Java — Complete DSA Guide', 'description': 'Master queues with FIFO principle. Learn enqueue, dequeue, and real-world applications like BFS and job scheduling.', 'url': 'https://www.aadhiraiinnovations.com/learn/java-dsa/queue', 'author': { '@type': 'Organization', 'name': 'Aadhirai Innovations' } }
    const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [{ '@type': 'Question', 'name': 'What does FIFO mean?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'First In, First Out. The first element added is the first one removed.' } }, { '@type': 'Question', 'name': 'What is the time complexity of enqueue and dequeue?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Both are O(1) — constant time operations with proper implementation.' } }, { '@type': 'Question', 'name': 'When do we use queues?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'BFS (breadth-first search), job scheduling, print queue, ticket counter simulations.' } }] }
    const article = document.createElement('script'); article.type = 'application/ld+json'; article.text = JSON.stringify(schema); document.head.appendChild(article)
    const faqScript = document.createElement('script'); faqScript.type = 'application/ld+json'; faqScript.text = JSON.stringify(faq); document.head.appendChild(faqScript)
    return () => { article.remove(); faqScript.remove() }
  }, [])
}

export default function JavaDsaQueuePage() {
  usePageSchema()
  const prevLesson = getPrevLesson('queue')
  const nextLesson = getNextLesson('queue')

  return (
    <LessonLayout breadcrumbItems={[{ label: 'Learn', href: '/learn' }, { label: 'Java DSA', href: '/learn/java-dsa' }, { label: 'Queues' }]} prev={prevLesson ? { label: `Previous: ${prevLesson.title}`, href: `/learn/java-dsa/${prevLesson.slug}` } : null} next={nextLesson ? { label: `Next: ${nextLesson.title}`, href: `/learn/java-dsa/${nextLesson.slug}`, available: nextLesson.available } : null}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
        <div className="flex items-center gap-2 mb-3"><span className="text-sm font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">Lesson 4 · Core DSA</span><span className="text-sm text-slate-500">10 min read</span></div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#0B1F3A] leading-[1.1]">Queues in Java</h1>
        <p className="text-xl text-slate-600 mt-4">FIFO data structure for ordered processing.</p>
      </motion.div>

      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className="prose prose-slate max-w-none mb-12">
        <h2 className="text-2xl font-bold text-[#0B1F3A] mt-8 mb-4">What is a Queue?</h2>
        <p className="text-lg text-slate-700 leading-relaxed">A <strong>queue</strong> is a data structure that follows <strong>FIFO (First In, First Out)</strong>. Like a queue at a ticket counter — the first person in line is served first. Elements are added at the rear and removed from the front.</p>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className="mb-12">
        <h2 className="text-2xl font-bold text-[#0B1F3A] mb-4">Implementing a Queue</h2>
        <CodeBlock code={`// Method 1: Using Java's Queue interface with LinkedList
Queue<Integer> queue = new LinkedList<>();
queue.add(10);       // Add to rear
queue.add(20);       // Rear: [10, 20]
queue.add(30);       // Rear: [10, 20, 30]

int front = queue.poll();  // Remove from front: returns 10
int peek = queue.peek();   // View front: returns 20

// Method 2: Using Deque (double-ended queue)
Deque<Integer> deque = new LinkedList<>();
deque.offerLast(10);   // Add to rear
deque.pollFirst();     // Remove from front

// Queue methods:
// add()    - add to rear (throws exception if full)
// offer()  - add to rear (returns false if full)
// remove() - remove from front (throws exception if empty)
// poll()   - remove from front (returns null if empty)
// peek()   - view front (returns null if empty)
// element() - view front (throws exception if empty)`} />
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className="mb-12">
        <h2 className="text-2xl font-bold text-[#0B1F3A] mb-4">Example: BFS (Level Order Traversal)</h2>
        <CodeBlock code={`// BFS on binary tree using queue
public static void bfs(TreeNode root) {
  if (root == null) return;
  Queue<TreeNode> queue = new LinkedList<>();
  queue.add(root);

  while (!queue.isEmpty()) {
    TreeNode node = queue.poll();
    System.out.print(node.val + " ");

    if (node.left != null) queue.add(node.left);
    if (node.right != null) queue.add(node.right);
  }
}

// For tree:     1
//             /   \\
//            2     3
// Output: 1 2 3 (level by level)`} />
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className="mb-12 p-6 rounded-lg bg-slate-100 border-l-4 border-[#0B1F3A]">
        <h2 className="text-2xl font-bold text-[#0B1F3A] mb-4">Key Points</h2>
        <ul className="space-y-2 list-none"><li className="flex gap-3"><span className="text-xl font-bold text-[#0B1F3A]">✓</span><span className="text-slate-700">FIFO principle: First in, first out</span></li><li className="flex gap-3"><span className="text-xl font-bold text-[#0B1F3A]">✓</span><span className="text-slate-700">O(1) enqueue & dequeue with proper implementation</span></li><li className="flex gap-3"><span className="text-xl font-bold text-[#0B1F3A]">✓</span><span className="text-slate-700">Used for: BFS, job queues, print spooling, ticket counters</span></li></ul>
      </motion.section>
    </LessonLayout>
  )
}
