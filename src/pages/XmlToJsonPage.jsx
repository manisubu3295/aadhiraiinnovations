import React, { useState } from 'react';
import Editor from '../components/devtools/Editor';
import ToolLayout from '../components/devtools/ToolLayout';
import { xmlToJson } from '../utils/conversionUtils';
import RelatedTools from '../components/devtools/RelatedTools';
import ToolFooter from '../components/devtools/ToolFooter';

export default function XmlToJsonPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleConvert = () => {
    try {
      setOutput(xmlToJson(input));
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
      <h1>XML → JSON Converter</h1>
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
            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
              <button onClick={handleConvert}>Convert</button>
              <button onClick={handleClear}>Clear</button>
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
      <RelatedTools current="/tools/xml-to-json" />
      <ToolFooter />
    </div>
  );
}
