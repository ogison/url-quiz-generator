# URL Quiz Generator - UI/UXデザインガイドライン

## 📐 デザイン原則

### コアバリュー

1. **シンプルさ (Simplicity)**
   - 余計な要素を排除し、必要な機能だけを提供
   - ユーザーが迷わない、直感的なインターフェース
   - ミニマルで洗練されたビジュアルデザイン

2. **わかりやすさ (Clarity)**
   - すべてのアクションが明確で予測可能
   - 視覚的なヒエラルキーが明確
   - 適切なフィードバックとガイダンス

3. **効率性 (Efficiency)**
   - 最小限のステップでタスクを完了
   - 重要な情報にすぐアクセスできる
   - 待ち時間を感じさせない工夫

4. **信頼性 (Reliability)**
   - 一貫したデザインパターン
   - エラーに対する適切な対応
   - データの安全性と透明性

---

## 🎨 カラーシステム

### メインカラー

```css
/* Primary Colors - ブランドカラー */
--color-primary-50:  #EFF6FF;   /* 背景、ホバー */
--color-primary-100: #DBEAFE;   /* 淡い背景 */
--color-primary-500: #3B82F6;   /* メインボタン、リンク */
--color-primary-600: #2563EB;   /* ホバー時 */
--color-primary-700: #1D4ED8;   /* アクティブ時 */

/* Secondary Colors - 成功、情報 */
--color-green-50:  #F0FDF4;
--color-green-500: #22C55E;     /* 正解、成功 */
--color-green-600: #16A34A;     /* ホバー */

/* Error Colors - エラー、不正解 */
--color-red-50:  #FEF2F2;
--color-red-500: #EF4444;       /* エラー、不正解 */
--color-red-600: #DC2626;       /* ホバー */

/* Warning Colors - 警告 */
--color-yellow-50:  #FFFBEB;
--color-yellow-500: #F59E0B;    /* 警告 */
--color-yellow-600: #D97706;    /* ホバー */
```

### ニュートラルカラー

```css
/* Neutral Colors - テキスト、背景 */
--color-gray-50:  #F9FAFB;      /* ページ背景 */
--color-gray-100: #F3F4F6;      /* カード背景 */
--color-gray-200: #E5E7EB;      /* ボーダー */
--color-gray-300: #D1D5DB;      /* 無効状態 */
--color-gray-400: #9CA3AF;      /* プレースホルダー */
--color-gray-500: #6B7280;      /* 補助テキスト */
--color-gray-600: #4B5563;      /* ボディテキスト */
--color-gray-700: #374151;      /* 見出し */
--color-gray-800: #1F2937;      /* 強調テキスト */
--color-gray-900: #111827;      /* タイトル */
--color-white:    #FFFFFF;      /* 白背景 */
```

### カラー使用ガイドライン

| 用途 | カラー | 説明 |
|-----|-------|------|
| メインCTA | `primary-500` | クイズ生成ボタンなど |
| 正解表示 | `green-500` | ✓マーク、正解数 |
| 不正解表示 | `red-500` | ✗マーク、エラー |
| ページ背景 | `gray-50` | 全体の背景 |
| カード背景 | `white` | 問題カード、結果カード |
| テキスト（本文） | `gray-600` | 通常のテキスト |
| テキスト（見出し） | `gray-900` | タイトル、見出し |

---

## 🔤 タイポグラフィ

### フォントファミリー

```css
/* 日本語対応 */
--font-sans: 'Inter', 'Hiragino Sans', 'Hiragino Kaku Gothic ProN',
             'Noto Sans JP', 'メイリオ', 'Meiryo', sans-serif;

--font-mono: 'Fira Code', 'Consolas', 'Monaco', monospace;
```

### タイポグラフィスケール

| レベル | サイズ | 行高 | 太さ | 用途 |
|-------|--------|------|------|------|
| **Display** | 48px (3rem) | 1.2 | 700 | ヒーローセクション |
| **H1** | 36px (2.25rem) | 1.3 | 700 | ページタイトル |
| **H2** | 30px (1.875rem) | 1.3 | 600 | セクション見出し |
| **H3** | 24px (1.5rem) | 1.4 | 600 | サブ見出し |
| **H4** | 20px (1.25rem) | 1.4 | 600 | カード見出し |
| **Body Large** | 18px (1.125rem) | 1.6 | 400 | 重要な本文 |
| **Body** | 16px (1rem) | 1.5 | 400 | 通常テキスト |
| **Body Small** | 14px (0.875rem) | 1.5 | 400 | 補足テキスト |
| **Caption** | 12px (0.75rem) | 1.4 | 400 | キャプション |

