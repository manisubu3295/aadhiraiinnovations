export function formatJson(input) {
  return JSON.stringify(JSON.parse(input), null, 2);
}

export function minifyJson(input) {
  return JSON.stringify(JSON.parse(input));
}

export function validateJson(input) {
  try {
    JSON.parse(input);
    return { valid: true };
  } catch (e) {
    return { valid: false, error: e.message };
  }
}
