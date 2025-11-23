'use client';

import { FC } from 'react';
import { Card } from '@/components/ui/Card';
import { ComprehensionLevel } from '@/types/quiz.types';
import clsx from 'clsx';

interface ResultSummaryProps {
  score: number;
  correctCount: number;
  totalCount: number;
  comprehensionLevel: ComprehensionLevel;
}

const levelLabels: Record<ComprehensionLevel, string> = {
  beginner: '初級',
  intermediate: '中級',
  advanced: '上級',
};

const levelColors: Record<ComprehensionLevel, string> = {
  beginner: 'text-yellow-600 bg-yellow-100',
  intermediate: 'text-blue-600 bg-blue-100',
  advanced: 'text-green-600 bg-green-100',
};

export const ResultSummary: FC<ResultSummaryProps> = ({
  score,
  correctCount,
  totalCount,
  comprehensionLevel,
}) => {
  return (
    <Card className="text-center">
      <div className="space-y-6">
        <div className="text-6xl mb-4">
          {score >= 80 ? '🎉' : score >= 60 ? '👍' : '📚'}
        </div>

        <h2 className="text-3xl font-bold text-gray-900">
          {score >= 80 ? '素晴らしい！' : score >= 60 ? 'よくできました！' : '頑張りましょう！'}
        </h2>

        <div className="inline-block p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
          <div className="text-6xl font-bold text-blue-600">{score}点</div>
        </div>

        <div className="flex justify-center gap-8 text-lg">
          <div>
            <span className="text-gray-600">正解数: </span>
            <span className="font-semibold text-gray-900">
              {correctCount}/{totalCount}問
            </span>
          </div>
          <div>
            <span className="text-gray-600">理解度: </span>
            <span
              className={clsx(
                'inline-block px-3 py-1 rounded-full font-medium',
                levelColors[comprehensionLevel]
              )}
            >
              {levelLabels[comprehensionLevel]}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
