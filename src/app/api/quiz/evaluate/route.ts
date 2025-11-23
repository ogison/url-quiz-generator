import { NextRequest, NextResponse } from 'next/server';
import {
  EvaluateQuizRequest,
  EvaluateQuizResponse,
  ApiErrorResponse,
} from '@/types/api.types';
import {
  calculateScore,
  determineComprehensionLevel,
} from '@/utils/scoreCalculator';

export async function POST(request: NextRequest) {
  try {
    const body: EvaluateQuizRequest = await request.json();

    const { quizId, answers } = body;

    // バリデーション
    if (!quizId) {
      return NextResponse.json<ApiErrorResponse>(
        {
          error: 'Validation Error',
          code: 'INVALID_QUIZ_ID',
          message: 'クイズIDが不正です',
        },
        { status: 400 }
      );
    }

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json<ApiErrorResponse>(
        {
          error: 'Validation Error',
          code: 'INVALID_ANSWERS',
          message: '回答データが不正です',
        },
        { status: 400 }
      );
    }

    // 注: 実際の実装では、保存されたクイズデータから正解を取得
    // ここでは簡易実装のため、クライアント側で正解チェックを行う想定

    const response: EvaluateQuizResponse = {
      quizId,
      answers,
      score: 0,
      correctCount: 0,
      totalCount: answers.length,
      results: [],
      comprehensionLevel: 'beginner',
      completedAt: new Date(),
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
