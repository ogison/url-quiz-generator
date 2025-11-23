'use client';

import { FC } from 'react';
import { Card } from '@/components/ui/Card';
import { Question } from '@/types/quiz.types';
import clsx from 'clsx';

interface QuizCardProps {
  question: Question;
  questionNumber: number;
  selectedAnswer: number | null;
  onSelectAnswer: (answerIndex: number) => void;
  disabled?: boolean;
}

export const QuizCard: FC<QuizCardProps> = ({
  question,
  questionNumber,
  selectedAnswer,
  onSelectAnswer,
  disabled = false,
}) => {
  return (
    <Card>
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Q{questionNumber}. {question.question}
        </h2>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <label
              key={index}
              className={clsx(
                'flex items-center p-4',
                'border-2 rounded-lg',
                'cursor-pointer transition-all duration-200',
                selectedAnswer === index
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={index}
                checked={selectedAnswer === index}
                onChange={() => onSelectAnswer(index)}
                disabled={disabled}
                className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="ml-3 text-base text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>
    </Card>
  );
};
