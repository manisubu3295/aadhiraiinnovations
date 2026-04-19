import { useEffect } from 'react'
import { motion } from 'framer-motion'
import LessonLayout from '../components/learn/LessonLayout'
import CodeBlock from '../components/learn/CodeBlock'
import { getPrevLesson } from '../data/javaDsaLessons'

function usePageSchema() {
  useEffect(() => {
    const schema = { '@context': 'https://schema.org', '@type': 'Article', 'headline': 'Recursion in Java — Complete DSA Guide', 'description': 'Master recursion with base case, recursive case, and call stack. Learn memoization to optimize recursive solutions.', 'url': 'https://www.aadhiraiinnovations.com/learn/java-dsa/recursion', 'author': { '@type': 'Organization', 'name': 'Aadhirai Innovations' } }
    const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [{ '@type': 'Question', 'name': 'What is recursion?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'A function that calls itself to solve a problem. Must have base case (stop condition) and recursive case (problem reduction).' } }, { '@type': 'Question', 'name': 'What is a base case?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'The stopping condition. Without it, recursion never ends and causes stack overflow.' } }, { '@type': 'Question', 'name': 'What is the call stack?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'A memory structure tracking function calls. Each call adds a frame; each return removes it. Limited size causes stack overflow.' } }, { '@type': 'Question', 'name': 'When to use recursion vs loops?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Use recursion for tree/graph traversal, divide-and-conquer problems. Use loops for simple iterations (loops are faster).' } }] }
    const article = document.createElement('script'); article.type = 'application/ld+json'; article.text = JSON.stringify(schema); document.head.appendChild(article)
    const faqScript = document.createElement('script'); faqScript.type = 'application/ld+json'; faqScript.text = JSON.stringify(faq); document.head.appendChild(faqScript)
    return () => { article.remove(); faqScript.remove() }
  }, [])
}

export default function JavaDsaRecursionPage() {
  usePageSchema()
  const prevLesson = getPrevLesson('recursion')

  return (
    <LessonLayout breadcrumbItems={[{ label: 'Learn', href: '/learn' }, { label: 'Java DSA', href: '/learn/java-dsa' }, { label: 'Recursion' }]} prev={prevLesson ? { label: `Previous: ${prevLesson.title}`, href: `/learn/java-dsa/${prevLesson.slug}` } : null} next={null}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
        <div className="flex items-center gap-2 mb-3"><span className="text-sm font-semibold px-3 py-1 rounded-full bg-red-100 text-red-700">Lesson 6 · Advanced</span><span className="text-sm text-slate-500">13 min read</span></div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#0B1F3A] leading-[1.1]">Recursion in Java</h1>
        <p className="text-xl text-slate-600 mt-4">Functions that call themselves to solve problems elegantly.</p>
      </motion.div>

      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className="prose prose-slate max-w-none mb-12">
        <h2 className="text-2xl font-bold text-[#0B1F3A] mt-8 mb-4">What is Recursion?</h2>
        <p className="text-lg text-slate-700 leading-relaxed">Recursion is when a function calls itself to solve a smaller version of the same problem. Like Russian dolls — each doll opens to a smaller one inside. Every recursive solution has two parts: <strong>base case</strong> (when to stop) and <strong>recursive case</strong> (call yourself with smaller input).</p>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className="mb-12">
        <h2 className="text-2xl font-bold text-[#0B1F3A] mb-4">Basic Examples</h2>
        <CodeBlock code={`// Example 1: Factorial
// 5! = 5 * 4 * 3 * 2 * 1 = 120
public static int factorial(int n) {
  // Base case: stop when n = 1
  if (n == 1) return 1;

  // Recursive case: n! = n * (n-1)!
  return n * factorial(n - 1);
}

// Call stack for factorial(5):
// factorial(5) → 5 * factorial(4)
// factorial(4) → 4 * factorial(3)
// factorial(3) → 3 * factorial(2)
// factorial(2) → 2 * factorial(1)
// factorial(1) → 1 (BASE CASE)
// Returns: 2, then 6, then 24, then 120

// Example 2: Sum of array
public static int sumArray(int[] arr, int index) {
  // Base case: reached end of array
  if (index == arr.length) return 0;

  // Recursive case: current + sum of rest
  return arr[index] + sumArray(arr, index + 1);
}

// Example 3: Print countdown
public static void countdown(int n) {
  if (n == 0) return;  // Base case
  System.out.println(n);
  countdown(n - 1);  // Recursive case
}`} />
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className="mb-12">
        <h2 className="text-2xl font-bold text-[#0B1F3A] mb-4">Fibonacci: Naive vs Optimized</h2>
        <CodeBlock code={`// Naive recursion: SLOW O(2^n)
public static int fib(int n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}
// fib(5): calls fib(4) + fib(3), but fib(3) computed twice!
// Many redundant calculations

// Optimized with memoization: O(n)
public static int fibMemo(int n, int[] memo) {
  if (n <= 1) return n;
  if (memo[n] != -1) return memo[n];  // Already computed

  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  return memo[n];
}

// Usage:
int[] memo = new int[6];
for (int i = 0; i < 6; i++) memo[i] = -1;
int result = fibMemo(5, memo);  // Returns 5 quickly`} />
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className="mb-12">
        <h2 className="text-2xl font-bold text-[#0B1F3A] mb-4">Example: Power Function (Fast Exponentiation)</h2>
        <CodeBlock code={`// Naive: O(n)
public static long powerSlow(int x, int n) {
  if (n == 0) return 1;
  return x * powerSlow(x, n - 1);
}

// Fast: O(log n) using divide-and-conquer
public static long powerFast(int x, int n) {
  if (n == 0) return 1;

  long half = powerFast(x, n / 2);

  if (n % 2 == 0) {
    return half * half;         // x^n = (x^(n/2))^2
  } else {
    return x * half * half;     // x^n = x * (x^(n/2))^2
  }
}

// For x=2, n=8:
// Naive: 2*2*2*2*2*2*2*2 = 8 multiplications
// Fast: 2^4 = 16, 16 * 16 = 256 = 3 multiplications`} />
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className="mb-12">
        <h2 className="text-2xl font-bold text-[#0B1F3A] mb-4">Common Mistakes</h2>
        <div className="space-y-4">
          {[
            { title: 'Missing Base Case', code: 'int countdown(int n) {\n  return countdown(n - 1);  // ❌ No base case!\n}\n// Stack overflow!' },
            { title: 'Infinite Recursion', code: 'int mystery(int n) {\n  if (n == 5) return 0;\n  return mystery(n);  // ❌ Never reduces n\n}' },
            { title: 'Not Reducing Problem', code: 'int sum(int[] arr, int i) {\n  return arr[i] + sum(arr, i);  // ❌ Same i forever\n}' },
          ].map((m) => (
            <div key={m.title} className="p-4 rounded-lg border border-amber-200 bg-amber-50">
              <h4 className="font-semibold text-amber-900 mb-2">{m.title}</h4>
              <CodeBlock code={m.code} />
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className="mb-12 p-6 rounded-lg bg-slate-100 border-l-4 border-[#0B1F3A]">
        <h2 className="text-2xl font-bold text-[#0B1F3A] mb-4">Key Takeaways</h2>
        <ul className="space-y-2 list-none">
          <li className="flex gap-3"><span className="text-xl font-bold text-[#0B1F3A]">✓</span><span className="text-slate-700"><strong>Every recursive solution needs:</strong> Base case + recursive case</span></li>
          <li className="flex gap-3"><span className="text-xl font-bold text-[#0B1F3A]">✓</span><span className="text-slate-700"><strong>Call stack:</strong> Each call takes memory. Limited size causes stack overflow</span></li>
          <li className="flex gap-3"><span className="text-xl font-bold text-[#0B1F3A]">✓</span><span className="text-slate-700"><strong>Optimize with memoization:</strong> Cache results to avoid redundant calculations</span></li>
          <li className="flex gap-3"><span className="text-xl font-bold text-[#0B1F3A]">✓</span><span className="text-slate-700"><strong>Use for:</strong> Tree/graph traversal, divide-and-conquer, backtracking</span></li>
        </ul>
      </motion.section>
    </LessonLayout>
  )
}
