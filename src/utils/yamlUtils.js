// A deliberately small YAML<->JSON converter covering the common subset used in config
// files: nested maps via indentation, simple lists ("- item"), and scalar values (string/
// number/boolean/null). Not a full YAML 1.2 implementation (no anchors, multi-line
// strings, or flow style) — used by YamlJsonConverterPage.jsx, which discloses the scope.

function parseScalar(raw) {
  const s = raw.trim()
  if (s === '' || s === '~' || s === 'null') return null
  if (s === 'true') return true
  if (s === 'false') return false
  if (/^-?\d+$/.test(s)) return parseInt(s, 10)
  if (/^-?\d+\.\d+$/.test(s)) return parseFloat(s)
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) return s.slice(1, -1)
  return s
}

export function yamlToJson(text) {
  const lines = text.split('\n').filter((l) => l.trim() !== '' && !l.trim().startsWith('#'))
  let pos = 0

  function indentOf(line) { return line.match(/^ */)[0].length }

  function parseBlock(indent) {
    const isList = pos < lines.length && lines[pos].trim().startsWith('- ') && indentOf(lines[pos]) === indent
    if (isList) {
      const arr = []
      while (pos < lines.length && indentOf(lines[pos]) === indent && lines[pos].trim().startsWith('- ')) {
        const content = lines[pos].trim().slice(2)
        pos++
        const colonIdx = content.indexOf(':')
        if (colonIdx !== -1 && !content.trim().startsWith('{')) {
          // inline first key of a map item
          const key = content.slice(0, colonIdx).trim()
          const rest = content.slice(colonIdx + 1).trim()
          const obj = { [key]: rest === '' ? parseBlock(indent + 2) : parseScalar(rest) }
          while (pos < lines.length && indentOf(lines[pos]) === indent + 2) {
            const [k, ...v] = lines[pos].trim().split(':')
            obj[k.trim()] = parseScalar(v.join(':'))
            pos++
          }
          arr.push(obj)
        } else {
          arr.push(parseScalar(content))
        }
      }
      return arr
    }

    const obj = {}
    while (pos < lines.length && indentOf(lines[pos]) === indent) {
      const line = lines[pos]
      const colonIdx = line.indexOf(':')
      if (colonIdx === -1) { pos++; continue }
      const key = line.slice(indent, colonIdx).trim()
      const rest = line.slice(colonIdx + 1).trim()
      pos++
      if (rest === '') {
        const nextIndent = pos < lines.length ? indentOf(lines[pos]) : -1
        obj[key] = nextIndent > indent ? parseBlock(nextIndent) : null
      } else {
        obj[key] = parseScalar(rest)
      }
    }
    return obj
  }

  return parseBlock(0)
}

export function jsonToYaml(value, indent = 0) {
  const pad = '  '.repeat(indent)
  if (Array.isArray(value)) {
    if (value.length === 0) return `${pad}[]\n`
    return value.map((item) => {
      if (item !== null && typeof item === 'object') {
        const inner = jsonToYaml(item, indent + 1).replace(new RegExp(`^${'  '.repeat(indent + 1)}`), `${pad}- `)
        return inner
      }
      return `${pad}- ${stringifyScalar(item)}\n`
    }).join('')
  }
  if (value !== null && typeof value === 'object') {
    return Object.entries(value).map(([k, v]) => {
      if (v !== null && typeof v === 'object') {
        return `${pad}${k}:\n${jsonToYaml(v, indent + 1)}`
      }
      return `${pad}${k}: ${stringifyScalar(v)}\n`
    }).join('')
  }
  return `${pad}${stringifyScalar(value)}\n`
}

function stringifyScalar(v) {
  if (v === null || v === undefined) return 'null'
  if (typeof v === 'string' && /[:#]/.test(v)) return `"${v}"`
  return String(v)
}
