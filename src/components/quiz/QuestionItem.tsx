'use client';

import { FC, useState } from 'react';
import { Question } from '@/types/quiz.types';
import clsx from 'clsx';

interface QuestionItemProps {
  question: Question;
  questionNumber: number;
  userAnswer: number;
  isCorrect: boolean;
}

export const QuestionItem: FC<QuestionItemProps> = ({
  question,
  questionNumber,
  userAnswer,
  isCorrect,
}) => {
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div className="border-b border-gray-200 pb-4 last:border-b-0">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">
            Q{questionNumber}. {question.question}
          </h3>
        </div>
        <div
          className={clsx(
            'flex items-center ml-4',
            isCorrect ? 'text-green-600' : 'text-red-600'
          )}
        >
          {isCorrect ? (
            <span className="text-2xl">✅</span>
          ) : (
            <span className="text-2xl">❌</span>
          )}
        </div>
      </div>

      <div className="mt-2 space-y-1 text-sm">
        <p className="text-gray-600">
          あなたの回答: {question.options[userAnswer]}
        </p>
        {!isCorrect && (
          <p className="text-green-600">
            正解: {question.options[question.correctAnswer]}
          </p>
        )}
      </div>

      <button
        onClick={() => setShowExplanation(!showExplanation)}
        className="mt-3 text-sm text-blue-600 hover:text-blue-700 underline"
      >
        {showExplanation ? '解説を閉じる' : '解説を見る'}
      </button>

      {showExplanation && (
        <div className="mt-3 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700">{question.explanation}</p>
        </div>
      )}
    </div>
  );
};
