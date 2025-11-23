import { ComprehensionLevel } from '@/types/quiz.types';

/**
 * スコア計算（0-100点）
 */
export const calculateScore = (
  correctCount: number,
  totalCount: number
): number => {
  if (totalCount === 0) return 0;
  return Math.round((correctCount / totalCount) * 100);
};

/**
 * 理解度レベルの判定
 */
export const determineComprehensionLevel = (
  score: number
): ComprehensionLevel => {
  if (score >= 80) return 'advanced';
  if (score >= 60) return 'intermediate';
  return 'beginner';
};

/**
 * パーセンテージの計算
 */
export const calculatePercentage = (
  value: number,
  total: number
): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};
