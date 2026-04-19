import { useEffect } from 'react'
import { motion } from 'framer-motion'
import LessonLayout from '../components/learn/LessonLayout'
import CodeBlock from '../components/learn/CodeBlock'
import { getPrevLesson, getNextLesson } from '../data/javaDsaLessons'

function usePageSchema() {
  useEffect(() => {
    const schema = { '@context': 'https://schema.org', '@type': 'Article', 'headline': 'Binary Search in Java — Complete DSA Guide', 'description': 'Master binary search with O(log n) complexity. Learn iterative and recursive approaches, find boundaries, and solve variants.', 'url': 'https://www.aadhiraiinnovations.com/learn/java-dsa/binary-search', 'author': { '@type': 'Organization', 'name': 'Aadhirai Innovations' } }
    const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [{ '@type': 'Question', 'name': 'Why is binary search O(log n)?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'We eliminate half the remaining elements with each comparison. For n elements, we need log₂(n) comparisons.' } }, { '@type': 'Question', 'name': 'What is the prerequisite for binary search?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'The array MUST be sorted. Binary search doesn\'t work on unsorted arrays.' } }, { '@type': 'Question', 'name': 'What is the off-by-one error in binary search?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Using mid + 1 or mid - 1 incorrectly when updating boundaries. Also, mid = (left + right) / 2 can overflow for large values.' } }] }
    const article = document.createElement('script'); article.type = 'application/ld+json'; article.text = JSON.stringify(schema); document.head.appendChild(article)
    const faqScript = document.createElement('script'); faqScript.type = 'application/ld+json'; faqScript.text = JSON.stringify(faq); document.head.appendChild(faqScript)
    return () => { article.remove(); faqScript.remove() }
  }, [])
}

export default function JavaDsaBinarySearchPage() {
  usePageSchema()
  const prevLesson = getPrevLesson('binary-search')
  const nextLesson = getNextLesson('binary-search')

  return (
    <LessonLayout breadcrumbItems={[{ label: 'Learn', href: '/learn' }, { label: 'Java DSA', href: '/learn/java-dsa' }, { label: 'Binary Search' }]} prev={prevLesson ? { label: `Previous: ${prevLesson.title}`, href: `/learn/java-dsa/${prevLesson.slug}` } : null} next={nextLesson ? { label: `Next: ${nextLesson.title}`, href: `/learn/java-dsa/${nextLesson.slug}`, available: nextLesson.available } : null}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
        <div className="flex items-center gap-2 mb-3"><span className="text-sm font-semibold px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">Lesson 5 · Intermediate</span><span className="text-sm text-slate-500">11 min read</span></div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#0B1F3A] leading-[1.1]">Binary Search in Java</h1>
        <p className="text-xl text-slate-600 mt-4">Find elements in O(log n) time on sorted arrays.</p>
      </motion.div>

      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className="prose prose-slate max-w-none mb-12">
        <h2 className="text-2xl font-bold text-[#0B1F3A] mt-8 mb-4">What is Binary Search?</h2>
        <p className="text-lg text-slate-700 leading-relaxed">Binary search is an efficient algorithm to find an element in a <strong>sorted array</strong>. Like a dictionary lookup — open in the middle, decide left or right, repeat. Time complexity: O(log n).</p>
        <p className="text-lg text-slate-700 leading-relaxed mt-4"><strong>Prerequisite:</strong> Array must be sorted!</p>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className="mb-12">
        <h2 className="text-2xl font-bold text-[#0B1F3A] mb-4">Iterative Binary Search</h2>
        <CodeBlock code={`public static int binarySearch(int[] arr, int target) {
  int left = 0, right = arr.length - 1;

  while (left <= right) {
    int mid = left + (right - left) / 2;  // Avoid overflow

    if (arr[mid] == target) {
      return mid;  // Found!
    } else if (arr[mid] < target) {
      left = mid + 1;  // Search right half
    } else {
      right = mid - 1;  // Search left half
    }
  }

  return -1;  // Not found
}

// Example: arr = [2, 5, 8, 12, 16, 23, 38, 45], target = 23
// Step 1: left=0, right=7, mid=3 (arr[3]=12), 12<23 → left=4
// Step 2: left=4, right=7, mid=5 (arr[5]=23), found! → return 5
// Time: O(log 8) = 3 comparisons`} />
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className="mb-12">
        <h2 className="text-2xl font-bold text-[#0B1F3A] mb-4">Recursive Binary Search</h2>
        <CodeBlock code={`public static int binarySearchRecursive(int[] arr, int target, int left, int right) {
  if (left > right) {
    return -1;  // Not found
  }

  int mid = left + (right - left) / 2;

  if (arr[mid] == target) {
    return mid;  // Found!
  } else if (arr[mid] < target) {
    return binarySearchRecursive(arr, target, mid + 1, right);  // Search right
  } else {
    return binarySearchRecursive(arr, target, left, mid - 1);   // Search left
  }
}

// Usage:
int index = binarySearchRecursive(arr, 23, 0, arr.length - 1);`} />
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className="mb-12">
        <h2 className="text-2xl font-bold text-[#0B1F3A] mb-4">Example: Find First & Last Occurrence</h2>
        <CodeBlock code={`// Find first occurrence of target
public static int findFirst(int[] arr, int target) {
  int left = 0, right = arr.length - 1, result = -1;

  while (left <= right) {
    int mid = left + (right - left) / 2;
    if (arr[mid] == target) {
      result = mid;
      right = mid - 1;  // Continue searching left
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return result;
}

// Find last occurrence of target
public static int findLast(int[] arr, int target) {
  int left = 0, right = arr.length - 1, result = -1;

  while (left <= right) {
    int mid = left + (right - left) / 2;
    if (arr[mid] == target) {
      result = mid;
      left = mid + 1;  // Continue searching right
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return result;
}`} />
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className="mb-12 p-6 rounded-lg bg-slate-100 border-l-4 border-[#0B1F3A]">
        <h2 className="text-2xl font-bold text-[#0B1F3A] mb-4">Key Takeaways</h2>
        <ul className="space-y-2 list-none">
          <li className="flex gap-3"><span className="text-xl font-bold text-[#0B1F3A]">✓</span><span className="text-slate-700"><strong>O(log n):</strong> Much faster than linear search O(n)</span></li>
          <li className="flex gap-3"><span className="text-xl font-bold text-[#0B1F3A]">✓</span><span className="text-slate-700"><strong>Prerequisite:</strong> Array MUST be sorted</span></li>
          <li className="flex gap-3"><span className="text-xl font-bold text-[#0B1F3A]">✓</span><span className="text-slate-700"><strong>Avoid overflow:</strong> Use mid = left + (right - left) / 2</span></li>
          <li className="flex gap-3"><span className="text-xl font-bold text-[#0B1F3A]">✓</span><span className="text-slate-700"><strong>Variants:</strong> Find first/last, search in rotated array, find peak</span></li>
        </ul>
      </motion.section>
    </LessonLayout>
  )
}
