# API設計ガイドライン

このドキュメントは、Next.js App Routerを使用したAPIエンドポイントの設計と実装に関する標準規約を定めたものです。

## 📋 目次

1. [基本原則](#基本原則)
2. [ディレクトリ構造](#ディレクトリ構造)
3. [命名規則](#命名規則)
4. [HTTPメソッドとRESTful設計](#httpメソッドとrestful設計)
5. [リクエスト処理](#リクエスト処理)
6. [レスポンス形式](#レスポンス形式)
7. [エラーハンドリング](#エラーハンドリング)
8. [バリデーション](#バリデーション)
9. [認証・認可](#認証認可)
10. [ステータスコード](#ステータスコード)
11. [セキュリティ](#セキュリティ)
12. [パフォーマンス](#パフォーマンス)
13. [テスト](#テスト)

---

## 基本原則

### 必須事項

1. **型安全性**: TypeScriptの型を活用し、リクエスト・レスポンスの型を明確にする
2. **一貫性**: すべてのAPIで統一されたレスポンス形式を使用
3. **エラーハンドリング**: すべてのエンドポイントで適切なエラー処理を実装
4. **セキュリティ**: 入力検証、認証・認可、CORS設定を徹底
5. **ドキュメント**: APIの仕様をコメントまたは別途ドキュメント化

### 推奨事項

- RESTful設計原則に従う
- APIバージョニング（必要な場合）
- レート制限の実装（公開API）
- キャッシュ戦略の活用
- ロギングの実装

---

## ディレクトリ構造

### 基本構造

```
src/app/api/
├── health/              # ヘルスチェック
│   └── route.ts
├── users/               # ユーザー関連
│   ├── route.ts         # GET /api/users, POST /api/users
│   └── [id]/
│       ├── route.ts     # GET /api/users/:id, PUT /api/users/:id, DELETE /api/users/:id
│       └── posts/
│           └── route.ts # GET /api/users/:id/posts
├── posts/               # 投稿関連
│   ├── route.ts
│   └── [id]/
│       └── route.ts
└── auth/                # 認証関連
    ├── login/
    │   └── route.ts
    ├── logout/
    │   └── route.ts
    └── refresh/
        └── route.ts
```

### バージョニング（必要な場合）

```
src/app/api/
├── v1/
│   ├── users/
│   └── posts/
└── v2/
    ├── users/
    └── posts/
```

---

## 命名規則

### エンドポイント命名

| ルール | 例 | 説明 |
|--------|-----|------|
| **小文字** | `/api/users` | すべて小文字を使用 |
| **複数形** | `/api/posts` | リソースは複数形 |
| **kebab-case** | `/api/user-profiles` | 複数単語はハイフン区切り |
| **階層構造** | `/api/users/[id]/posts` | 関連リソースは階層化 |

### ファイル命名

```typescript
// ✅ 良い例
src/app/api/users/route.ts
src/app/api/users/[id]/route.ts
src/app/api/user-profiles/route.ts

// ❌ 悪い例
src/app/api/Users/route.ts        // 大文字
src/app/api/user/route.ts          // 単数形
src/app/api/user_profiles/route.ts // スネークケース
```

---

## HTTPメソッドとRESTful設計

### 標準的なCRUD操作

| メソッド | エンドポイント | 用途 | レスポンス |
|---------|---------------|------|-----------|
| **GET** | `/api/users` | ユーザー一覧取得 | 200 + データ配列 |
| **GET** | `/api/users/[id]` | 特定ユーザー取得 | 200 + データ / 404 |
| **POST** | `/api/users` | ユーザー作成 | 201 + 作成データ |
| **PUT** | `/api/users/[id]` | ユーザー更新（全体） | 200 + 更新データ |
| **PATCH** | `/api/users/[id]` | ユーザー更新（部分） | 200 + 更新データ |
| **DELETE** | `/api/users/[id]` | ユーザー削除 | 204 / 200 |

### 実装例

```typescript
// src/app/api/users/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// GET /api/users
export async function GET(request: NextRequest) {
  try {
    // クエリパラメータの取得
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '10');

    const users = await fetchUsers({ page, limit });

    return NextResponse.json({
      data: users,
      meta: {
        page,
        limit,
        total: users.length,
      },
    });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // バリデーション
    const validationError = validateUser(body);
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }

    const user = await createUser(body);

    return NextResponse.json(
      { data: user },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
```

```typescript
// src/app/api/users/[id]/route.ts
interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/users/:id
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    const user = await fetchUserById(id);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: user });
  } catch (error) {
    console.error(`Failed to fetch user ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PUT /api/users/:id
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // バリデーション
    const validationError = validateUser(body);
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }

    const user = await updateUser(id, body);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: user });
  } catch (error) {
    console.error(`Failed to update user ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/:id
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    const deleted = await deleteUser(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Failed to delete user ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
```

---

## リクエスト処理

### クエリパラメータ

```typescript
// GET /api/users?page=1&limit=10&sort=name
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = parseInt(searchParams.get('limit') ?? '10');
  const sort = searchParams.get('sort') ?? 'createdAt';

  // バリデーション
  if (page < 1 || limit < 1 || limit > 100) {
    return NextResponse.json(
      { error: 'Invalid pagination parameters' },
      { status: 400 }
    );
  }

  const users = await fetchUsers({ page, limit, sort });

  return NextResponse.json({ data: users });
}
```

### リクエストボディ

```typescript
// POST /api/users
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 型定義
    interface CreateUserRequest {
      name: string;
      email: string;
      password: string;
    }

    const { name, email, password } = body as CreateUserRequest;

    // バリデーション
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const user = await createUser({ name, email, password });

    return NextResponse.json({ data: user }, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      );
    }

    console.error('Failed to create user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
```

### ヘッダー

```typescript
export async function GET(request: NextRequest) {
  // 認証トークンの取得
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // トークン検証
  const user = await verifyToken(token);

  if (!user) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }

  // ...
}
```

---

## レスポンス形式

### 標準レスポンス構造

#### 成功レスポンス

```typescript
// 単一リソース
{
  "data": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com"
  }
}

// 複数リソース（ページネーションあり）
{
  "data": [
    { "id": "1", "name": "User 1" },
    { "id": "2", "name": "User 2" }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}

// 複数リソース（シンプル）
{
  "data": [
    { "id": "1", "name": "User 1" },
    { "id": "2", "name": "User 2" }
  ]
}
```

#### エラーレスポンス

```typescript
// 単一エラー
{
  "error": "User not found"
}

// 詳細エラー
{
  "error": "Validation failed",
  "details": [
    { "field": "email", "message": "Invalid email format" },
    { "field": "password", "message": "Password must be at least 8 characters" }
  ]
}
```

### 型定義例

```typescript
// src/types/api.ts

export interface ApiSuccessResponse<T> {
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ApiErrorResponse {
  error: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
```

### ヘルパー関数

```typescript
// src/lib/api-response.ts

import { NextResponse } from 'next/server';
import type { ApiSuccessResponse, ApiErrorResponse } from '@/types/api';

export function successResponse<T>(
  data: T,
  meta?: ApiSuccessResponse<T>['meta'],
  status = 200
) {
  const response: ApiSuccessResponse<T> = { data };
  if (meta) response.meta = meta;

  return NextResponse.json(response, { status });
}

export function errorResponse(
  error: string,
  status = 500,
  details?: ApiErrorResponse['details']
) {
  const response: ApiErrorResponse = { error };
  if (details) response.details = details;

  return NextResponse.json(response, { status });
}

// 使用例
export async function GET() {
  try {
    const users = await fetchUsers();
    return successResponse(users);
  } catch (error) {
    return errorResponse('Failed to fetch users', 500);
  }
}
```

---

## エラーハンドリング

### 基本パターン

```typescript
export async function GET(request: NextRequest) {
  try {
    const data = await fetchData();
    return NextResponse.json({ data });
  } catch (error) {
    console.error('API Error:', error);

    // 既知のエラー
    if (error instanceof NotFoundError) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message, details: error.details },
        { status: 400 }
      );
    }

    // 未知のエラー
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### カスタムエラークラス

```typescript
// src/lib/errors.ts

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends ApiError {
  constructor(
    message: string,
    public details?: Array<{ field: string; message: string }>
  ) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

// 使用例
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await fetchUserById(id);

    if (!user) {
      throw new NotFoundError('User');
    }

    return NextResponse.json({ data: user });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## バリデーション

### Zodを使用したバリデーション

```bash
npm install zod
```

```typescript
// src/lib/validators/user.ts
import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
```

```typescript
// src/app/api/users/route.ts
import { createUserSchema } from '@/lib/validators/user';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // バリデーション
    const result = createUserSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: result.error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const user = await createUser(result.data);

    return NextResponse.json({ data: user }, { status: 201 });
  } catch (error) {
    console.error('Failed to create user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
```

---

## 認証・認可

### ミドルウェアパターン

```typescript
// src/lib/auth.ts
import { NextRequest, NextResponse } from 'next/server';

export async function authenticate(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return null;
  }

  try {
    // JWTトークンの検証（例）
    const user = await verifyToken(token);
    return user;
  } catch (error) {
    return null;
  }
}

export function requireAuth(
  handler: (request: NextRequest, context: { user: User }) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const user = await authenticate(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return handler(request, { user });
  };
}

// 使用例
export const GET = requireAuth(async (request, { user }) => {
  // userは認証済み
  const data = await fetchUserData(user.id);
  return NextResponse.json({ data });
});
```

### ロールベース認可

```typescript
// src/lib/auth.ts
export function requireRole(roles: string[]) {
  return (
    handler: (request: NextRequest, context: { user: User }) => Promise<NextResponse>
  ) => {
    return async (request: NextRequest) => {
      const user = await authenticate(request);

      if (!user) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      if (!roles.includes(user.role)) {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        );
      }

      return handler(request, { user });
    };
  };
}

// 使用例
export const DELETE = requireRole(['admin'])(async (request, { user }) => {
  // adminロールのみアクセス可能
  await deleteAllUsers();
  return new NextResponse(null, { status: 204 });
});
```

---

## ステータスコード

### 標準的な使用

| コード | 意味 | 使用例 |
|-------|------|--------|
| **200** | OK | GET, PUT, PATCHの成功 |
| **201** | Created | POSTでリソース作成成功 |
| **204** | No Content | DELETEの成功（レスポンスボディなし） |
| **400** | Bad Request | バリデーションエラー |
| **401** | Unauthorized | 認証が必要 |
| **403** | Forbidden | 権限不足 |
| **404** | Not Found | リソースが存在しない |
| **409** | Conflict | リソースの競合（例: 重複メールアドレス） |
| **422** | Unprocessable Entity | セマンティックエラー |
| **429** | Too Many Requests | レート制限超過 |
| **500** | Internal Server Error | サーバーエラー |
| **503** | Service Unavailable | サービス一時停止 |

---

## セキュリティ

### 必須対策

#### 1. 入力検証・サニタイゼーション

```typescript
import { z } from 'zod';

// すべての入力を検証
const schema = z.object({
  email: z.string().email(),
  name: z.string().max(100),
});
```

#### 2. CORS設定

```typescript
// src/app/api/users/route.ts
export async function GET(request: NextRequest) {
  const data = await fetchUsers();

  return NextResponse.json(
    { data },
    {
      headers: {
        'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN ?? '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN ?? '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
```

#### 3. レート制限

```typescript
// src/lib/rate-limit.ts
import { LRUCache } from 'lru-cache';

const ratelimit = new LRUCache({
  max: 500,
  ttl: 60000, // 1分
});

export function rateLimit(identifier: string, limit = 10) {
  const count = (ratelimit.get(identifier) as number) || 0;

  if (count >= limit) {
    return false;
  }

  ratelimit.set(identifier, count + 1);
  return true;
}

// 使用例
export async function POST(request: NextRequest) {
  const ip = request.ip ?? 'unknown';

  if (!rateLimit(ip, 10)) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }

  // ...
}
```

#### 4. 機密情報の除外

```typescript
// パスワードなどを除外
function sanitizeUser(user: User) {
  const { password, ...sanitized } = user;
  return sanitized;
}

export async function GET() {
  const user = await fetchUser();
  return NextResponse.json({ data: sanitizeUser(user) });
}
```

---

## パフォーマンス

### キャッシュ

```typescript
// src/app/api/posts/route.ts
export async function GET() {
  const posts = await fetchPosts();

  return NextResponse.json(
    { data: posts },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      },
    }
  );
}
```

### ページネーション

```typescript
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = parseInt(searchParams.get('limit') ?? '20');

  const offset = (page - 1) * limit;

  const [data, total] = await Promise.all([
    fetchPosts({ offset, limit }),
    countPosts(),
  ]);

  return NextResponse.json({
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
```

---

## テスト

### ユニットテスト例

```typescript
// src/app/api/users/route.test.ts
import { GET, POST } from './route';
import { NextRequest } from 'next/server';

describe('/api/users', () => {
  describe('GET', () => {
    it('should return users list', async () => {
      const request = new NextRequest('http://localhost:3000/api/users');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('data');
      expect(Array.isArray(data.data)).toBe(true);
    });
  });

  describe('POST', () => {
    it('should create a new user', async () => {
      const request = new NextRequest('http://localhost:3000/api/users', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.data).toHaveProperty('id');
    });

    it('should return 400 for invalid data', async () => {
      const request = new NextRequest('http://localhost:3000/api/users', {
        method: 'POST',
        body: JSON.stringify({
          name: '',
          email: 'invalid-email',
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
    });
  });
});
```

---

## ヘルスチェックエンドポイント

```typescript
// src/app/api/health/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // データベース接続チェック（例）
    // await db.ping();

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
```

---

## チェックリスト

新しいAPIエンドポイントを作成する際の確認事項：

- [ ] 適切なHTTPメソッドを使用
- [ ] 型安全なリクエスト・レスポンス
- [ ] 入力バリデーションを実装
- [ ] エラーハンドリングを実装
- [ ] 適切なステータスコードを返す
- [ ] 認証・認可が必要な場合は実装
- [ ] 機密情報を除外
- [ ] CORSヘッダーを設定（必要な場合）
- [ ] レート制限を実装（公開APIの場合）
- [ ] キャッシュ設定（適切な場合）
- [ ] ロギングを実装
- [ ] テストを作成

---

**参考リソース:**
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [REST API Design Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

**最終更新**: 2025-11-22
**バージョン**: 1.0.0
