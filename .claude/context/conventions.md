# コーディング規約

このドキュメントは、Claude Codeがコードを生成・修正する際に従うべき規約をまとめたものです。

## 📚 メイン規約ドキュメント

詳細な開発規約は **[rule/rule.md](../../rule/rule.md)** を参照してください。

このファイルには以下の内容が含まれています:
- プロジェクト構造
- 命名規則（ファイル、変数、関数、型）
- コンポーネント設計
- スタイリング規則
- パフォーマンス最適化
- セキュリティ規則
- 状態管理
- テスト規約
- Gitコミット規約

## 🎯 Claude Code使用時の重要ルール

### 必須事項（MUST）

#### 1. 既存コードの確認
```markdown
✅ DO: 変更前に必ず対象ファイルを読む
❌ DON'T: 読まずに変更を提案する
```

#### 2. 型安全性の厳守
```typescript
✅ DO: 厳格な型定義
interface User {
  id: string;
  name: string;
  email: string;
}

❌ DON'T: any型の使用
const user: any = { ... };  // 禁止

⚠️ 必要な場合はunknownを使用
const data: unknown = await fetchData();
if (isUser(data)) {
  // 型ガードで安全に使用
}
```

#### 3. 規約に沿ったファイル配置
```
✅ DO: 機能ベースで整理
src/features/user-profile/
├── components/
├── hooks/
└── index.ts

❌ DON'T: appディレクトリに直接配置
src/app/UserProfile.tsx  // 禁止
```

#### 4. インポートパスエイリアスの使用
```typescript
✅ DO: @/でsrcルートを参照
import { Button } from '@/components/ui/Button';

❌ DON'T: 相対パスの乱用
import { Button } from '../../../../components/ui/Button';
```

### 命名規則クイックリファレンス

| 対象 | 規則 | 例 |
|------|------|-----|
| **コンポーネント** | PascalCase | `UserProfile.tsx` |
| **カスタムフック** | camelCase + use | `useAuth.ts` |
| **ユーティリティ関数** | camelCase | `formatDate.ts` |
| **型定義** | PascalCase | `User.types.ts` |
| **定数** | UPPER_SNAKE_CASE | `API_BASE_URL` |
| **appディレクトリ** | kebab-case | `user-profile/page.tsx` |

### コンポーネント作成テンプレート

```typescript
// src/components/ui/Button.tsx
import { FC, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
```

### カスタムフック作成テンプレート

```typescript
// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving localStorage key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue] as const;
};
```

## 🚫 禁止事項（DON'T）

### 絶対に避けるべきパターン

1. **any型の使用**
   ```typescript
   ❌ const data: any = await fetch(...);
   ✅ const data: unknown = await fetch(...);
   ```

2. **環境変数のハードコーディング**
   ```typescript
   ❌ const apiKey = "sk-1234567890";
   ✅ const apiKey = process.env.API_KEY;
   ```

3. **console.logの残存**
   ```typescript
   ❌ console.log('debug info');  // 本番コードに残さない
   ✅ // 削除するか、適切なロガーを使用
   ```

4. **未使用のimport**
   ```typescript
   ❌ import { useState, useEffect, useMemo } from 'react';  // useMemo未使用
   ✅ import { useState, useEffect } from 'react';
   ```

5. **200行を超える単一コンポーネント**
   ```typescript
   ❌ // 500行のコンポーネント
   ✅ // 小さなコンポーネントに分割
   ```

## ✅ 推奨パターン（DO）

### 1. Server ComponentとClient Componentの適切な使い分け

```typescript
// ✅ Server Component（デフォルト）
// src/app/posts/page.tsx
export default async function PostsPage() {
  const posts = await fetchPosts();  // サーバーで実行

  return (
    <div>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

// ✅ Client Component（インタラクション必要時のみ）
// src/components/ui/InteractiveButton.tsx
'use client';

import { useState } from 'react';

export const InteractiveButton = () => {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
};
```

### 2. エラーハンドリング

```typescript
// ✅ API Route例
// src/app/api/users/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const users = await fetchUsers();
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
```

### 3. 環境変数の使用

```typescript
// ✅ src/lib/config.ts
export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000',
  isDev: process.env.NODE_ENV === 'development',
} as const;

// 使用例
import { config } from '@/lib/config';

const response = await fetch(`${config.apiUrl}/api/users`);
```

## 🎨 スタイリング規約

### Tailwind CSS使用時

```tsx
// ✅ DO: セマンティックなクラス名の組み合わせ
<button className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
  Click me
</button>

// ✅ DO: 条件付きクラス（clsxやcn使用推奨）
<div className={cn(
  "base-classes",
  isActive && "active-classes",
  variant === 'primary' && "primary-classes"
)}>
```

## 📦 Import順序

```typescript
// 1. 外部ライブラリ
import { FC } from 'react';
import { useRouter } from 'next/navigation';

// 2. 内部モジュール（@/エイリアス）
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

// 3. 相対パス
import { formatDate } from './utils';

// 4. 型定義
import type { User } from '@/types/User';

// 5. スタイル
import styles from './Component.module.css';
```

## 🔍 コードレビューチェックリスト

Claude Codeがコードを生成・変更した後、自動的に確認すべき項目:

- [ ] TypeScriptエラーがない
- [ ] ESLintエラーがない
- [ ] 未使用のimportがない
- [ ] console.logが残っていない
- [ ] any型を使用していない
- [ ] 環境変数がハードコーディングされていない
- [ ] 命名規則に従っている
- [ ] 適切なディレクトリに配置されている
- [ ] コメントが適切に記載されている（必要な場合）
- [ ] アクセシビリティに配慮している

## 📖 追加リソース

- **詳細な規約**: [rule/rule.md](../../rule/rule.md)
- **アーキテクチャ**: [architecture.md](./architecture.md)
- **よくあるタスク**: [common-tasks.md](./common-tasks.md)

---

**重要**: このドキュメントと [rule/rule.md](../../rule/rule.md) の内容に矛盾がある場合は、rule/rule.md を優先してください。

**最終更新**: 2025-11-22
