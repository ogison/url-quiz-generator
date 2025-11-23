import { Quiz, QuizResult } from '@/types/quiz.types';

const QUIZ_STORAGE_KEY = 'quiz_data';
const RESULT_STORAGE_KEY = 'quiz_results';

export const saveQuiz = (quiz: Quiz): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${QUIZ_STORAGE_KEY}_${quiz.id}`, JSON.stringify(quiz));
};

export const getQuiz = (quizId: string): Quiz | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(`${QUIZ_STORAGE_KEY}_${quizId}`);
  return data ? JSON.parse(data) : null;
};

export const saveResult = (result: QuizResult): void => {
  if (typeof window === 'undefined') return;
  const results = getResults();
  results.push(result);
  localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(results));
};

export const getResults = (): QuizResult[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(RESULT_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};
