# よくあるタスクのガイド

このドキュメントは、Claude Codeが頻繁に実行するタスクの標準的な手順をまとめたものです。

## 📋 目次

1. [新規コンポーネント作成](#新規コンポーネント作成)
2. [新規ページ追加](#新規ページ追加)
3. [APIルート追加](#apiルート追加)
4. [カスタムフック作成](#カスタムフック作成)
5. [機能モジュール追加](#機能モジュール追加)
6. [環境変数追加](#環境変数追加)
7. [バグ修正](#バグ修正)
8. [リファクタリング](#リファクタリング)

---

## 新規コンポーネント作成

### UIコンポーネントの場合

**チェックリスト:**
- [ ] `src/components/ui/` 配下に配置
- [ ] PascalCaseで命名
- [ ] TypeScript型定義を含める
- [ ] 再利用可能な設計
- [ ] ビジネスロジックを含めない

**手順:**

```bash
# 1. ファイル作成場所の確認
# src/components/ui/{ComponentName}.tsx

# 2. コンポーネント作成テンプレート
```

```typescript
// src/components/ui/Card.tsx
import { FC, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export const Card: FC<CardProps> = ({ children, title, className = '' }) => {
  return (
    <div className={`rounded-lg border bg-white p-6 shadow-sm ${className}`}>
      {title && <h3 className="mb-4 text-lg font-semibold">{title}</h3>}
      {children}
    </div>
  );
};
```

```bash
# 3. 使用例を確認
# src/app/page.tsx などでインポートして使用
```

### 機能固有のコンポーネントの場合

**チェックリスト:**
- [ ] `src/features/{feature-name}/components/` 配下に配置
- [ ] ビジネスロジックを含めてOK
- [ ] 機能内のみで使用

**手順:**

```bash
# 1. 機能ディレクトリの確認・作成
mkdir -p src/features/{feature-name}/components

# 2. コンポーネント作成
```

```typescript
// src/features/user-profile/components/ProfileCard.tsx
import { FC } from 'react';
import { Card } from '@/components/ui/Card';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface ProfileCardProps {
  user: User;
  onEdit?: () => void;
}

export const ProfileCard: FC<ProfileCardProps> = ({ user, onEdit }) => {
  return (
    <Card title="User Profile">
      <div className="flex items-center gap-4">
        {user.avatar && (
          <img
            src={user.avatar}
            alt={user.name}
            className="h-16 w-16 rounded-full"
          />
        )}
        <div>
          <h4 className="font-semibold">{user.name}</h4>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
      </div>
      {onEdit && (
        <button
          onClick={onEdit}
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Edit Profile
        </button>
      )}
    </Card>
  );
};
```

---

## 新規ページ追加

### 基本ページの場合

**チェックリスト:**
- [ ] `src/app/` 配下に配置
- [ ] kebab-caseでディレクトリ命名
- [ ] `page.tsx` ファイルを作成
- [ ] 必要に応じて `layout.tsx` を作成
- [ ] metadata を設定

**手順:**

```bash
# 1. ディレクトリ作成
mkdir -p src/app/about

# 2. page.tsx作成
```

```typescript
// src/app/about/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about our company',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-3xl font-bold">About Us</h1>
      <p className="text-gray-700">
        This is the about page content.
      </p>
    </div>
  );
}
```

### 動的ルートの場合

```bash
# 1. 動的パラメータを含むディレクトリ作成
mkdir -p src/app/posts/[id]
```

```typescript
// src/app/posts/[id]/page.tsx
interface PostPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;

  // データフェッチ
  const post = await fetchPost(id);

  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  );
}

// メタデータ生成
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await fetchPost(id);

  return {
    title: post.title,
    description: post.excerpt,
  };
}
```

---

## APIルート追加

**チェックリスト:**
- [ ] `src/app/api/` 配下に配置
- [ ] `route.ts` ファイルを作成
- [ ] エラーハンドリングを実装
- [ ] 適切なHTTPステータスコードを返す
- [ ] 型安全なレスポンス

**手順:**

```bash
# 1. APIディレクトリ作成
mkdir -p src/app/api/users
```

```typescript
// src/app/api/users/route.ts
import { NextResponse } from 'next/server';

// GET /api/users
export async function GET() {
  try {
    // データ取得ロジック
    const users = await fetchUsers();

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // バリデーション
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // ユーザー作成ロジック
    const user = await createUser(body);

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error('Failed to create user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
```

### 動的APIルート

```typescript
// src/app/api/users/[id]/route.ts
interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    const user = await fetchUserById(id);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error(`Failed to fetch user ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}
```

---

## カスタムフック作成

**チェックリスト:**
- [ ] `src/hooks/` 配下に配置
- [ ] camelCase + use prefix で命名
- [ ] 型安全な戻り値
- [ ] エラーハンドリング
- [ ] 必要に応じてクリーンアップ処理

**手順:**

```bash
# 1. hooksディレクトリ作成（存在しない場合）
mkdir -p src/hooks
```

### データフェッチフック例

```typescript
// src/hooks/useUsers.ts
import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/users');

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data.users);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
};
```

### ローカルストレージフック例

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

---

## 機能モジュール追加

**チェックリスト:**
- [ ] `src/features/{feature-name}/` 配下に配置
- [ ] 必要なサブディレクトリを作成
- [ ] `index.ts` でエクスポート

**手順:**

```bash
# 1. 機能ディレクトリ構造作成
mkdir -p src/features/todo-list/{components,hooks,utils,types}
```

```typescript
// src/features/todo-list/types/index.ts
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

// src/features/todo-list/hooks/useTodos.ts
import { useState } from 'react';
import type { Todo } from '../types';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (title: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: new Date(),
    };
    setTodos([...todos, newTodo]);
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  return { todos, addTodo, toggleTodo };
};

// src/features/todo-list/components/TodoList.tsx
'use client';

import { FC } from 'react';
import { useTodos } from '../hooks/useTodos';

export const TodoList: FC = () => {
  const { todos, addTodo, toggleTodo } = useTodos();

  return (
    <div>
      <h2>Todo List</h2>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span>{todo.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// src/features/todo-list/index.ts
export { TodoList } from './components/TodoList';
export { useTodos } from './hooks/useTodos';
export type { Todo } from './types';
```

---

## 環境変数追加

**チェックリスト:**
- [ ] `.env.example` に追加（値は空）
- [ ] `.env.local` に実際の値を追加
- [ ] 公開する場合は `NEXT_PUBLIC_` プレフィックス
- [ ] 型定義（オプション）

**手順:**

```bash
# 1. .env.exampleに追加
echo "NEXT_PUBLIC_API_URL=" >> .env.example
echo "API_SECRET_KEY=" >> .env.example

# 2. .env.localに実際の値を追加
echo "NEXT_PUBLIC_API_URL=https://api.example.com" >> .env.local
echo "API_SECRET_KEY=your-secret-key" >> .env.local
```

```typescript
// 3. 設定ファイルで使用
// src/lib/config.ts
export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000',
  apiSecretKey: process.env.API_SECRET_KEY,
} as const;

// 4. 型定義（オプション）
// src/types/env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_URL: string;
    API_SECRET_KEY: string;
  }
}
```

---

## バグ修正

**手順:**

1. **再現確認**
   ```bash
   # 再現手順を確認
   # エラーメッセージを記録
   ```

2. **原因調査**
   ```bash
   # 関連ファイルを読む
   # ログを確認
   # 型エラーを確認
   ```

3. **修正実装**
   ```typescript
   // 最小限の変更で修正
   // 副作用がないか確認
   ```

4. **動作確認**
   ```bash
   # 修正箇所が動作することを確認
   # 関連機能が壊れていないか確認
   ```

---

## リファクタリング

**原則:**
- 動作を変えない
- 一度に1つの変更
- テストがある場合は先に実行

**よくあるパターン:**

### コンポーネント分割

```typescript
// Before: 大きすぎるコンポーネント
export const UserDashboard = () => {
  // 200行のコード...
};

// After: 小さなコンポーネントに分割
export const UserDashboard = () => {
  return (
    <>
      <UserHeader />
      <UserStats />
      <UserActivity />
    </>
  );
};
```

### 重複コードの共通化

```typescript
// Before: 重複したロジック
const formatUserName = (user) => `${user.firstName} ${user.lastName}`;
const formatAdminName = (admin) => `${admin.firstName} ${admin.lastName}`;

// After: 共通関数化
const formatFullName = (person: { firstName: string; lastName: string }) =>
  `${person.firstName} ${person.lastName}`;
```

---

## 🔍 タスク実行前のチェックリスト

すべてのタスクに共通:

- [ ] 関連ファイルを読んで既存コードを理解
- [ ] 命名規則に従っている
- [ ] 型安全性を確保
- [ ] 適切なディレクトリに配置
- [ ] 環境変数はハードコーディングしない
- [ ] エラーハンドリングを実装
- [ ] 不要なコメント・console.logを削除

---

**参考:**
- [アーキテクチャ概要](./architecture.md)
- [コーディング規約](./conventions.md)
- [詳細な開発規約](../../rule/rule.md)

**最終更新**: 2025-11-22
