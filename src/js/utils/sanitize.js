/**
 * Input sanitization & formatting utilities
 */

export function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function formatMarkdown(text) {
  if (!text) return '';
  let html = escapeHtml(text);
  // Headings
  html = html.replace(/^### (.*$)/gim, '<h4>$1</h4>');
  html = html.replace(/^## (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^# (.*$)/gim, '<h2>$1</h2>');
  // Bold & Italic
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
  // Lists
  html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/<\/li>\n<li>/gim, '</li><li>');
  html = html.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');
  // Paragraphs
  html = html.replace(/\n\n/gim, '</p><p>');
  return `<p>${html}</p>`;
}

