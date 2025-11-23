# URL Quiz Generator 仕様書

## 📋 プロジェクト概要

### 目的
Webサイトに対するユーザーの理解度を測定するために、URLを入力するだけで自動的にクイズを生成するアプリケーションを提供する。

### コンセプト
- URLを入力するだけで、そのWebページの内容を解析し、理解度チェック用のクイズを自動生成
- Gemini APIを活用した高品質なクイズ問題の自動作成
- シンプルで直感的なUI/UX

## 🎯 機能要件

### コア機能

#### 1. URL入力機能
- **説明**: ユーザーがクイズを生成したいWebページのURLを入力
- **入力検証**:
  - 有効なURL形式のチェック
  - HTTPSプロトコルの確認
  - URLの到達可能性チェック
- **制約事項**:
  - 1回のリクエストで1URLのみ処理
  - 許可されたドメインのみ（オプション）

#### 2. Webページコンテンツ取得機能
- **説明**: 入力されたURLからWebページのコンテンツを取得
- **取得内容**:
  - HTMLコンテンツの取得
  - テキストコンテンツの抽出
  - メタデータの取得（タイトル、説明文など）
- **技術要件**:
  - JavaScriptレンダリング対応（必要に応じて）
  - タイムアウト設定（30秒）
  - エラーハンドリング

#### 3. クイズ生成機能
- **説明**: Gemini APIを使用してWebページの内容に基づいたクイズを生成
- **クイズ仕様**:
  - **問題数**: デフォルト5問（設定可能: 3〜10問）
  - **問題形式**:
    - 選択式（4択）
    - 正解は1つ
  - **難易度**: 3段階（初級・中級・上級）から選択可能
- **生成ロジック**:
  - ページの主要トピックを抽出
  - 重要な事実・概念・数値を問題化
  - 理解度を測定できる適切な問題を作成

#### 4. クイズ表示・回答機能
- **説明**: 生成されたクイズをユーザーに表示し、回答を受け付ける
- **機能**:
  - 1問ずつ表示（プログレスバー付き）
  - 選択肢のハイライト表示
  - 次の問題へ進むボタン
  - 回答の一時保存

#### 5. 採点・結果表示機能
- **説明**: ユーザーの回答を採点し、結果を表示
- **表示内容**:
  - 総合スコア（正答率）
  - 各問題の正誤
  - 正解と解説
  - 理解度レベルの判定
- **結果の保存**:
  - ローカルストレージに保存
  - 履歴の参照機能（オプション）

### 補助機能

#### 6. クイズ再生成機能
- 同じURLで異なるクイズを再生成
- 問題数や難易度の変更

#### 7. クイズ共有機能（オプション）
- 生成されたクイズのURL共有
- クイズデータのエクスポート（JSON形式）

#### 8. 履歴管理機能（オプション）
- 過去に生成したクイズの一覧表示
- お気に入り登録
- 再チャレンジ機能

## 🏗️ システム構成

### アーキテクチャ

```
┌─────────────────────────────────────────────────┐
│                   Frontend                       │
│  (Next.js 16 + React 19 + TypeScript)           │
│                                                  │
│  ┌──────────────┐  ┌──────────────┐            │
│  │ URL Input    │  │ Quiz Display │            │
│  │ Page         │  │ Page         │            │
│  └──────────────┘  └──────────────┘            │
│                                                  │
│  ┌──────────────┐  ┌──────────────┐            │
│  │ Result       │  │ History      │            │
│  │ Page         │  │ Page         │            │
│  └──────────────┘  └──────────────┘            │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│                   Backend API                    │
│           (Next.js API Routes)                   │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │ POST /api/quiz/generate                  │  │
│  │   - URL受信                              │  │
│  │   - コンテンツ取得                       │  │
│  │   - Gemini API呼び出し                   │  │
│  │   - クイズ生成                           │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │ POST /api/quiz/evaluate                  │  │
│  │   - 回答データ受信                       │  │
│  │   - 採点処理                             │  │
│  │   - 結果返却                             │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│              External Services                   │
│                                                  │
│  ┌──────────────┐  ┌──────────────┐            │
│  │ Gemini API   │  │ Web Scraping │            │
│  │              │  │ Service      │            │
│  └──────────────┘  └──────────────┘            │
└─────────────────────────────────────────────────┘
```

### ディレクトリ構成