### 使用例

```tsx
// ページタイトル
<h1 className="text-4xl font-bold text-gray-900">
  URL Quiz Generator
</h1>

// 問題テキスト
<p className="text-lg font-medium text-gray-700">
  この記事の主題は何ですか？
</p>

// 選択肢
<label className="text-base text-gray-600">
  選択肢テキスト
</label>

// 補助テキスト
<span className="text-sm text-gray-500">
  5問中3問完了
</span>
```

---

## 📏 スペーシングシステム

### スペーススケール（8pxベース）

| トークン | 値 | 用途 |
|---------|-----|------|
| `xs` | 4px (0.25rem) | アイコンとテキストの間隔 |
| `sm` | 8px (0.5rem) | 密なコンテンツ間隔 |
| `md` | 16px (1rem) | 通常の要素間隔 |
| `lg` | 24px (1.5rem) | セクション内の間隔 |
| `xl` | 32px (2rem) | セクション間の間隔 |
| `2xl` | 48px (3rem) | 大きなセクション間隔 |
| `3xl` | 64px (4rem) | ページセクション間隔 |

### レイアウトガイドライン

```css
/* コンテナ幅 */
--container-sm:  640px;   /* フォーム */
--container-md:  768px;   /* クイズカード */
--container-lg:  1024px;  /* 結果ページ */
--container-xl:  1280px;  /* ダッシュボード */

/* パディング */
--padding-container: 1rem;    /* モバイル */
--padding-container-lg: 2rem; /* デスクトップ */

/* ボーダー半径 */
--radius-sm:  4px;   /* 小さな要素 */
--radius-md:  8px;   /* ボタン、入力欄 */
--radius-lg:  12px;  /* カード */
--radius-xl:  16px;  /* 大きなカード */
--radius-full: 9999px; /* 円形ボタン */
```

---

## 🧩 コンポーネント設計

### 1. ボタン（Button）

#### バリアント

**Primary（メインアクション）**
```tsx
<button className="
  px-6 py-3
  bg-blue-600 hover:bg-blue-700 active:bg-blue-800
  text-white font-medium text-base
  rounded-lg
  transition-colors duration-200
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
">
  クイズを生成
</button>
```

**Secondary（副次的アクション）**
```tsx
<button className="
  px-6 py-3
  bg-gray-100 hover:bg-gray-200 active:bg-gray-300
  text-gray-700 font-medium text-base
  rounded-lg
  transition-colors duration-200
">
  キャンセル
</button>
```

**Outline（控えめなアクション）**
```tsx
<button className="
  px-6 py-3
  border-2 border-blue-600
  bg-white hover:bg-blue-50
  text-blue-600 font-medium text-base
  rounded-lg
  transition-colors duration-200
">
  もう一度挑戦
</button>
```

#### サイズバリエーション

| サイズ | パディング | フォントサイズ | 用途 |
|-------|----------|-------------|------|
| Small | `px-3 py-1.5` | 14px | インラインアクション |
| Medium | `px-4 py-2` | 16px | 通常のボタン |
| Large | `px-6 py-3` | 18px | メインCTA |

### 2. インプット（Input）

```tsx
<div className="w-full">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    WebページのURL
  </label>
  <input
    type="url"
    placeholder="https://example.com"
    className="
      w-full px-4 py-3
      border border-gray-300 rounded-lg
      text-base text-gray-900
      placeholder:text-gray-400
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
      disabled:bg-gray-100 disabled:cursor-not-allowed
      transition-colors duration-200
    "
  />
  <p className="mt-1 text-sm text-gray-500">
    クイズを生成したいWebページのURLを入力してください
  </p>
</div>
```

**エラー状態**
```tsx
<input className="
  border-red-500 focus:ring-red-500
  ...
" />
<p className="mt-1 text-sm text-red-600">
  有効なURLを入力してください
</p>
```

