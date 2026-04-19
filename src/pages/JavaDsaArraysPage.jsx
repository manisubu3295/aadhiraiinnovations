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
      'headline': 'Arrays in Java — Complete DSA Guide',
      'description': 'Master arrays in Java with real-world examples, time complexity analysis, common mistakes, and practice problems.',
      'url': 'https://www.aadhiraiinnovations.com/learn/java-dsa/arrays',
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
          'name': 'What is an array in Java?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'An array is a collection of elements of the same type stored in contiguous memory locations. Each element is accessed by an index (position), starting from 0.',
          },
        },
        {
          '@type': 'Question',
          'name': 'What is the time complexity of accessing an array element?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Accessing an array element by index is O(1) constant time, because the memory address can be calculated directly using the formula: address = base + (index * element_size).',
          },
        },
        {
          '@type': 'Question',
          'name': 'How do I declare an array in Java?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'You can declare an array using: int[] arr = new int[10]; or int[] arr = {1, 2, 3, 4, 5}; The first creates an array with default values, the second initializes it.',
          },
        },
        {
          '@type': 'Question',
          'name': 'When should I use arrays vs ArrayLists?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Use arrays for fixed-size collections when you know the size upfront. Use ArrayList for dynamic sizing, when you need to frequently add/remove elements.',
          },
        },
        {
          '@type': 'Question',
          'name': 'What are common array operations and their complexities?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Access: O(1), Search (linear): O(n), Insert (middle): O(n), Delete (middle): O(n), Sort: O(n log n). Insertion and deletion are expensive because elements must shift.',
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

export default function JavaDsaArraysPage() {
  usePageSchema()

  const prevLesson = getPrevLesson('arrays')
  const nextLesson = getNextLesson('arrays')

  return (
    <LessonLayout
      breadcrumbItems={[
        { label: 'Learn', href: '/learn' },
        { label: 'Java DSA', href: '/learn/java-dsa' },
        { label: 'Arrays' },
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
          <span className="text-sm font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700">Lesson 1 · Basics</span>
          <span className="text-sm text-slate-500">8 min read</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#0B1F3A] leading-[1.1]">
          Arrays in Java
        </h1>
        <p className="text-xl text-slate-600 mt-4">
          Master the foundational data structure used in every software system.
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
        <h2 className="text-2xl font-bold text-[#0B1F3A] mt-8 mb-4">What is an Array?</h2>
        <p className="text-lg text-slate-700 leading-relaxed mb-4">
          An <strong>array</strong> is a collection of elements of the same type stored in contiguous memory locations. Think of it as a row of numbered seats in a cinema—each seat holds one person, and you can identify any person by their seat number (index).
        </p>
        <p className="text-lg text-slate-700 leading-relaxed">
          In Java, arrays are <strong>zero-indexed</strong>, meaning the first element is at index 0, the second at index 1, and so on. This makes arrays incredibly fast for accessing elements—you can jump directly to any element without searching through the others.
        </p>
      </motion.section>

      {/* Declaration & Initialization */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-[#0B1F3A] mb-4">Declaration & Initialization</h2>
        <CodeBlock
          code={`// Declare and create array (with default values)
int[] numbers = new int[5];        // Array of size 5, default values: 0, 0, 0, 0, 0

// Declare and initialize with values
int[] numbers = {10, 20, 30, 40, 50};

// Other data types
String[] names = {"Alice", "Bob", "Charlie"};
double[] prices = {9.99, 19.99, 29.99};

// Accessing elements (0-indexed)
int first = numbers[0];      // 10
int last = numbers[4];       // 50`}
          title="Arrays in Java"
        />
      </motion.section>

      {/* Time & Space Complexity */}
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
                <th className="text-left px-4 py-3 font-semibold text-[#0B1F3A]">Time Complexity</th>
                <th className="text-left px-4 py-3 font-semibold text-[#0B1F3A]">Why?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="px-4 py-3 font-medium text-slate-900">Access by index</td>
                <td className="px-4 py-3 font-mono text-[#0B1F3A]">O(1)</td>
                <td className="px-4 py-3 text-slate-600">Direct memory lookup via formula</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-900">Linear search</td>
                <td className="px-4 py-3 font-mono text-[#0B1F3A]">O(n)</td>
                <td className="px-4 py-3 text-slate-600">Must check each element</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-900">Insert at end</td>
                <td className="px-4 py-3 font-mono text-[#0B1F3A]">O(1)</td>
                <td className="px-4 py-3 text-slate-600">Just add to next position</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-900">Insert at middle</td>
                <td className="px-4 py-3 font-mono text-[#0B1F3A]">O(n)</td>
                <td className="px-4 py-3 text-slate-600">Must shift all elements right</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-900">Delete element</td>
                <td className="px-4 py-3 font-mono text-[#0B1F3A]">O(n)</td>
                <td className="px-4 py-3 text-slate-600">Must shift remaining elements left</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-900">Space</td>
                <td className="px-4 py-3 font-mono text-[#0B1F3A]">O(n)</td>
                <td className="px-4 py-3 text-slate-600">Stores n elements in memory</td>
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

        <h3 className="text-xl font-semibold text-[#0B1F3A] mt-6 mb-3">Traverse (Loop through all elements)</h3>
        <CodeBlock
          code={`// For loop
for (int i = 0; i < arr.length; i++) {
  System.out.println(arr[i]);
}

// Enhanced for loop
for (int num : arr) {
  System.out.println(num);
}`}
        />

        <h3 className="text-xl font-semibold text-[#0B1F3A] mt-6 mb-3">Linear Search (Find an element)</h3>
        <CodeBlock
          code={`public static int linearSearch(int[] arr, int target) {
  for (int i = 0; i < arr.length; i++) {
    if (arr[i] == target) {
      return i;  // Found at index i
    }
  }
  return -1;  // Not found
}`}
        />

        <h3 className="text-xl font-semibold text-[#0B1F3A] mt-6 mb-3">Sum of all elements</h3>
        <CodeBlock
          code={`public static int sumArray(int[] arr) {
  int sum = 0;
  for (int num : arr) {
    sum += num;
  }
  return sum;
}`}
        />
      </motion.section>

      {/* Example Problem */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-[#0B1F3A] mb-4">Classic Problem: Two Sum</h2>
        <p className="text-lg text-slate-700 mb-4">
          <strong>Problem:</strong> Given an array of integers and a target sum, find two numbers that add up to the target. Return their indices.
        </p>
        <p className="text-sm text-slate-600 mb-6">
          <strong>Example:</strong> arr = [2, 7, 11, 15], target = 9 → Output: [0, 1] (because 2 + 7 = 9)
        </p>
        <CodeBlock
          code={`public static int[] twoSum(int[] nums, int target) {
  // Brute force: O(n²) time
  for (int i = 0; i < nums.length; i++) {
    for (int j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] == target) {
        return new int[] {i, j};
      }
    }
  }
  return new int[] {};  // Not found
}

// Optimized: O(n) time using HashMap
public static int[] twoSumOptimized(int[] nums, int target) {
  Map<Integer, Integer> map = new HashMap<>();
  for (int i = 0; i < nums.length; i++) {
    int complement = target - nums[i];
    if (map.containsKey(complement)) {
      return new int[] {map.get(complement), i};
    }
    map.put(nums[i], i);
  }
  return new int[] {};
}`}
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
              title: 'Off-by-One Error',
              description: 'Forgetting that arrays are 0-indexed. The last element is at length - 1, not length.',
              code: 'int last = arr[arr.length];  // ❌ ArrayIndexOutOfBoundsException\nint last = arr[arr.length - 1];  // ✓ Correct',
            },
            {
              title: 'Not Checking Array Bounds',
              description: 'Accessing indices that don\'t exist causes a runtime error.',
              code: 'for (int i = 0; i <= arr.length; i++) {  // ❌ Off by one\nfor (int i = 0; i < arr.length; i++) {  // ✓ Correct',
            },
            {
              title: 'Forgetting Array Length in Loops',
              description: 'Using a hardcoded number instead of arr.length makes code brittle.',
              code: 'for (int i = 0; i < 10; i++) {  // ❌ Breaks if array size changes\nfor (int i = 0; i < arr.length; i++) {  // ✓ Flexible',
            },
            {
              title: 'Modifying Array While Iterating',
              description: 'Changing array size during iteration can cause skipped elements or errors.',
              code: 'for (int i = 0; i < arr.length; i++) {\n  arr[i] = arr[i] * 2;  // ✓ Modifying values is OK\n  // arr = Arrays.copyOf(arr, arr.length + 1);  // ❌ Modifying size is not',
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
            <span className="text-slate-700"><strong>Fast access:</strong> O(1) to retrieve any element by index</span>
          </li>
          <li className="flex gap-3">
            <span className="text-xl font-bold text-[#0B1F3A]">✓</span>
            <span className="text-slate-700"><strong>Fixed size:</strong> Arrays have a set length; use ArrayList for dynamic sizing</span>
          </li>
          <li className="flex gap-3">
            <span className="text-xl font-bold text-[#0B1F3A]">✓</span>
            <span className="text-slate-700"><strong>Slow insertion/deletion:</strong> O(n) in the middle because elements must shift</span>
          </li>
          <li className="flex gap-3">
            <span className="text-xl font-bold text-[#0B1F3A]">✓</span>
            <span className="text-slate-700"><strong>Real-world use:</strong> Foundation for sorting, searching, dynamic programming, and more</span>
          </li>
        </ul>
      </motion.section>
    </LessonLayout>
  )
}
