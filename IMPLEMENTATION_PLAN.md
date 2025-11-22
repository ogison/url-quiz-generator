# URL Quiz Generator 実装計画書

## 📋 実装概要

本ドキュメントは、URL Quiz Generatorアプリケーションの実装を段階的に進めるための詳細な計画書です。

**関連ドキュメント**: [SPECIFICATION.md](./SPECIFICATION.md)

---

## 🎯 実装の全体方針

### 開発アプローチ
- **ボトムアップ開発**: 基盤から順に構築
- **段階的リリース**: MVPから機能追加
- **テスト駆動**: 重要機能はテストを先行実装
- **レビュー重視**: 各フェーズ完了時にコードレビュー

### 技術スタック確認
- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- Gemini API
- Cheerio (Webスクレイピング)

---

## 📅 実装スケジュール

| Phase | 期間 | 内容 | ゴール |
|-------|------|------|--------|
| Phase 1 | Week 1 | 基盤構築 | プロジェクト環境の完成 |
| Phase 2 | Week 2-3 | バックエンド実装 | API動作確認完了 |
| Phase 3 | Week 4-5 | フロントエンド実装 | 基本機能の動作完了 |
| Phase 4 | Week 6 | 最適化・テスト | 品質向上 |
| Phase 5 | Week 7 | リリース準備 | デプロイ完了 |

---

## 🏗️ Phase 1: 基盤構築（Week 1）

### 目標
- プロジェクト環境のセットアップ
- 型定義の完成
- 基本UIコンポーネントの実装

### Task 1.1: プロジェクト初期設定

#### 1.1.1 依存パッケージのインストール

```bash
# Gemini API SDK
npm install @google/generative-ai

# Webスクレイピング
npm install cheerio
npm install @types/cheerio --save-dev

# ユーティリティ
npm install zod  # バリデーション
npm install clsx # クラス名結合
npm install date-fns # 日付処理
```

**チェックリスト**:
- [ ] パッケージインストール完了
- [ ] package.json更新確認
- [ ] 型定義ファイル確認

#### 1.1.2 環境変数設定

**作成ファイル**: `.env.local`

```env
# Gemini API
GEMINI_API_KEY=your_api_key_here

# アプリケーション設定
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_MAX_QUESTIONS=10
NEXT_PUBLIC_DEFAULT_QUESTIONS=5
NEXT_PUBLIC_MIN_QUESTIONS=3

# レート制限
RATE_LIMIT_MAX_REQUESTS=10
RATE_LIMIT_WINDOW_MS=60000

# スクレイピング設定
FETCH_TIMEOUT=30000
MAX_CONTENT_LENGTH=50000
```

**チェックリスト**:
- [ ] `.env.local`作成
- [ ] `.env.example`更新
- [ ] Gemini API キー取得
- [ ] 環境変数の動作確認

#### 1.1.3 ディレクトリ構造の構築

```bash
# ディレクトリ作成コマンド
mkdir -p src/components/ui
mkdir -p src/components/quiz
mkdir -p src/features/quiz/components
mkdir -p src/features/quiz/hooks
mkdir -p src/features/quiz/types
mkdir -p src/lib/gemini
mkdir -p src/lib/scraper
mkdir -p src/lib/storage
mkdir -p src/utils
mkdir -p src/types
mkdir -p src/app/api/quiz/generate
mkdir -p src/app/api/quiz/evaluate
mkdir -p src/app/quiz/[id]
mkdir -p src/app/result/[id]
```

**チェックリスト**:
- [ ] 全ディレクトリ作成完了
- [ ] 構造確認

### Task 1.2: 型定義の作成

#### 1.2.1 クイズ関連の型定義

**作成ファイル**: `src/types/quiz.types.ts`

```typescript
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
```

**チェックリスト**:
- [ ] ファイル作成完了
- [ ] 型定義の網羅性確認
- [ ] JSDocコメント追加

#### 1.2.2 API関連の型定義