### 3. カード（Card）

```tsx
<div className="
  bg-white
  rounded-xl
  shadow-sm
  border border-gray-200
  p-6
  transition-shadow duration-200
  hover:shadow-md
">
  {/* カードコンテンツ */}
</div>
```

**影のバリエーション**
- `shadow-sm`: 通常のカード
- `shadow-md`: ホバー時、重要なカード
- `shadow-lg`: モーダル、重要な通知

### 4. プログレスバー（Progress Bar）

```tsx
<div className="w-full">
  <div className="flex justify-between items-center mb-2">
    <span className="text-sm font-medium text-gray-700">
      問題 3/10
    </span>
    <span className="text-sm text-gray-500">30%</span>
  </div>
  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
    <div
      className="h-full bg-blue-600 transition-all duration-300 ease-out"
      style={{ width: '30%' }}
    />
  </div>
</div>
```

### 5. ラジオボタン（Radio）

```tsx
<label className="
  flex items-center p-4
  border-2 border-gray-200 rounded-lg
  cursor-pointer
  transition-all duration-200
  hover:border-blue-300 hover:bg-blue-50
  has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50
">
  <input
    type="radio"
    className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
  />
  <span className="ml-3 text-base text-gray-700">
    選択肢テキスト
  </span>
</label>
```

### 6. バッジ（Badge）

```tsx
/* 難易度バッジ */
<span className="
  inline-flex items-center
  px-2.5 py-0.5
  rounded-full
  text-xs font-medium
  bg-green-100 text-green-800
">
  初級
</span>

<span className="bg-yellow-100 text-yellow-800">中級</span>
<span className="bg-red-100 text-red-800">上級</span>
```

### 7. ローディングスピナー（Loading Spinner）

```tsx
<div className="flex items-center justify-center">
  <svg
    className="animate-spin h-8 w-8 text-blue-600"
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
  <span className="ml-3 text-gray-600">クイズを生成中...</span>
</div>
```

---

## 📊 情報階層とレイアウト

### 画面ごとの情報階層

#### 1. トップページ（URL入力画面）

**優先度1: ヒーローセクション**
- アプリ名とキャッチコピー
- 簡潔な説明文

**優先度2: URL入力フォーム**
- URL入力欄（最も重要）
- 難易度選択
- 問題数選択
- クイズ生成ボタン（CTA）

**優先度3: 補足情報**
- 使い方の説明
- サンプルURL

```
┌─────────────────────────────────────────┐
│                                         │
│        🧠 URL Quiz Generator            │
│  サイトの理解度をクイズでチェック！      │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ 📝 URL入力欄                      │ │  ← 最重要
│  │ https://...                       │ │
│  └───────────────────────────────────┘ │
│                                         │
│  難易度: ○初級 ●中級 ○上級             │
│  問題数: [5 ▼]                         │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │    クイズを生成    　             │ │  ← CTA
│  └───────────────────────────────────┘ │
│                                         │
├─────────────────────────────────────────┤
│  💡 使い方                              │
│  1. URLを入力                           │
│  2. 設定を選択                          │
│  3. クイズに挑戦                        │
└─────────────────────────────────────────┘
```

#### 2. クイズ画面

**優先度1: 進捗表示**
- プログレスバー
- 問題番号

**優先度2: 問題内容**
- 問題文（大きく表示）
- 選択肢（明確に分離）

**優先度3: ナビゲーション**
- 次へボタン
- 戻るボタン（オプション）

```
┌─────────────────────────────────────────┐
│ [████████░░░░] 問題 5/10               │  ← 進捗
├─────────────────────────────────────────┤
│                                         │
│  Q. この記事の主題は何ですか？          │  ← 問題文
│                                         │  （大きく）
│  ┌─────────────────────────────────┐   │
│  │ ○ 選択肢1                        │   │  ← 選択肢
│  └─────────────────────────────────┘   │  （タップしやすく）
│  ┌─────────────────────────────────┐   │
│  │ ○ 選択肢2                        │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ ○ 選択肢3                        │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ ○ 選択肢4                        │   │
│  └─────────────────────────────────┘   │
│                                         │
│               [次へ →]                  │  ← CTA
│                                         │
└─────────────────────────────────────────┘
```

