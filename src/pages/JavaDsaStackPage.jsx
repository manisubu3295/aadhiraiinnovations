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
      'headline': 'Stacks in Java — Complete DSA Guide',
      'description': 'Master stacks with LIFO principle. Learn push, pop, real-world applications like balanced parentheses and undo operations.',
      'url': 'https://www.aadhiraiinnovations.com/learn/java-dsa/stack',
      'author': { '@type': 'Organization', 'name': 'Aadhirai Innovations' },
    }

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        { '@type': 'Question', 'name': 'What does LIFO mean?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Last In, First Out. The last element pushed is the first one popped.' } },
        { '@type': 'Question', 'name': 'What is the time complexity of push and pop?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Both are O(1) — constant time operations.' } },
        { '@type': 'Question', 'name': 'What is a real-world use of stacks?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Browser back button, undo in text editors, checking balanced parentheses, function call stack.' } },
        { '@type': 'Question', 'name': 'How to implement a stack?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Using array with index tracking, LinkedList, or Java\'s built-in Stack class.' } },
        { '@type': 'Question', 'name': 'What\'s the difference between stack and queue?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Stack is LIFO (last in, first out). Queue is FIFO (first in, first out).' } },
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

    return () => { article.remove(); faq.remove() }
  }, [])
}

export default function JavaDsaStackPage() {
  usePageSchema()
  const prevLesson = getPrevLesson('stack')
  const nextLesson = getNextLesson('stack')

  return (
    <LessonLayout
      breadcrumbItems={[
        { label: 'Learn', href: '/learn' },
        { label: 'Java DSA', href: '/learn/java-dsa' },
        { label: 'Stacks' },
      ]}
      prev={prevLesson ? { label: `Previous: ${prevLesson.title}`, href: `/learn/java-dsa/${prevLesson.slug}` } : null}
      next={nextLesson ? { label: `Next: ${nextLesson.title}`, href: `/learn/java-dsa/${nextLesson.slug}`, available: nextLesson.available } : null}
    >
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700">Lesson 3 · Core DSA</span>
          <span className="text-sm text-slate-500">10 min read</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#0B1F3A] leading-[1.1]">Stacks in Java</h1>
        <p className="text-xl text-slate-600 mt-4">LIFO data structure for elegant problem solving.</p>
      </motion.div>

      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className="prose prose-slate max-w-none mb-12">
        <h2 className="text-2xl font-bold text-[#0B1F3A] mt-8 mb-4">What is a Stack?</h2>
        <p className="text-lg text-slate-700 leading-relaxed mb-4">
          A <strong>stack</strong> is a data structure that follows the <strong>LIFO (Last In, First Out)</strong> principle. Think of a stack of plates — you add plates on top and remove from the top. The last plate you put on is the first one you take off.
        </p>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className="mb-12">
        <h2 className="text-2xl font-bold text-[#0B1F3A] mb-4">Implementing a Stack</h2>
        <CodeBlock code={`// Method 1: Using Java's built-in Stack class
Stack<Integer> stack = new Stack<>();
stack.push(10);      // Add to top: [10]
stack.push(20);      // Add to top: [10, 20]
stack.push(30);      // Add to top: [10, 20, 30]

int top = stack.pop();   // Remove from top: returns 30
int peek = stack.peek(); // View top without removing: returns 20
boolean empty = stack.isEmpty();  // false

// Method 2: Using LinkedList (more flexible)
Deque<Integer> stack = new LinkedList<>();
stack.push(10);      // Add to front
stack.pop();         // Remove from front
stack.peek();        // View top

// Method 3: Custom implementation using array
class MyStack {
  private int[] arr;
  private int top = -1;

  MyStack(int capacity) {
    arr = new int[capacity];
  }

  void push(int x) {
    arr[++top] = x;
  }

  int pop() {
    return arr[top--];
  }

  int peek() {
    return arr[top];
  }

  boolean isEmpty() {
    return top == -1;
  }
}`} />
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className="mb-12">
        <h2 className="text-2xl font-bold text-[#0B1F3A] mb-4">Time & Space Complexity</h2>
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white mb-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-4 py-3 font-semibold text-[#0B1F3A]">Operation</th>
                <th className="text-left px-4 py-3 font-semibold text-[#0B1F3A]">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr><td className="px-4 py-3 font-medium">push()</td><td className="px-4 py-3 font-mono text-[#0B1F3A]">O(1)</td></tr>
              <tr><td className="px-4 py-3 font-medium">pop()</td><td className="px-4 py-3 font-mono text-[#0B1F3A]">O(1)</td></tr>
              <tr><td className="px-4 py-3 font-medium">peek()</td><td className="px-4 py-3 font-mono text-[#0B1F3A]">O(1)</td></tr>
              <tr><td className="px-4 py-3 font-medium">search()</td><td className="px-4 py-3 font-mono text-[#0B1F3A]">O(n)</td></tr>
              <tr><td className="px-4 py-3 font-medium">Space</td><td className="px-4 py-3 font-mono text-[#0B1F3A]">O(n)</td></tr>
            </tbody>
          </table>
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className="mb-12">
        <h2 className="text-2xl font-bold text-[#0B1F3A] mb-4">Example: Valid Parentheses</h2>
        <p className="text-lg text-slate-700 mb-4">Check if brackets are balanced: "()" → true, "([)]" → false</p>
        <CodeBlock code={`public static boolean isValid(String s) {
  Stack<Character> stack = new Stack<>();

  for (char c : s.toCharArray()) {
    if (c == '(' || c == '[' || c == '{') {
      stack.push(c);  // Push opening brackets
    } else {
      if (stack.isEmpty()) return false;
      char top = stack.pop();
      // Check if closing bracket matches opening
      if ((c == ')' && top != '(') ||
          (c == ']' && top != '[') ||
          (c == '}' && top != '{')) {
        return false;
      }
    }
  }
  return stack.isEmpty();  // All brackets matched
}`} />
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className="mb-12 p-6 rounded-lg bg-slate-100 border-l-4 border-[#0B1F3A]">
        <h2 className="text-2xl font-bold text-[#0B1F3A] mb-4">Key Takeaways</h2>
        <ul className="space-y-3 list-none">
          <li className="flex gap-3"><span className="text-xl font-bold text-[#0B1F3A]">✓</span><span className="text-slate-700"><strong>LIFO principle:</strong> Last in is first out</span></li>
          <li className="flex gap-3"><span className="text-xl font-bold text-[#0B1F3A]">✓</span><span className="text-slate-700"><strong>O(1) operations:</strong> push, pop, peek are all constant time</span></li>
          <li className="flex gap-3"><span className="text-xl font-bold text-[#0B1F3A]">✓</span><span className="text-slate-700"><strong>Real-world uses:</strong> Undo/redo, browser back, balanced parentheses, recursion</span></li>
          <li className="flex gap-3"><span className="text-xl font-bold text-[#0B1F3A]">✓</span><span className="text-slate-700"><strong>When to use:</strong> When order matters and you need LIFO access</span></li>
        </ul>
      </motion.section>
    </LessonLayout>
  )
}
