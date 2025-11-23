'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { GenerateQuizResponse } from '@/types/api.types';
import { ResultSummary } from '@/components/quiz/ResultSummary';
import { QuestionItem } from '@/components/quiz/QuestionItem';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ComprehensionLevel } from '@/types/quiz.types';

interface QuizResult {
  quizId: string;
  answers: (number | null)[];
  score: number;
  correctCount: number;
  totalCount: number;
  comprehensionLevel: ComprehensionLevel;
  completedAt: string;
}

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<GenerateQuizResponse | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    const quizData = sessionStorage.getItem(`quiz_${params.id}`);
    const resultData = sessionStorage.getItem(`result_${params.id}`);

    if (quizData && resultData) {
      setQuiz(JSON.parse(quizData));
      setResult(JSON.parse(resultData));
    } else {
      router.push('/');
    }
  }, [params.id, router]);

  if (!quiz || !result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">結果を読み込んでいます...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <ResultSummary
            score={result.score}
            correctCount={result.correctCount}
            totalCount={result.totalCount}
            comprehensionLevel={result.comprehensionLevel}
          />
        </div>

        <div className="mb-8">
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              問題一覧
            </h2>
            <div className="space-y-6">
              {quiz.questions.map((question, index) => (
                <QuestionItem
                  key={question.id}
                  question={question}
                  questionNumber={index + 1}
                  userAnswer={result.answers[index] as number}
                  isCorrect={
                    result.answers[index] === question.correctAnswer
                  }
                />
              ))}
            </div>
          </Card>
        </div>

        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => router.push('/')}>
            新しいクイズ
          </Button>
        </div>
      </div>
    </div>
  );
}