```
src/
├── app/
│   ├── page.tsx                    # トップページ（URL入力）
│   ├── quiz/
│   │   └── [id]/
│   │       └── page.tsx            # クイズ表示ページ
│   ├── result/
│   │   └── [id]/
│   │       └── page.tsx            # 結果表示ページ
│   ├── history/
│   │   └── page.tsx                # 履歴ページ（オプション）
│   └── api/
│       └── quiz/
│           ├── generate/
│           │   └── route.ts        # クイズ生成API
│           └── evaluate/
│               └── route.ts        # 採点API
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── ProgressBar.tsx
│   │   └── LoadingSpinner.tsx
│   └── quiz/
│       ├── QuizCard.tsx            # クイズ問題表示カード
│       ├── QuestionItem.tsx        # 個別問題コンポーネント
│       └── ResultSummary.tsx       # 結果サマリー
├── features/
│   └── quiz/
│       ├── components/
│       │   ├── UrlInputForm.tsx    # URL入力フォーム
│       │   ├── QuizContainer.tsx   # クイズコンテナ
│       │   └── ResultDisplay.tsx   # 結果表示
│       ├── hooks/
│       │   ├── useQuizGeneration.ts
│       │   ├── useQuizAnswer.ts
│       │   └── useQuizHistory.ts
│       └── types/
│           └── quiz.types.ts
├── lib/
│   ├── gemini/
│   │   ├── client.ts               # Gemini APIクライアント
│   │   └── prompts.ts              # プロンプトテンプレート
│   ├── scraper/
│   │   └── webScraper.ts           # Webスクレイピング
│   └── storage/
│       └── localStorage.ts         # ローカルストレージ管理
├── utils/
│   ├── urlValidator.ts             # URL検証
│   ├── textProcessor.ts            # テキスト処理
│   └── scoreCalculator.ts          # スコア計算
└── types/
    ├── api.types.ts                # API型定義
    └── quiz.types.ts               # クイズ型定義
```

## 💻 技術スタック

### フロントエンド
- **フレームワーク**: Next.js 16（App Router）
- **UIライブラリ**: React 19
- **言語**: TypeScript 5
- **スタイリング**: Tailwind CSS 4
- **状態管理**: React Hooks（useState, useReducer）
- **データフェッチング**: fetch API / Axios

### バックエンド
- **API**: Next.js API Routes
- **言語**: TypeScript 5
- **外部API**: Google Gemini API
- **Webスクレイピング**: Cheerio / Puppeteer（必要に応じて）

### 開発ツール
- **リンター**: ESLint
- **フォーマッター**: Prettier
- **Git Hooks**: Husky + lint-staged
- **バンドラー**: Turbopack

## 🔌 API設計

### 1. クイズ生成API

**エンドポイント**: `POST /api/quiz/generate`

**リクエスト**:
```typescript
{
  url: string;              // 対象URL
  questionCount?: number;   // 問題数（デフォルト: 5）
  difficulty?: 'easy' | 'medium' | 'hard';  // 難易度
  language?: string;        // 言語（デフォルト: 'ja'）
}
```

**レスポンス（成功）**:
```typescript
{
  quizId: string;
  url: string;
  title: string;            // ページタイトル
  description: string;      // ページ説明
  createdAt: string;        // 生成日時
  questions: [
    {
      id: string;
      question: string;
      options: string[];    // 4つの選択肢
      correctAnswer: number; // 正解のインデックス（0-3）
      explanation: string;   // 解説
    }
  ]
}
```

**レスポンス（エラー）**:
```typescript
{
  error: string;
  code: 'INVALID_URL' | 'FETCH_FAILED' | 'GENERATION_FAILED' | 'RATE_LIMIT_EXCEEDED';
  message: string;
}
```

### 2. 採点API

**エンドポイント**: `POST /api/quiz/evaluate`

**リクエスト**:
```typescript
{
  quizId: string;
  answers: number[];        // ユーザーの回答（インデックス配列）
}
```

**レスポンス**:
```typescript
{
  quizId: string;
  score: number;            // スコア（0-100）
  correctCount: number;     // 正解数
  totalCount: number;       // 総問題数
  results: [
    {
      questionId: string;
      isCorrect: boolean;
      userAnswer: number;
      correctAnswer: number;
    }
  ];
  level: 'beginner' | 'intermediate' | 'advanced';  // 理解度レベル
}
```

## 📊 データ構造

### Quiz型

```typescript
interface Quiz {
  id: string;
  url: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: Question[];
  createdAt: Date;
}
```

