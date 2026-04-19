import React, { useState } from 'react';
import Editor from '../components/devtools/Editor';
import ToolLayout from '../components/devtools/ToolLayout';
import { formatJson, minifyJson, validateJson } from '../utils/jsonUtils';
import SeoMeta from '../components/seo/SeoMeta';
import SchemaMarkup from '../components/seo/SchemaMarkup';
import { jsonFormatterSeo } from '../seo/jsonFormatterSeo';
import { jsonFormatterFaq } from '../seo/jsonFormatterFaq';
import { jsonFormatterSchema } from '../seo/jsonFormatterSchema';
import FaqSection from '../components/devtools/FaqSection';
import RelatedTools from '../components/devtools/RelatedTools';
import ToolFooter from '../components/devtools/ToolFooter';

export default function JsonFormatterPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleFormat = () => {
    try {
      setOutput(formatJson(input));
      setError('');
    } catch (e) {
      setError(e.message);
      setOutput('');
    }
  };

  const handleMinify = () => {
    try {
      setOutput(minifyJson(input));
      setError('');
    } catch (e) {
      setError(e.message);
      setOutput('');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <div>
      <SeoMeta {...jsonFormatterSeo} />
      <SchemaMarkup schema={jsonFormatterSchema} />
      <h1>JSON Formatter Online</h1>
      <ToolLayout
        left={
          <div>
            <Editor
              value={input}
              language="json"
              onChange={setInput}
              error={error}
              height={300}
            />
            <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
              <button
                onClick={handleFormat}
                style={{
                  background: '#0B1F3A', color: '#fff', fontWeight: 600, border: 'none', borderRadius: 6, padding: '8px 20px', fontSize: 15, boxShadow: '0 1px 4px #e5e7eb', cursor: 'pointer', transition: 'background 0.15s',
                }}
              >
                Format
              </button>
              <button
                onClick={handleMinify}
                style={{
                  background: '#e0e7ef', color: '#0B1F3A', fontWeight: 600, border: 'none', borderRadius: 6, padding: '8px 20px', fontSize: 15, boxShadow: '0 1px 4px #e5e7eb', cursor: 'pointer', transition: 'background 0.15s',
                }}
              >
                Minify
              </button>
              <button
                onClick={handleClear}
                style={{
                  background: '#fef2f2', color: '#b91c1c', fontWeight: 600, border: 'none', borderRadius: 6, padding: '8px 20px', fontSize: 15, boxShadow: '0 1px 4px #e5e7eb', cursor: 'pointer', transition: 'background 0.15s',
                }}
              >
                Clear
              </button>
            </div>
          </div>
        }
        right={
          <div>
            <Editor
              value={output}
              language="json"
              readOnly
              height={300}
            />
          </div>
        }
      />
      <section style={{ maxWidth: 800, margin: '32px auto' }}>
        <h2>What is JSON formatting?</h2>
        <p>JSON formatting is the process of organizing JSON data with proper indentation and structure, making it easier to read, debug, and share. A JSON formatter helps developers quickly pretty-print, minify, and validate JSON data online.</p>
        <h2>Why use this tool?</h2>
        <ul>
          <li>Instantly format and validate JSON</li>
          <li>Minify JSON for compact storage</li>
          <li>Spot errors with clear messages</li>
          <li>All processing is client-side for privacy</li>
        </ul>
        <h2>How to use this tool</h2>
        <ol>
          <li>Paste or type your JSON in the left editor</li>
          <li>Click Format to pretty-print, or Minify to compress</li>
          <li>Copy or download the result as needed</li>
        </ol>
        <h2>Example</h2>
        <pre style={{ background: '#f1f5f9', padding: 12, borderRadius: 6 }}>
{`{
  "name": "Aadhirai Innovations",
  "tools": ["JSON Formatter", "XML Formatter"]
}`}
        </pre>
      </section>
      <FaqSection faqs={jsonFormatterFaq} />
      <RelatedTools current="/tools/json-formatter" />
      <ToolFooter />
    </div>
  );
}
