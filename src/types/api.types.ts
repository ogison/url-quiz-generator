import { Difficulty, Language, Question, QuizResult } from './quiz.types';

/**
 * APIエラーコード
 */
export type ApiErrorCode =
  | 'INVALID_URL'
  | 'FETCH_FAILED'
  | 'GENERATION_FAILED'
  | 'RATE_LIMIT_EXCEEDED'
  | 'INVALID_QUIZ_ID'
  | 'INVALID_ANSWERS'
  | 'INTERNAL_ERROR';

/**
 * API共通エラーレスポンス
 */
export interface ApiErrorResponse {
  error: string;
  code: ApiErrorCode;
  message: string;
  details?: unknown;
}

/**
 * クイズ生成リクエスト
 */
export interface GenerateQuizRequest {
  url: string;
  questionCount?: number;
  difficulty?: Difficulty;
  language?: Language;
}

/**
 * クイズ生成レスポンス
 */
export interface GenerateQuizResponse {
  quizId: string;
  url: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  language: Language;
  createdAt: string; // ISO 8601
  questions: Question[];
}

/**
 * クイズ採点リクエスト
 */
export interface EvaluateQuizRequest {
  quizId: string;
  answers: number[];
}

/**
 * クイズ採点レスポンス
 */
export interface EvaluateQuizResponse extends QuizResult {
  quizId: string;
}

/**
 * API成功レスポンス（ジェネリック）
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

/**
 * APIレスポンス型（成功 or エラー）
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