**作成ファイル**: `src/types/api.types.ts`

```typescript
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
```

**チェックリスト**:
- [ ] ファイル作成完了
- [ ] リクエスト/レスポンス型の定義
- [ ] エラーハンドリング型の定義

### Task 1.3: 基本UIコンポーネントの実装

#### 1.3.1 Buttonコンポーネント

**作成ファイル**: `src/components/ui/Button.tsx`

```typescript
import { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: ReactNode;
}

export const Button: FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className,
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    ghost: 'text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};
```

**チェックリスト**:
- [ ] コンポーネント実装完了
- [ ] バリアント動作確認
- [ ] ローディング状態確認

#### 1.3.2 Inputコンポーネント

**作成ファイル**: `src/components/ui/Input.tsx`

```typescript
import { InputHTMLAttributes, FC } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: FC<InputProps> = ({
  label,
  error,
  helperText,
  className,
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={clsx(
          'w-full px-4 py-2 border rounded-lg transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};
```

**チェックリスト**:
- [ ] コンポーネント実装完了
- [ ] エラー状態の表示確認
- [ ] アクセシビリティ確認（label連携）

#### 1.3.3 その他の基本コンポーネント

**作成ファイル**:
- `src/components/ui/Card.tsx`
- `src/components/ui/ProgressBar.tsx`
- `src/components/ui/LoadingSpinner.tsx`

**チェックリスト**:
- [ ] Card実装完了
- [ ] ProgressBar実装完了
- [ ] LoadingSpinner実装完了
- [ ] 各コンポーネントの動作確認

### Phase 1 完了チェック

- [ ] すべての依存パッケージインストール完了
- [ ] 環境変数設定完了
- [ ] ディレクトリ構造構築完了
- [ ] 型定義ファイル作成完了
- [ ] 基本UIコンポーネント実装完了
- [ ] コードレビュー実施
- [ ] Git コミット・プッシュ

---

## 🔧 Phase 2: バックエンド実装（Week 2-3）

### 目標
- Gemini API統合
- Webスクレイピング機能実装
- API Routes実装

### Task 2.1: ユーティリティ関数の実装

#### 2.1.1 URL検証ユーティリティ

**作成ファイル**: `src/utils/urlValidator.ts`

```typescript
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
      error: result.error.errors[0]?.message || 'Invalid URL',
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
```

**チェックリスト**:
- [ ] URL検証関数実装
- [ ] テストケース作成
- [ ] エラーメッセージの日本語化

#### 2.1.2 テキスト処理ユーティリティ

**作成ファイル**: `src/utils/textProcessor.ts`

```typescript
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
```

**チェックリスト**:
- [ ] テキスト処理関数実装
- [ ] 動作確認

#### 2.1.3 スコア計算ユーティリティ

**作成ファイル**: `src/utils/scoreCalculator.ts`

```typescript
import { ComprehensionLevel } from '@/types/quiz.types';

/**
 * スコア計算（0-100点）
 */
export const calculateScore = (
  correctCount: number,
  totalCount: number
): number => {
  if (totalCount === 0) return 0;
  return Math.round((correctCount / totalCount) * 100);
};

/**
 * 理解度レベルの判定
 */
export const determineComprehensionLevel = (
  score: number
): ComprehensionLevel => {
  if (score >= 80) return 'advanced';
  if (score >= 60) return 'intermediate';
  return 'beginner';
};

/**
 * パーセンテージの計算
 */
export const calculatePercentage = (
  value: number,
  total: number
): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};
```

**チェックリスト**:
- [ ] スコア計算関数実装
- [ ] エッジケース処理確認

### Task 2.2: Webスクレイピング機能

#### 2.2.1 Webスクレイパーの実装

**作成ファイル**: `src/lib/scraper/webScraper.ts`

```typescript
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
```

**チェックリスト**:
- [ ] スクレイパー実装完了
- [ ] タイムアウト処理確認
- [ ] エラーハンドリング確認
- [ ] 実際のWebページで動作確認

