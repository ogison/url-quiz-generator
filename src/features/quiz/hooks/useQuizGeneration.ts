'use client';

import { useState } from 'react';
import { GenerateQuizRequest, GenerateQuizResponse } from '@/types/api.types';

interface UseQuizGenerationReturn {
  generateQuiz: (request: GenerateQuizRequest) => Promise<void>;
  quiz: GenerateQuizResponse | null;
  isLoading: boolean;
  error: string | null;
}

export const useQuizGeneration = (): UseQuizGenerationReturn => {
  const [quiz, setQuiz] = useState<GenerateQuizResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuiz = async (request: GenerateQuizRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'クイズの生成に失敗しました');
      }

      const data: GenerateQuizResponse = await response.json();
      setQuiz(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return { generateQuiz, quiz, isLoading, error };
};
