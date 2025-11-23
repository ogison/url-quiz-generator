import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import {
  GenerateQuizRequest,
  GenerateQuizResponse,
  ApiErrorResponse,
} from '@/types/api.types';
import { validateUrl } from '@/utils/urlValidator';
import { scrapeWebPage } from '@/lib/scraper/webScraper';
import { generateQuizWithGemini } from '@/lib/gemini/generateQuiz';

const DEFAULT_QUESTION_COUNT = 5;
const MIN_QUESTIONS = 3;
const MAX_QUESTIONS = 10;

export async function POST(request: NextRequest) {
  try {
    const body: GenerateQuizRequest = await request.json();

    // バリデーション
    const { url, questionCount, difficulty, language } = body;

    if (!url) {
      return NextResponse.json<ApiErrorResponse>(
        {
          error: 'Validation Error',
          code: 'INVALID_URL',
          message: 'URLを入力してください',
        },
        { status: 400 }
      );
    }

    const urlValidation = validateUrl(url);
    if (!urlValidation.valid) {
      return NextResponse.json<ApiErrorResponse>(
        {
          error: 'Validation Error',
          code: 'INVALID_URL',
          message: urlValidation.error || 'Invalid URL',
        },
        { status: 400 }
      );
    }

    const finalQuestionCount = Math.min(
      Math.max(questionCount || DEFAULT_QUESTION_COUNT, MIN_QUESTIONS),
      MAX_QUESTIONS
    );

    // Webページ取得
    let scrapedContent;
    try {
      scrapedContent = await scrapeWebPage(url);
    } catch (error) {
      return NextResponse.json<ApiErrorResponse>(
        {
          error: 'Fetch Error',
          code: 'FETCH_FAILED',
          message:
            error instanceof Error
              ? error.message
              : 'Webページの取得に失敗しました',
        },
        { status: 500 }
      );
    }

    // クイズ生成
    let questions;
    try {
      questions = await generateQuizWithGemini({
        title: scrapedContent.title,
        url: scrapedContent.url,
        content: scrapedContent.content,
        questionCount: finalQuestionCount,
        difficulty: difficulty || 'medium',
        language: language || 'ja',
      });
    } catch (error) {
      return NextResponse.json<ApiErrorResponse>(
        {
          error: 'Generation Error',
          code: 'GENERATION_FAILED',
          message:
            error instanceof Error
              ? error.message
              : 'クイズの生成に失敗しました',
        },
        { status: 500 }
      );
    }

    // レスポンス作成
    const response: GenerateQuizResponse = {
      quizId: uuidv4(),
      url: scrapedContent.url,
      title: scrapedContent.title,
      description: scrapedContent.description,
      difficulty: difficulty || 'medium',
      language: language || 'ja',
      createdAt: new Date().toISOString(),
      questions,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json<ApiErrorResponse>(
      {
        error: 'Internal Server Error',
        code: 'INTERNAL_ERROR',
        message: 'サーバーエラーが発生しました',
      },
      { status: 500 }
    );
  }
}