### Task 2.3: Gemini API統合

#### 2.3.1 Gemini APIクライアント

**作成ファイル**: `src/lib/gemini/client.ts`

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not set');
}

export const genAI = new GoogleGenerativeAI(apiKey);

export const getGenerativeModel = () => {
  return genAI.getGenerativeModel({ model: 'gemini-pro' });
};
```

**チェックリスト**:
- [ ] クライアント実装
- [ ] API キー確認
- [ ] 接続テスト

#### 2.3.2 プロンプトテンプレート

**作成ファイル**: `src/lib/gemini/prompts.ts`

```typescript
import { Difficulty, Language } from '@/types/quiz.types';

interface QuizPromptParams {
  title: string;
  url: string;
  content: string;
  questionCount: number;
  difficulty: Difficulty;
  language: Language;
}

const difficultyDescriptions: Record<Difficulty, string> = {
  easy: '基本的な内容で、初心者でも理解しやすい問題',
  medium: '中級レベルで、内容の理解を深めるための問題',
  hard: '上級レベルで、深い理解と応用力を問う問題',
};

export const generateQuizPrompt = (params: QuizPromptParams): string => {
  const { title, url, content, questionCount, difficulty, language } = params;

  return `
あなたは教育コンテンツの専門家です。以下のWebページの内容を解析し、読者の理解度を測るクイズを生成してください。

【Webページ情報】
タイトル: ${title}
URL: ${url}
本文:
${content}

【クイズ生成要件】
- 問題数: ${questionCount}問
- 難易度: ${difficulty} (${difficultyDescriptions[difficulty]})
- 言語: ${language === 'ja' ? '日本語' : '英語'}
- 形式: 4択問題（正解は必ず1つのみ）

【問題作成のガイドライン】
1. ページの主要なトピックや重要な概念に焦点を当てる
2. 事実、数値、定義、原因と結果などを問題化する
3. 選択肢は明確で、紛らわしくないようにする
4. すべての選択肢が文法的に正しく、長さも同程度にする
5. 正解以外の選択肢も、もっともらしい内容にする
6. 各問題に簡潔で分かりやすい解説を付ける

【出力形式】
以下のJSON形式で出力してください。他の説明文は一切含めず、JSONのみを出力してください。

{
  "questions": [
    {
      "question": "問題文をここに記述",
      "options": [
        "選択肢1",
        "選択肢2",
        "選択肢3",
        "選択肢4"
      ],
      "correctAnswer": 0,
      "explanation": "正解の理由や補足説明をここに記述"
    }
  ]
}

※correctAnswerは0から3の数値で、optionsの配列インデックスを指定してください。
`.trim();
};
```

**チェックリスト**:
- [ ] プロンプト実装
- [ ] 各難易度のテスト
- [ ] 出力品質確認

#### 2.3.3 クイズ生成サービス

**作成ファイル**: `src/lib/gemini/generateQuiz.ts`

```typescript
import { getGenerativeModel } from './client';
import { generateQuizPrompt } from './prompts';
import { Question, Difficulty, Language } from '@/types/quiz.types';
import { v4 as uuidv4 } from 'uuid';

interface GenerateQuizParams {
  title: string;
  url: string;
  content: string;
  questionCount: number;
  difficulty: Difficulty;
  language: Language;
}

interface GeminiQuizResponse {
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>;
}

