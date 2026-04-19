import { XMLParser, XMLBuilder } from 'fast-xml-parser';

export function formatXml(input) {
  const parser = new XMLParser();
  const obj = parser.parse(input);
  const builder = new XMLBuilder({ format: true, indentBy: '  ' });
  return builder.build(obj);
}

export function minifyXml(input) {
  const parser = new XMLParser();
  const obj = parser.parse(input);
  const builder = new XMLBuilder({ format: false });
  return builder.build(obj);
}

export function validateXml(input) {
  try {
    const parser = new XMLParser();
    parser.parse(input);
    return { valid: true };
  } catch (e) {
    return { valid: false, error: e.message };
  }
}
