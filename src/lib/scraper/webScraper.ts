import * as cheerio from 'cheerio';
import { cleanPageContent } from '@/utils/textProcessor';

export interface ScrapedContent {
  title: string;
  description: string;
  content: string;
  url: string;
}

const FETCH_TIMEOUT = parseInt(process.env.FETCH_TIMEOUT || '30000');
const MAX_CONTENT_LENGTH = parseInt(
  process.env.MAX_CONTENT_LENGTH || '50000'
);

/**
 * URLからコンテンツを取得
 */
export const scrapeWebPage = async (
  url: string
): Promise<ScrapedContent> => {
  try {
    // タイムアウト付きfetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; QuizBot/1.0)',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // 不要な要素を削除
    $('script, style, nav, footer, iframe').remove();

    // メタデータ取得
    const title =
      $('meta[property="og:title"]').attr('content') ||
      $('title').text() ||
      'Untitled';

    const description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      '';

    // 本文抽出
    const mainContent =
      $('article').text() || $('main').text() || $('body').text();

    const cleanedContent = cleanPageContent(mainContent, MAX_CONTENT_LENGTH);

    return {
      title: title.trim(),
      description: description.trim(),
      content: cleanedContent,
      url,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('リクエストがタイムアウトしました');
      }
      throw new Error(`コンテンツ取得に失敗しました: ${error.message}`);
    }
    throw error;
  }
};