export const generateQuizWithGemini = async (
  params: GenerateQuizParams
): Promise<Question[]> => {
  try {
    const model = getGenerativeModel();
    const prompt = generateQuizPrompt(params);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // JSONの抽出（Geminiが余計なテキストを含める場合があるため）
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini API');
    }

    const parsed: GeminiQuizResponse = JSON.parse(jsonMatch[0]);

    // バリデーション
    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error('Invalid questions format');
    }

    // Question型に変換
    const questions: Question[] = parsed.questions.map((q) => ({
      id: uuidv4(),
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    }));

    // バリデーション
    questions.forEach((q, index) => {
      if (q.options.length !== 4) {
        throw new Error(`Question ${index + 1}: Must have exactly 4 options`);
      }
      if (q.correctAnswer < 0 || q.correctAnswer > 3) {
        throw new Error(
          `Question ${index + 1}: correctAnswer must be between 0 and 3`
        );
      }
    });

    return questions;
  } catch (error) {
    console.error('Quiz generation error:', error);
    throw new Error(
      `クイズの生成に失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};
```

**チェックリスト**:
- [ ] クイズ生成関数実装
- [ ] JSONパース処理確認
- [ ] バリデーション確認
- [ ] エラーハンドリング確認

### Task 2.4: API Routes実装

#### 2.4.1 クイズ生成API

**作成ファイル**: `src/app/api/quiz/generate/route.ts`

```typescript
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
```

**チェックリスト**:
- [ ] API実装完了
- [ ] バリデーション確認
- [ ] エラーハンドリング確認
- [ ] Postmanでテスト

#### 2.4.2 採点API

**作成ファイル**: `src/app/api/quiz/evaluate/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import {
  EvaluateQuizRequest,
  EvaluateQuizResponse,
  ApiErrorResponse,
} from '@/types/api.types';
import { QuestionResult } from '@/types/quiz.types';
import {
  calculateScore,
  determineComprehensionLevel,
} from '@/utils/scoreCalculator';

// 注: 本来はデータベースからクイズデータを取得すべき
// この実装では、クライアント側でクイズデータを保持する前提

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
```

**チェックリスト**:
- [ ] API実装完了
- [ ] バリデーション確認
- [ ] Postmanでテスト

### Phase 2 完了チェック

- [ ] ユーティリティ関数実装完了
- [ ] Webスクレイピング機能動作確認
- [ ] Gemini API統合完了
- [ ] クイズ生成API動作確認
- [ ] 採点API動作確認
- [ ] APIドキュメント作成
- [ ] コードレビュー実施
- [ ] Git コミット・プッシュ

---

## 🎨 Phase 3: フロントエンド実装（Week 4-5）

### 目標
- すべての画面の実装
- ユーザーフローの完成
- 状態管理の実装

### Task 3.1: カスタムフックの実装

#### 3.1.1 クイズ生成フック

**作成ファイル**: `src/features/quiz/hooks/useQuizGeneration.ts`

```typescript
import { useState } from 'react';
import { GenerateQuizRequest, GenerateQuizResponse } from '@/types/api.types';

interface UseQuizGenerationReturn {
  generateQuiz: (request: GenerateQuizRequest) => Promise<void>;
  quiz: GenerateQuizResponse | null;
  isLoading: boolean;
  error: string | null;
}

export const useQuizGeneration = (): UseQuizGenerationReturn => {
  const [quiz, setQuiz] = useState<GenerateQuizResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuiz = async (request: GenerateQuizRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'クイズの生成に失敗しました');
      }

      const data: GenerateQuizResponse = await response.json();
      setQuiz(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return { generateQuiz, quiz, isLoading, error };
};
```

**チェックリスト**:
- [ ] フック実装完了
- [ ] ローディング状態管理確認
- [ ] エラーハンドリング確認

#### 3.1.2 その他のフック

**作成ファイル**:
- `src/features/quiz/hooks/useQuizAnswer.ts`
- `src/features/quiz/hooks/useQuizHistory.ts` (オプション)

**チェックリスト**:
- [ ] useQuizAnswer実装完了
- [ ] useQuizHistory実装完了（オプション）

### Task 3.2: クイズ関連コンポーネント

#### 3.2.1 URL入力フォーム

**作成ファイル**: `src/features/quiz/components/UrlInputForm.tsx`

```typescript
import { FC, FormEvent, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Difficulty } from '@/types/quiz.types';

interface UrlInputFormProps {
  onSubmit: (data: {
    url: string;
    difficulty: Difficulty;
    questionCount: number;
  }) => void;
  isLoading?: boolean;
}

export const UrlInputForm: FC<UrlInputFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [url, setUrl] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [questionCount, setQuestionCount] = useState(5);
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url) {
      setError('URLを入力してください');
      return;
    }

    try {
      new URL(url);
    } catch {
      setError('有効なURLを入力してください');
      return;
    }

    onSubmit({ url, difficulty, questionCount });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6">
      <Input
        label="WebページのURL"
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com"
        error={error}
        disabled={isLoading}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          難易度
        </label>
        <div className="flex gap-4">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
            <label key={level} className="flex items-center">
              <input
                type="radio"
                value={level}
                checked={difficulty === level}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                disabled={isLoading}
                className="mr-2"
              />
              {level === 'easy' && '初級'}
              {level === 'medium' && '中級'}
              {level === 'hard' && '上級'}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="questionCount"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          問題数
        </label>
        <select
          id="questionCount"
          value={questionCount}
          onChange={(e) => setQuestionCount(Number(e.target.value))}
          disabled={isLoading}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          {[3, 5, 7, 10].map((count) => (
            <option key={count} value={count}>
              {count}問
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" isLoading={isLoading} className="w-full">
        クイズを生成
      </Button>
    </form>
  );
};
```

**チェックリスト**:
- [ ] コンポーネント実装完了
- [ ] バリデーション確認
- [ ] UI/UX確認

#### 3.2.2 その他のクイズコンポーネント

**作成ファイル**:
- `src/components/quiz/QuizCard.tsx`
- `src/components/quiz/QuestionItem.tsx`
- `src/components/quiz/ResultSummary.tsx`

**チェックリスト**:
- [ ] QuizCard実装完了
- [ ] QuestionItem実装完了
- [ ] ResultSummary実装完了

### Task 3.3: ページの実装

#### 3.3.1 トップページ

**作成ファイル**: `src/app/page.tsx`

**実装内容**:
- ヒーローセクション
- URL入力フォーム
- 使い方説明
- クイズ生成処理
- ローディング表示
- エラー表示
- クイズページへのリダイレクト

**チェックリスト**:
- [ ] ページ実装完了
- [ ] レスポンシブ対応確認
- [ ] 動作確認

#### 3.3.2 クイズページ

**作成ファイル**: `src/app/quiz/[id]/page.tsx`

**実装内容**:
- プログレスバー
- 問題表示
- 選択肢
- 次へ/前へボタン
- 回答の保存
- 完了時の結果ページへの遷移

**チェックリスト**:
- [ ] ページ実装完了
- [ ] 回答状態管理確認
- [ ] 動作確認

#### 3.3.3 結果ページ

**作成ファイル**: `src/app/result/[id]/page.tsx`

**実装内容**:
- スコア表示
- 正解数表示
- 理解度レベル表示
- 各問題の正誤
- 解説の表示
- アクションボタン（再チャレンジ、新しいクイズ）

**チェックリスト**:
- [ ] ページ実装完了
- [ ] 採点処理確認
- [ ] UI/UX確認

### Task 3.4: ローカルストレージ管理

**作成ファイル**: `src/lib/storage/localStorage.ts`

```typescript
import { Quiz, QuizResult } from '@/types/quiz.types';

const QUIZ_STORAGE_KEY = 'quiz_data';
const RESULT_STORAGE_KEY = 'quiz_results';

export const saveQuiz = (quiz: Quiz): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${QUIZ_STORAGE_KEY}_${quiz.id}`, JSON.stringify(quiz));
};

