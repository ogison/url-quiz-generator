'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { GenerateQuizResponse } from '@/types/api.types';
import { QuizCard } from '@/components/quiz/QuizCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { useQuizAnswer } from '@/features/quiz/hooks/useQuizAnswer';
import { calculateScore, determineComprehensionLevel } from '@/utils/scoreCalculator';

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<GenerateQuizResponse | null>(null);

  useEffect(() => {
    const quizData = sessionStorage.getItem(`quiz_${params.id}`);
    if (quizData) {
      setQuiz(JSON.parse(quizData));
    } else {
      router.push('/');
    }
  }, [params.id, router]);

  const quizAnswer = quiz
    ? useQuizAnswer(quiz.questions)
    : {
        currentQuestionIndex: 0,
        answers: [],
        selectAnswer: () => {},
        nextQuestion: () => {},
        previousQuestion: () => {},
        canGoNext: false,
        canGoPrevious: false,
        isCompleted: false,
      };

  const {
    currentQuestionIndex,
    answers,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    canGoNext,
    canGoPrevious,
    isCompleted,
  } = quizAnswer;

  const handleFinish = () => {
    if (!quiz) return;

    const correctCount = answers.filter(
      (answer, index) => answer === quiz.questions[index].correctAnswer
    ).length;

    const score = calculateScore(correctCount, quiz.questions.length);
    const comprehensionLevel = determineComprehensionLevel(score);

    const result = {
      quizId: quiz.quizId,
      answers,
      score,
      correctCount,
      totalCount: quiz.questions.length,
      comprehensionLevel,
      completedAt: new Date().toISOString(),
    };

    sessionStorage.setItem(`result_${quiz.quizId}`, JSON.stringify(result));
    router.push(`/result/${quiz.quizId}`);
  };

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">クイズを読み込んでいます...</p>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8">
          <ProgressBar
            current={currentQuestionIndex + 1}
            total={quiz.questions.length}
          />
        </div>

        <div className="mb-8">
          <QuizCard
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            selectedAnswer={answers[currentQuestionIndex]}
            onSelectAnswer={(answerIndex) =>
              selectAnswer(currentQuestionIndex, answerIndex)
            }
          />
        </div>

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={previousQuestion}
            disabled={!canGoPrevious}
          >
            ← 前へ
          </Button>

          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <Button
              onClick={handleFinish}
              disabled={!isCompleted}
              size="lg"
            >
              完了
            </Button>
          ) : (
            <Button
              onClick={nextQuestion}
              disabled={!canGoNext || answers[currentQuestionIndex] === null}
            >
              次へ →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