#### 3. 結果画面

**優先度1: スコア（最大の視覚的強調）**
- 点数（大きく表示）
- 正解数
- 理解度レベル

**優先度2: 各問題の正誤**
- 問題リスト
- ✓/✗表示
- 解説へのリンク

**優先度3: アクション**
- 再チャレンジボタン
- 新しいクイズボタン

```
┌─────────────────────────────────────────┐
│           🎉 結果発表！                 │
│                                         │
│      ┌─────────────────────┐           │
│      │                     │           │
│      │      85点           │           │  ← スコア
│      │                     │           │  （最大強調）
│      └─────────────────────┘           │
│                                         │
│   正解数: 8/10問                        │
│   理解度: 上級                          │
│                                         │
├─────────────────────────────────────────┤
│  📋 問題一覧                            │
│                                         │
│  Q1. ✅ 正解                            │  ← 結果リスト
│      └ 解説を見る                       │
│  Q2. ❌ 不正解                          │
│      └ 解説を見る                       │
│  Q3. ✅ 正解                            │
│      └ 解説を見る                       │
│  ...                                    │
│                                         │
├─────────────────────────────────────────┤
│  [🔄 再チャレンジ] [🆕 新しいクイズ]   │  ← アクション
└─────────────────────────────────────────┘
```

---

## 📱 レスポンシブデザイン

### ブレークポイント

```css
/* Mobile First アプローチ */
--breakpoint-sm: 640px;   /* スマートフォン（横） */
--breakpoint-md: 768px;   /* タブレット */
--breakpoint-lg: 1024px;  /* ノートPC */
--breakpoint-xl: 1280px;  /* デスクトップ */
```

### レスポンシブパターン

#### コンテナ幅

```tsx
<div className="
  w-full
  max-w-md      /* モバイル: 448px */
  md:max-w-2xl  /* タブレット: 672px */
  lg:max-w-4xl  /* デスクトップ: 896px */
  mx-auto
  px-4 md:px-6 lg:px-8
">
```

#### グリッドレイアウト

```tsx
/* 選択肢のレイアウト */
<div className="
  grid
  grid-cols-1           /* モバイル: 1列 */
  md:grid-cols-2        /* タブレット以上: 2列 */
  gap-3 md:gap-4
">
```

#### フォントサイズ

```tsx
/* レスポンシブタイポグラフィ */
<h1 className="
  text-3xl md:text-4xl lg:text-5xl
  font-bold
">

<p className="
  text-base md:text-lg
">
```

#### スペーシング

```tsx
<section className="
  py-8 md:py-12 lg:py-16
  px-4 md:px-6 lg:px-8
">
```

### モバイルファースト設計原則

1. **タッチターゲット**: 最小44×44px
2. **フォントサイズ**: 本文は最小16px（iOS Safari のズーム防止）
3. **間隔**: タップしやすい十分な余白
4. **スクロール**: 縦スクロールを基本とする

---

## 🎭 インタラクション設計

### マイクロインタラクション

#### 1. ホバー効果

```css
/* ボタン */
.button {
  transition: all 200ms ease-out;
}
.button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* カード */
.card {
  transition: shadow 200ms ease-out;
}
.card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
```

#### 2. クリック効果

```css
.button:active {
  transform: scale(0.98);
}
```

#### 3. フォーカス状態

```css
/* キーボードナビゲーション対応 */
.interactive:focus-visible {
  outline: 2px solid #3B82F6;
  outline-offset: 2px;
}
```

### アニメーション

#### ページ遷移

```tsx
/* フェードイン */
<div className="
  animate-in
  fade-in
  duration-300
">

/* スライドイン */
<div className="
  animate-in
  slide-in-from-bottom
  duration-500
">
```

#### ローディング状態

```tsx
/* スケルトンスクリーン */
<div className="animate-pulse">
  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
</div>
```

#### 成功フィードバック

```tsx
/* チェックマークアニメーション */
<svg className="animate-in zoom-in duration-300">
  <path d="M5 13l4 4L19 7" />  {/* チェックマーク */}
</svg>
```

### トランジション設定

