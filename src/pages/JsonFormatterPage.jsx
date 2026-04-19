import React, { useState } from 'react';
import Editor from '../components/devtools/Editor';
import ToolLayout from '../components/devtools/ToolLayout';
import { formatJson, minifyJson, validateJson } from '../utils/jsonUtils';

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
            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
              <button onClick={handleFormat}>Format</button>
              <button onClick={handleMinify}>Minify</button>
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
    </div>
  );
}
