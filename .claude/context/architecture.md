# アーキテクチャ概要

## プロジェクト概要

このリポジトリは、Next.js 16 App Routerをベースとした、プロダクション対応のWebアプリケーションテンプレートです。

## 技術スタック

### コア技術
- **Next.js 16.0.3** - React フレームワーク（App Router）
- **React 19.1.0** - UIライブラリ
- **TypeScript 5** - 型安全性
- **Tailwind CSS 4** - スタイリング

### 開発ツール
- **Turbopack** - 高速バンドラー（dev/build）
- **ESLint 9** - コード品質チェック
- **Prettier 3** - コードフォーマット
- **Husky 9** - Git hooks
- **lint-staged 16** - ステージングファイルのリント

## ディレクトリ構造

```
next-js-template/
├── .claude/              # Claude Code設定
│   └── context/          # コンテキストドキュメント
├── .github/              # GitHub設定
│   └── workflows/        # CI/CD
├── .husky/               # Git hooks
├── doc/                  # プロジェクトドキュメント
├── public/               # 静的ファイル
│   └── images/           # 画像ファイル
├── rule/                 # 開発規約
│   └── rule.md           # メイン規約ドキュメント
└── src/                  # アプリケーションソース
    ├── app/              # Next.js App Router
    │   ├── layout.tsx    # ルートレイアウト
    │   ├── page.tsx      # ホームページ
    │   ├── globals.css   # グローバルスタイル
    │   ├── sitemap.ts    # サイトマップ生成
    │   └── favicon.ico   # ファビコン
    ├── components/       # 共通コンポーネント（予定）
    │   ├── ui/           # UIコンポーネント
    │   └── layout/       # レイアウトコンポーネント
    ├── features/         # 機能別モジュール
    │   └── home/         # ホーム機能
    ├── hooks/            # カスタムフック（予定）
    ├── lib/              # ライブラリ・ユーティリティ
    │   └── site-config.ts # サイト設定
    ├── utils/            # ユーティリティ関数（予定）
    ├── types/            # 型定義（予定）
    ├── constants/        # 定数定義（予定）
    └── services/         # API通信層（予定）
```

## アーキテクチャパターン

### 1. Feature-Based Architecture（機能ベースアーキテクチャ）

各機能は `src/features/` 配下に独立したモジュールとして配置します。

```
src/features/
└── {feature-name}/
    ├── components/      # 機能固有のコンポーネント
    ├── hooks/           # 機能固有のフック
    ├── utils/           # 機能固有のユーティリティ
    ├── types/           # 機能固有の型定義
    └── index.ts         # エクスポート
```

**メリット:**
- 機能単位での開発・保守が容易
- コードの依存関係が明確
- チーム開発でのコンフリクト軽減

### 2. レイヤー分離

```
Presentation Layer (UI)
    ↓
Business Logic Layer (Hooks/Utils)
    ↓
Data Access Layer (Services/API)
    ↓
External APIs / Database
```

### 3. Server Components vs Client Components

**Server Components（デフォルト）:**
- データフェッチ
- SEO重視のコンテンツ
- 静的なUI

**Client Components（"use client"指定）:**
- インタラクティブなUI
- ブラウザAPIの使用
- 状態管理が必要な場合

## コンポーネント設計原則

### コンポーネント分類

#### 1. UIコンポーネント (`components/ui/`)
- **責務**: 汎用的な表示・インタラクション
- **特徴**: ビジネスロジックを含まない、再利用可能
- **例**: Button, Input, Modal, Card

#### 2. レイアウトコンポーネント (`components/layout/`)
- **責務**: ページレイアウト構造
- **特徴**: アプリ全体で共通の構造
- **例**: Header, Footer, Sidebar, Navigation

#### 3. 機能コンポーネント (`features/{feature}/components/`)
- **責務**: 特定機能の実装
- **特徴**: ビジネスロジックを含む、機能に特化
- **例**: UserProfile, ProductList, CheckoutForm

### 命名規則

- **コンポーネント**: PascalCase（例: `UserProfile.tsx`）
- **フック**: camelCase + use prefix（例: `useAuth.ts`）
- **ユーティリティ**: camelCase（例: `formatDate.ts`）
- **型定義**: PascalCase（例: `User.types.ts`）
- **定数**: UPPER_SNAKE_CASE（例: `API_BASE_URL`）

## 状態管理戦略

### ローカル状態
- `useState` / `useReducer`
- 単一コンポーネント内で完結

### グローバル状態
- React Context API
- または状態管理ライブラリ（Zustand, Jotai等）

### サーバー状態
- 推奨: React Query / SWR
- キャッシュ・再フェッチ管理

## ルーティング

### App Router構造例

```
src/app/
├── layout.tsx              # ルートレイアウト
├── page.tsx                # / (ホーム)
├── (marketing)/            # ルートグループ（URLに含まれない）
│   ├── about/
│   │   └── page.tsx        # /about
│   └── contact/
│       └── page.tsx        # /contact
├── dashboard/
│   ├── layout.tsx          # ダッシュボードレイアウト
│   ├── page.tsx            # /dashboard
│   └── settings/
│       └── page.tsx        # /dashboard/settings
└── api/                    # APIルート
    └── health/
        └── route.ts        # /api/health
```

## スタイリング戦略

### Tailwind CSS 4
- ユーティリティファーストのアプローチ
- `@tailwindcss/postcss` プラグイン使用
- `globals.css` でカスタムスタイル定義可能

### スタイル優先順位
1. Tailwindユーティリティクラス
2. CSS Modules（コンポーネント固有のスタイル）
3. グローバルCSS（最小限に抑える）

## パフォーマンス最適化

### 必須対応
- ✅ Next.js Image コンポーネント使用
- ✅ 動的インポート（`next/dynamic`）
- ✅ React.memo / useMemo / useCallback の適切な使用
- ✅ フォント最適化（`next/font`）

### Turbopack活用
- 開発時の高速なHMR
- ビルド時間の短縮

## セキュリティ

### 環境変数管理
- `.env.local` に機密情報を保存
- `NEXT_PUBLIC_` プレフィックスでクライアント公開
- `.env.example` でテンプレート提供

### 必須対策
- ユーザー入力の検証・サニタイゼーション
- CSRF対策
- XSS対策（React のデフォルト保護を活用）
- 適切なCORS設定

## デプロイメント

### 推奨プラットフォーム
- **Vercel** - Next.js最適化済み
- **Netlify** - 静的サイト
- **AWS / GCP / Azure** - フルコントロール

### ビルドコマンド
```bash
npm run build
npm run start
```

## 参考リソース

- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [React公式ドキュメント](https://react.dev)
- [Tailwind CSS公式ドキュメント](https://tailwindcss.com/docs)
- [プロジェクト開発規約](../../rule/rule.md)

---

**最終更新**: 2025-11-22
