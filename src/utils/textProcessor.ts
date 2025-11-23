/**
 * HTMLタグを除去
 */
export const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '');
};

/**
 * 連続する空白を単一のスペースに変換
 */
export const normalizeWhitespace = (text: string): string => {
  return text.replace(/\s+/g, ' ').trim();
};

/**
 * テキストを指定文字数で切り詰め
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Webページコンテンツのクリーニング
 */
export const cleanPageContent = (html: string, maxLength = 50000): string => {
  let text = stripHtml(html);
  text = normalizeWhitespace(text);
  text = truncateText(text, maxLength);
  return text;
};
