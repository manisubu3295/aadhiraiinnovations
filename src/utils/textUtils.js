export function formatText(input) {
  return input.replace(/ +/g, ' ').replace(/\n{2,}/g, '\n');
}
export function minifyText(input) {
  return input.replace(/\s+/g, ' ').trim();
}
export function toUpperCase(input) {
  return input.toUpperCase();
}
export function toLowerCase(input) {
  return input.toLowerCase();
}
export function capitalizeWords(input) {
  return input.replace(/\b\w/g, c => c.toUpperCase());
}
export function removeLineBreaks(input) {
  return input.replace(/\n/g, ' ');
}
export function countWordsAndChars(input) {
  const words = input.trim().split(/\s+/).filter(Boolean).length;
  const chars = input.length;
  return { words, chars };
}
