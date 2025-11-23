/**
 * クイズの難易度
 */
export type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * 言語コード
 */
export type Language = 'ja' | 'en';

/**
 * 理解度レベル
 */
export type ComprehensionLevel = 'beginner' | 'intermediate' | 'advanced';

/**
 * 問題の選択肢
 */
export interface QuestionOption {
  index: number;
  text: string;
}

/**
 * クイズの問題
 */
export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-3
  explanation: string;
  category?: string;
}

/**
 * クイズデータ
 */
export interface Quiz {
  id: string;
  url: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  language: Language;
  questions: Question[];
  createdAt: Date;
}

/**
 * 問題の回答結果
 */
export interface QuestionResult {
  questionId: string;
  isCorrect: boolean;
  userAnswer: number;
  correctAnswer: number;
  timeTaken?: number; // ミリ秒
}

/**
 * クイズの回答結果
 */
export interface QuizResult {
  quizId: string;
  answers: number[];
  score: number; // 0-100
  correctCount: number;
  totalCount: number;
  results: QuestionResult[];
  comprehensionLevel: ComprehensionLevel;
  completedAt: Date;
}

/**
 * クイズ履歴アイテム
 */
export interface QuizHistoryItem {
  quizId: string;
  url: string;
  title: string;
  score: number;
  completedAt: Date;
}
