'use client';

import { useState } from 'react';
import { Question } from '@/types/quiz.types';

interface UseQuizAnswerReturn {
  currentQuestionIndex: number;
  answers: (number | null)[];
  selectAnswer: (questionIndex: number, answerIndex: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isCompleted: boolean;
}

export const useQuizAnswer = (
  questions: Question[]
): UseQuizAnswerReturn => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );

  const selectAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const canGoNext = currentQuestionIndex < questions.length - 1;
  const canGoPrevious = currentQuestionIndex > 0;
  const isCompleted = answers.every((answer) => answer !== null);

  return {
    currentQuestionIndex,
    answers,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    canGoNext,
    canGoPrevious,
    isCompleted,
  };
};