### Question型

```typescript
interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category?: string;
}
```

### QuizResult型

```typescript
interface QuizResult {
  quizId: string;
  answers: number[];
  score: number;
  correctCount: number;
  totalCount: number;
  results: QuestionResult[];
  completedAt: Date;
}

interface QuestionResult {
  questionId: string;
  isCorrect: boolean;
  userAnswer: number;
  correctAnswer: number;
  timeTaken?: number;
}
```

## 🎨 UI/UX仕様

### 画面遷移フロー

```
[トップページ]
    │
    ├─ URL入力
    │
    ▼
[ローディング]
    │
    ├─ クイズ生成中...
    │
    ▼
[クイズ画面]
    │
    ├─ 問題1 → 問題2 → ... → 問題N
    │
    ▼
[結果画面]
    │
    ├─ スコア表示
    ├─ 解説表示
    │
    └─ [再チャレンジ] or [新しいクイズ]
```

### 主要画面の仕様

#### 1. トップページ（URL入力画面）

**レイアウト**:
```
┌────────────────────────────────────────┐
│                                        │
│        🧠 URL Quiz Generator           │
│                                        │
│   サイトの理解度をクイズでチェック！   │
│                                        │
│   ┌──────────────────────────────┐   │
│   │ URL入力欄                     │   │
│   │ https://example.com          │   │
│   └──────────────────────────────┘   │
│                                        │
│   難易度: ○初級 ○中級 ○上級          │
│   問題数: [5▼]                        │
│                                        │
│   ┌──────────────┐                    │
│   │ クイズ生成   │                    │
│   └──────────────┘                    │
│                                        │
└────────────────────────────────────────┘
```

**機能**:
- URL入力フィールド（バリデーション付き）
- 難易度選択ラジオボタン
- 問題数選択ドロップダウン
- クイズ生成ボタン
- エラーメッセージ表示エリア

#### 2. クイズ画面

**レイアウト**:
```
┌────────────────────────────────────────┐
│  [■■■■■□□□□□] 問題 5/10           │
│                                        │
│  Q. 問題文がここに表示されます         │
│                                        │
│  ○ 選択肢1                             │
│  ○ 選択肢2                             │
│  ○ 選択肢3                             │
│  ○ 選択肢4                             │
│                                        │
│            [次へ →]                    │
│                                        │
└────────────────────────────────────────┘
```

**機能**:
- プログレスバー
- 問題番号表示
- 問題文表示
- 選択肢（ラジオボタン）
- 次へ/完了ボタン
- 前の問題へ戻る機能（オプション）

#### 3. 結果画面

**レイアウト**:
```
┌────────────────────────────────────────┐
│           結果発表！                   │
│                                        │
│      ┌──────────────┐                 │
│      │              │                 │
│      │   85点       │                 │
│      │              │                 │
│      └──────────────┘                 │
│                                        │
│   正解数: 8/10問                       │
│   理解度: 上級                         │
│                                        │
│   ━━━━━━━━━━━━━━━━━━━━━━━           │
│                                        │
│   Q1. ✅ 正解                          │
│   Q2. ❌ 不正解 → 解説を見る          │
│   Q3. ✅ 正解                          │
│   ...                                  │
│                                        │
│   [再チャレンジ] [新しいクイズ]       │
│                                        │
└────────────────────────────────────────┘
```

**機能**:
- スコア表示（大きく目立つ）
- 正解数表示
- 理解度レベル表示
- 各問題の正誤一覧
- 解説の展開/折りたたみ
- 再チャレンジボタン
- 新しいクイズボタン

### デザインガイドライン

**カラーパレット**:
- プライマリー: `#3B82F6`（青）
- セカンダリー: `#10B981`（緑）
- エラー: `#EF4444`（赤）
- 成功: `#22C55E`（緑）
- 背景: `#F9FAFB`（ライトグレー）
- テキスト: `#111827`（ダークグレー）

**フォント**:
- 見出し: `font-bold text-2xl`
- 本文: `font-normal text-base`
- ボタン: `font-medium text-lg`

**レスポンシブデザイン**:
- モバイルファースト
- ブレークポイント: `sm: 640px`, `md: 768px`, `lg: 1024px`

## ⚙️ 非機能要件

### パフォーマンス
- クイズ生成時間: 10秒以内
- ページロード時間: 3秒以内
- API応答時間: 5秒以内