| 要素 | 継続時間 | イージング | 用途 |
|-----|---------|----------|------|
| ホバー | 150ms | ease-out | ボタン、リンク |
| 色変化 | 200ms | ease | 背景、ボーダー |
| スライド | 300ms | ease-out | ドロップダウン、モーダル |
| フェード | 200ms | ease-in-out | 要素の表示/非表示 |
| スケール | 100ms | ease-out | クリック効果 |

---

## ♿ アクセシビリティ

### キーボードナビゲーション

```tsx
/* すべてのインタラクティブ要素にfocus対応 */
<button
  className="focus:outline-none focus:ring-2 focus:ring-blue-500"
  tabIndex={0}
>

/* スキップリンク */
<a
  href="#main-content"
  className="sr-only focus:not-sr-only"
>
  メインコンテンツへスキップ
</a>
```

### ARIA属性

```tsx
/* プログレスバー */
<div
  role="progressbar"
  aria-valuenow={30}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label="クイズ進行状況"
>

/* ローディング */
<div
  role="status"
  aria-live="polite"
>
  <span className="sr-only">読み込み中...</span>
  <svg aria-hidden="true">...</svg>
</div>

/* エラーメッセージ */
<div
  role="alert"
  aria-live="assertive"
>
  URLを入力してください
</div>
```

### セマンティックHTML

```tsx
/* 適切な見出し階層 */
<main>
  <h1>URL Quiz Generator</h1>
  <section>
    <h2>クイズ設定</h2>
    <h3>難易度選択</h3>
  </section>
</main>

/* フォームラベル */
<label htmlFor="url-input">
  WebページのURL
</label>
<input id="url-input" type="url" />
```

### カラーコントラスト

すべてのテキストでWCAG AA基準（4.5:1）を満たす：

| 組み合わせ | コントラスト比 | 合格 |
|-----------|-------------|------|
| gray-900 / white | 18.4:1 | ✅ AAA |
| gray-700 / white | 11.6:1 | ✅ AAA |
| gray-600 / white | 8.6:1 | ✅ AAA |
| blue-600 / white | 5.9:1 | ✅ AA |
| red-600 / white | 5.5:1 | ✅ AA |

---

## 🔍 UXパターン

### 1. エラーハンドリング

#### インラインバリデーション

```tsx
<div>
  <input
    type="url"
    className={error ? 'border-red-500' : 'border-gray-300'}
    aria-invalid={!!error}
    aria-describedby={error ? 'url-error' : undefined}
  />
  {error && (
    <p id="url-error" className="text-sm text-red-600 mt-1">
      ⚠️ {error}
    </p>
  )}
</div>
```

#### エラーページ

```tsx
<div className="text-center py-12">
  <div className="text-6xl mb-4">😕</div>
  <h2 className="text-2xl font-bold text-gray-900 mb-2">
    問題が発生しました
  </h2>
  <p className="text-gray-600 mb-6">
    クイズの生成中にエラーが発生しました
  </p>
  <button className="btn-primary">
    もう一度試す
  </button>
</div>
```

### 2. 空状態（Empty State）

```tsx
<div className="text-center py-16">
  <div className="text-6xl mb-4">📚</div>
  <h3 className="text-xl font-semibold text-gray-900 mb-2">
    まだクイズがありません
  </h3>
  <p className="text-gray-600 mb-6">
    URLを入力して、最初のクイズを作成しましょう
  </p>
  <button className="btn-primary">
    クイズを作成
  </button>
</div>
```

### 3. ローディング状態

#### スケルトンスクリーン

```tsx
<div className="animate-pulse space-y-4">
  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
  <div className="h-4 bg-gray-200 rounded"></div>
  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
</div>
```

#### プログレスインジケーター

```tsx
<div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center">
  <div className="text-center">
    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
    <p className="mt-4 text-gray-600">クイズを生成中...</p>
    <p className="text-sm text-gray-500">最大30秒かかる場合があります</p>
  </div>
</div>
```

### 4. 成功フィードバック