export const getQuiz = (quizId: string): Quiz | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(`${QUIZ_STORAGE_KEY}_${quizId}`);
  return data ? JSON.parse(data) : null;
};

export const saveResult = (result: QuizResult): void => {
  if (typeof window === 'undefined') return;
  const results = getResults();
  results.push(result);
  localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(results));
};

export const getResults = (): QuizResult[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(RESULT_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};
```

**チェックリスト**:
- [ ] ストレージ管理実装完了
- [ ] 保存/読み込み確認

### Phase 3 完了チェック

- [ ] すべてのカスタムフック実装完了
- [ ] すべてのコンポーネント実装完了
- [ ] すべてのページ実装完了
- [ ] ローカルストレージ管理実装完了
- [ ] ユーザーフロー動作確認
- [ ] レスポンシブ対応確認
- [ ] コードレビュー実施
- [ ] Git コミット・プッシュ

---

## ⚡ Phase 4: 最適化・テスト（Week 6）

### Task 4.1: パフォーマンス最適化

- [ ] コンポーネントのメモ化（React.memo）
- [ ] useMemo/useCallbackの適用
- [ ] 画像最適化
- [ ] コード分割
- [ ] バンドルサイズ確認

### Task 4.2: アクセシビリティ改善

- [ ] キーボードナビゲーション確認
- [ ] ARIA属性の追加
- [ ] スクリーンリーダーテスト
- [ ] カラーコントラスト確認
- [ ] フォーカス管理

### Task 4.3: エラーハンドリング強化

- [ ] エラーバウンダリの実装
- [ ] ユーザーフレンドリーなエラーメッセージ
- [ ] リトライ機能
- [ ] フォールバック表示

### Task 4.4: テスト実装（オプション）

- [ ] ユニットテスト（ユーティリティ関数）
- [ ] コンポーネントテスト
- [ ] API統合テスト
- [ ] E2Eテスト（Playwright/Cypress）

### Phase 4 完了チェック

- [ ] パフォーマンス最適化完了
- [ ] アクセシビリティ改善完了
- [ ] エラーハンドリング強化完了
- [ ] テスト実装完了（オプション）
- [ ] 動作確認
- [ ] Git コミット・プッシュ

---

## 🚀 Phase 5: リリース準備（Week 7）

### Task 5.1: ドキュメント整備

**更新ファイル**: `README.md`

- [ ] プロジェクト説明
- [ ] セットアップ手順
- [ ] 環境変数の説明
- [ ] 使用方法
- [ ] デプロイ手順

### Task 5.2: 環境準備

- [ ] Vercelアカウント準備
- [ ] Gemini API本番キー取得
- [ ] 環境変数設定

### Task 5.3: デプロイ

- [ ] Vercelにデプロイ
- [ ] 本番環境での動作確認
- [ ] パフォーマンス測定
- [ ] エラーモニタリング設定

### Task 5.4: リリース

- [ ] バージョンタグ作成
- [ ] リリースノート作成
- [ ] ドキュメント公開
- [ ] 運用マニュアル作成

### Phase 5 完了チェック

- [ ] すべてのドキュメント整備完了
- [ ] デプロイ完了
- [ ] 本番環境動作確認完了
- [ ] リリース完了

---

## 📊 進捗管理

### マイルストーン

| Phase | 完了予定日 | ステータス |
|-------|-----------|----------|
| Phase 1 | Week 1 | 🔲 未着手 |
| Phase 2 | Week 3 | 🔲 未着手 |
| Phase 3 | Week 5 | 🔲 未着手 |
| Phase 4 | Week 6 | 🔲 未着手 |
| Phase 5 | Week 7 | 🔲 未着手 |

### リスクと対策

| リスク | 影響度 | 対策 |
|--------|--------|------|
| Gemini API制限 | 高 | レート制限実装、キャッシュ活用 |
| スクレイピング失敗 | 中 | タイムアウト・リトライ実装 |
| パフォーマンス問題 | 中 | 最適化フェーズでの対応 |
| スケジュール遅延 | 低 | オプション機能の後回し |

---

## 📚 参考資料

- [SPECIFICATION.md](./SPECIFICATION.md) - 詳細仕様書
- [Next.js Documentation](https://nextjs.org/docs)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

**文書バージョン**: 1.0.0
**作成日**: 2025-11-22
**最終更新日**: 2025-11-22
**ステータス**: Active
