import React, { useState } from 'react';
import Editor from '../components/devtools/Editor';
import ToolLayout from '../components/devtools/ToolLayout';
import { formatXml, minifyXml, validateXml } from '../utils/xmlUtils';
import RelatedTools from '../components/devtools/RelatedTools';
import ToolFooter from '../components/devtools/ToolFooter';

export default function XmlFormatterPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleFormat = () => {
    try {
      setOutput(formatXml(input));
      setError('');
    } catch (e) {
      setError(e.message);
      setOutput('');
    }
  };

  const handleMinify = () => {
    try {
      setOutput(minifyXml(input));
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
      <h1>XML Formatter Online</h1>
      <ToolLayout
        left={
          <div>
            <Editor
              value={input}
              language="xml"
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
              language="xml"
              readOnly
              height={300}
            />
          </div>
        }
      />
      <RelatedTools current="/tools/xml-formatter" />
      <ToolFooter />
    </div>
  );
}