```tsx
/* トースト通知 */
<div className="
  fixed top-4 right-4
  bg-green-50 border border-green-200 rounded-lg
  p-4 shadow-lg
  animate-in slide-in-from-top
">
  <div className="flex items-center">
    <svg className="w-5 h-5 text-green-600 mr-3">
      <path d="M5 13l4 4L19 7" />
    </svg>
    <p className="text-green-800 font-medium">
      クイズを生成しました！
    </p>
  </div>
</div>
```

### 5. 確認ダイアログ

```tsx
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
  <div className="bg-white rounded-xl p-6 max-w-md w-full">
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      クイズを終了しますか？
    </h3>
    <p className="text-gray-600 mb-6">
      進行中の回答は保存されません
    </p>
    <div className="flex gap-3">
      <button className="btn-secondary flex-1">
        キャンセル
      </button>
      <button className="btn-primary flex-1">
        終了する
      </button>
    </div>
  </div>
</div>
```

---

## 📐 グリッドとレイアウトシステム

### コンテナ

```tsx
/* ページコンテナ */
<div className="min-h-screen bg-gray-50">
  <div className="max-w-4xl mx-auto px-4 py-8">
    {/* コンテンツ */}
  </div>
</div>
```

### セクション分割

```tsx
<main>
  {/* ヒーローセクション */}
  <section className="py-12 md:py-16">
    <div className="max-w-3xl mx-auto text-center">
      <h1>...</h1>
    </div>
  </section>

  {/* フォームセクション */}
  <section className="py-8 md:py-12">
    <div className="max-w-2xl mx-auto">
      <form>...</form>
    </div>
  </section>

  {/* フッター */}
  <footer className="py-8 border-t border-gray-200">
    <div className="max-w-4xl mx-auto text-center text-sm text-gray-500">
      © 2025 URL Quiz Generator
    </div>
  </footer>
</main>
```

---

## 🎯 ユーザーフロー最適化

### クリティカルパス

1. **URL入力** → 2. **クイズ生成** → 3. **回答** → 4. **結果確認**

各ステップでの最適化：

#### Step 1: URL入力
- 入力欄を大きく、見つけやすく
- プレースホルダーで例を表示
- リアルタイムバリデーション

#### Step 2: クイズ生成
- 進捗状況を視覚化
- 推定時間を表示
- キャンセル可能に

#### Step 3: 回答
- 1問1画面で集中しやすく
- 進捗を常に表示
- 前の問題に戻れる（オプション）

#### Step 4: 結果確認
- スコアを最も目立たせる
- 改善点を具体的に
- 次のアクションを明確に

---

## 📝 コピーライティングガイドライン

### トーン&ボイス

- **フレンドリー**: カジュアルすぎず、親しみやすく
- **明確**: 専門用語を避け、わかりやすく
- **励まし**: ポジティブで前向きな表現
- **簡潔**: 必要な情報を端的に

### メッセージ例

#### 成功メッセージ
- ✅ 「クイズを生成しました！」
- ✅ 「素晴らしい！8問正解です」
- ❌ 「クイズ生成処理が正常に完了しました」

#### エラーメッセージ
- ✅ 「URLにアクセスできませんでした。もう一度お試しください」
- ✅ 「有効なURLを入力してください（例: https://example.com）」
- ❌ 「エラーコード: 404」

#### ローディングメッセージ
- ✅ 「クイズを生成中...（最大30秒）」
- ✅ 「ページを読み込んでいます...」
- ❌ 「処理中...」

---

## 🔄 デザインシステムのメンテナンス

### コンポーネントライブラリ

すべてのUIコンポーネントは以下に配置：
- `src/components/ui/` - 汎用UIコンポーネント
- `src/components/quiz/` - クイズ固有コンポーネント

### デザイントークン

カラー、スペーシング、タイポグラフィは`tailwind.config.js`で一元管理：

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: { ... },
        // すべてのカラートークン
      },
      spacing: {
        // スペーシングトークン
      },
      fontSize: {
        // タイポグラフィスケール
      },
    },
  },
}
```

### バージョン管理

- デザイン変更は必ずこのドキュメントを更新
- コンポーネント追加時はサンプルコード記載
- 破壊的変更は事前に通知

---

## 📚 参考資料

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design](https://material.io/design)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

---

**ドキュメントバージョン**: 1.0.0
**作成日**: 2025-11-23
**最終更新日**: 2025-11-23
**ステータス**: Active
