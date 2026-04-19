import { XMLBuilder, XMLParser } from 'fast-xml-parser';

export function jsonToXml(jsonStr) {
  let obj;
  try {
    obj = JSON.parse(jsonStr);
  } catch (e) {
    throw new Error('Invalid JSON: ' + e.message);
  }
  const builder = new XMLBuilder({ format: true, indentBy: '  ' });
  return builder.build(obj);
}

export function xmlToJson(xmlStr) {
  try {
    const parser = new XMLParser();
    const obj = parser.parse(xmlStr);
    return JSON.stringify(obj, null, 2);
  } catch (e) {
    throw new Error('Invalid XML: ' + e.message);
  }
}
