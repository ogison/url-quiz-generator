'use client';

import { FC, FormEvent, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Difficulty } from '@/types/quiz.types';

interface UrlInputFormProps {
  onSubmit: (data: {
    url: string;
    difficulty: Difficulty;
    questionCount: number;
  }) => void;
  isLoading?: boolean;
}

export const UrlInputForm: FC<UrlInputFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [url, setUrl] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [questionCount, setQuestionCount] = useState(5);
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url) {
      setError('URLを入力してください');
      return;
    }

    try {
      new URL(url);
    } catch {
      setError('有効なURLを入力してください');
      return;
    }

    onSubmit({ url, difficulty, questionCount });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6">
      <Input
        label="WebページのURL"
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com"
        error={error}
        disabled={isLoading}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          難易度
        </label>
        <div className="flex gap-4">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
            <label key={level} className="flex items-center">
              <input
                type="radio"
                value={level}
                checked={difficulty === level}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                disabled={isLoading}
                className="mr-2"
              />
              {level === 'easy' && '初級'}
              {level === 'medium' && '中級'}
              {level === 'hard' && '上級'}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="questionCount"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          問題数
        </label>
        <select
          id="questionCount"
          value={questionCount}
          onChange={(e) => setQuestionCount(Number(e.target.value))}
          disabled={isLoading}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          {[3, 5, 7, 10].map((count) => (
            <option key={count} value={count}>
              {count}問
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" isLoading={isLoading} className="w-full">
        クイズを生成
      </Button>
    </form>
  );
};
