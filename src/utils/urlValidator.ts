import { z } from 'zod';

/**
 * URLスキーマ定義
 */
export const urlSchema = z.string().url().refine(
  (url) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  },
  { message: 'HTTPまたはHTTPSのURLを入力してください' }
);

/**
 * URLの検証
 */
export const validateUrl = (url: string): { valid: boolean; error?: string } => {
  const result = urlSchema.safeParse(url);

  if (!result.success) {
    return {
      valid: false,
      error: result.error.issues[0]?.message || 'Invalid URL',
    };
  }

  return { valid: true };
};

/**
 * URLの正規化
 */
export const normalizeUrl = (url: string): string => {
  const parsed = new URL(url);
  // 末尾のスラッシュを削除
  parsed.pathname = parsed.pathname.replace(/\/$/, '');
  return parsed.toString();
};