### セキュリティ
- APIキーの環境変数管理
- CORS設定
- レート制限（1ユーザーあたり10リクエスト/分）
- XSS対策（入力のサニタイジング）
- CSRF対策

### 可用性
- エラーハンドリングの徹底
- フォールバック処理
- ユーザーフレンドリーなエラーメッセージ

### スケーラビリティ
- APIリクエストのキャッシュ
- 同一URLのクイズ再利用（オプション）

### アクセシビリティ
- キーボード操作対応
- スクリーンリーダー対応
- 適切なARIA属性の使用
- カラーコントラスト比の確保

## 🔧 実装ステップ

### Phase 1: 基盤構築（Week 1）

1. **プロジェクトセットアップ**
   - Next.js プロジェクトの初期化
   - 必要なパッケージのインストール
   - ディレクトリ構造の構築

2. **型定義の作成**
   - Quiz, Question, QuizResult等の型定義
   - API型定義

3. **UIコンポーネントの作成**
   - Button, Input, Card等の基本コンポーネント
   - ProgressBar, LoadingSpinner

### Phase 2: コア機能実装（Week 2-3）

4. **Gemini API統合**
   - APIクライアントの実装
   - プロンプトエンジニアリング
   - エラーハンドリング

5. **Webスクレイピング機能**
   - URLからのコンテンツ取得
   - テキスト抽出処理
   - メタデータ取得

6. **クイズ生成API**
   - `/api/quiz/generate`の実装
   - バリデーション処理
   - レスポンス整形

7. **採点API**
   - `/api/quiz/evaluate`の実装
   - スコア計算ロジック
   - 結果生成

### Phase 3: フロントエンド実装（Week 4-5）

8. **URL入力画面**
   - フォームコンポーネント
   - バリデーション
   - ローディング状態

9. **クイズ表示画面**
   - 問題表示コンポーネント
   - 回答選択機能
   - プログレス管理

10. **結果表示画面**
    - スコア表示
    - 解説表示
    - アクション部分

### Phase 4: 最適化・テスト（Week 6）

11. **パフォーマンス最適化**
    - コード分割
    - 画像最適化
    - キャッシュ戦略

12. **テスト実装**
    - ユニットテスト
    - 統合テスト
    - E2Eテスト（オプション）

13. **UI/UXの改善**
    - アニメーション追加
    - レスポンシブ対応確認
    - アクセシビリティチェック

### Phase 5: リリース準備（Week 7）

14. **ドキュメント整備**
    - README.md更新
    - APIドキュメント作成
    - 使い方ガイド

15. **デプロイ**
    - Vercelへのデプロイ
    - 環境変数設定
    - 動作確認

## 📝 Gemini APIプロンプト例

### クイズ生成プロンプト

```
以下のWebページの内容を解析し、理解度を測るクイズを{questionCount}問生成してください。

【Webページ情報】
タイトル: {pageTitle}
URL: {pageUrl}
本文: {pageContent}

【要件】
- 難易度: {difficulty}
- 問題数: {questionCount}
- 形式: 4択問題（正解は1つ）
- 問題は重要な概念、事実、数値に焦点を当てる
- 選択肢は明確で紛らわしくないこと
- 各問題に簡潔な解説を付ける

【出力形式】
JSON形式で以下の構造で出力してください:
{
  "questions": [
    {
      "question": "問題文",
      "options": ["選択肢1", "選択肢2", "選択肢3", "選択肢4"],
      "correctAnswer": 0,
      "explanation": "解説文"
    }
  ]
}
```

## 🔐 環境変数

```env
# Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# アプリケーション設定
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_MAX_QUESTIONS=10
NEXT_PUBLIC_DEFAULT_QUESTIONS=5

# レート制限
RATE_LIMIT_MAX_REQUESTS=10
RATE_LIMIT_WINDOW_MS=60000
```

## 🚀 今後の拡張可能性

### 優先度: 高
- クイズ履歴の永続化（データベース導入）
- ユーザー認証機能
- クイズの共有機能

### 優先度: 中
- 複数ページ一括クイズ生成
- カスタムクイズ作成機能
- クイズカテゴリー分類

### 優先度: 低
- ランキング機能
- ソーシャル共有機能
- モバイルアプリ化

## 📚 参考資料

- [Gemini API Documentation](https://ai.google.dev/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**文書バージョン**: 1.0.0
**作成日**: 2025-11-22
**最終更新日**: 2025-11-22
**承認者**: -
**ステータス**: Draft
