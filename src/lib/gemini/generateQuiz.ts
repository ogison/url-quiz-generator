import { getGenerativeModel } from './client';
import { generateQuizPrompt } from './prompts';
import { Question, Difficulty, Language } from '@/types/quiz.types';
import { v4 as uuidv4 } from 'uuid';

interface GenerateQuizParams {
  title: string;
  url: string;
  content: string;
  questionCount: number;
  difficulty: Difficulty;
  language: Language;
}

interface GeminiQuizResponse {
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>;
}

export const generateQuizWithGemini = async (
  params: GenerateQuizParams
): Promise<Question[]> => {
  try {
    const model = getGenerativeModel();
    const prompt = generateQuizPrompt(params);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // JSONの抽出（Geminiが余計なテキストを含める場合があるため）
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini API');
    }

    const parsed: GeminiQuizResponse = JSON.parse(jsonMatch[0]);

    // バリデーション
    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error('Invalid questions format');
    }

    // Question型に変換
    const questions: Question[] = parsed.questions.map((q) => ({
      id: uuidv4(),
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    }));

    // バリデーション
    questions.forEach((q, index) => {
      if (q.options.length !== 4) {
        throw new Error(`Question ${index + 1}: Must have exactly 4 options`);
      }
      if (q.correctAnswer < 0 || q.correctAnswer > 3) {
        throw new Error(
          `Question ${index + 1}: correctAnswer must be between 0 and 3`
        );
      }
    });

    return questions;
  } catch (error) {
    console.error('Quiz generation error:', error);
    throw new Error(
      `クイズの生成に失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};
