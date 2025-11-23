'use client';

import { useRouter } from 'next/navigation';
import { UrlInputForm } from '@/features/quiz/components/UrlInputForm';
import { useQuizGeneration } from '@/features/quiz/hooks/useQuizGeneration';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useEffect } from 'react';

const features = [
  {
    title: 'URL入力するだけ',
    description:
      'Webページのコンテンツを自動解析。面倒な設定は不要で、すぐにクイズを開始できます。',
  },
  {
    title: 'AIが自動生成',
    description:
      'Gemini APIを活用し、ページの内容に基づいた高品質なクイズ問題を自動生成します。',
  },
  {
    title: '理解度をチェック',
    description:
      'クイズ結果から理解度レベルを判定。学習の進捗を可視化できます。',
  },
];

export default function Home() {
  const router = useRouter();
  const { generateQuiz, quiz, isLoading, error } = useQuizGeneration();

  useEffect(() => {
    if (quiz) {
      sessionStorage.setItem(`quiz_${quiz.quizId}`, JSON.stringify(quiz));
      router.push(`/quiz/${quiz.quizId}`);
    }
  }, [quiz, router]);

  const handleSubmit = (data: {
    url: string;
    difficulty: 'easy' | 'medium' | 'hard';
    questionCount: number;
  }) => {
    generateQuiz(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-4xl px-4 py-8 md:py-16">
        <section className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            URL Quiz Generator
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-2">
            サイトの理解度をクイズでチェック！
          </p>
          <p className="text-base text-gray-500">
            URLを入力するだけで、そのWebページの内容に基づいたクイズを自動生成します
          </p>
        </section>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <LoadingSpinner size="lg" text="クイズを生成中..." />
            <p className="mt-4 text-sm text-gray-500">
              最大30秒かかる場合があります
            </p>
          </div>
        ) : (
          <section className="mb-16">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <UrlInputForm onSubmit={handleSubmit} isLoading={isLoading} />
              {error && (
                <div
                  className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
                  role="alert"
                >
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
            </div>
          </section>
        )}

        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            使い方
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">URL入力</h3>
              <p className="text-sm text-gray-600">
                クイズを作成したいWebページのURLを入力します
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">設定選択</h3>
              <p className="text-sm text-gray-600">
                難易度と問題数を選択してクイズを生成します
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">クイズに挑戦</h3>
              <p className="text-sm text-gray-600">
                生成されたクイズに回答して理解度をチェック
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            特徴
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 py-8 mt-16">
        <div className="mx-auto max-w-4xl px-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} URL Quiz Generator. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
}
