import React, { useState } from 'react';
import Editor from '../components/devtools/Editor';
import ToolLayout from '../components/devtools/ToolLayout';
import { formatText, minifyText, toUpperCase, toLowerCase, capitalizeWords, removeLineBreaks, countWordsAndChars } from '../utils/textUtils';

export default function TextFormatterPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [stats, setStats] = useState({ words: 0, chars: 0 });

  const handleFormat = () => {
    setOutput(formatText(input));
    setStats(countWordsAndChars(input));
  };
  const handleMinify = () => {
    setOutput(minifyText(input));
    setStats(countWordsAndChars(input));
  };
  const handleUpper = () => setOutput(toUpperCase(input));
  const handleLower = () => setOutput(toLowerCase(input));
  const handleCapitalize = () => setOutput(capitalizeWords(input));
  const handleRemoveBreaks = () => setOutput(removeLineBreaks(input));
  const handleClear = () => {
    setInput('');
    setOutput('');
    setStats({ words: 0, chars: 0 });
  };

  return (
    <div>
      <h1>Text Formatter Online</h1>
      <ToolLayout
        left={
          <div>
            <Editor
              value={input}
              language="plaintext"
              onChange={setInput}
              height={300}
            />
            <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button onClick={handleFormat}>Format</button>
              <button onClick={handleMinify}>Minify</button>
              <button onClick={handleUpper}>UPPERCASE</button>
              <button onClick={handleLower}>lowercase</button>
              <button onClick={handleCapitalize}>Capitalize</button>
              <button onClick={handleRemoveBreaks}>Remove Line Breaks</button>
              <button onClick={handleClear}>Clear</button>
            </div>
          </div>
        }
        right={
          <div>
            <Editor
              value={output}
              language="plaintext"
              readOnly
              height={300}
            />
            <div style={{ marginTop: 12, color: '#64748b', fontSize: 14 }}>
              Words: {stats.words} | Characters: {stats.chars}
            </div>
          </div>
        }
      />
    </div>
  );
}
