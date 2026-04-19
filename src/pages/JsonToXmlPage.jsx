import React, { useState } from 'react';
import Editor from '../components/devtools/Editor';
import ToolLayout from '../components/devtools/ToolLayout';
import { jsonToXml } from '../utils/conversionUtils';

export default function JsonToXmlPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleConvert = () => {
    try {
      setOutput(jsonToXml(input));
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
      <h1>JSON → XML Converter</h1>
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
              language="xml"
              readOnly
              height={300}
            />
          </div>
        }
      />
    </div>
  );
}
