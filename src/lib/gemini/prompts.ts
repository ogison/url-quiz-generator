import { Difficulty, Language } from '@/types/quiz.types';

interface QuizPromptParams {
  title: string;
  url: string;
  content: string;
  questionCount: number;
  difficulty: Difficulty;
  language: Language;
}

const difficultyDescriptions: Record<Difficulty, string> = {
  easy: '基本的な内容で、初心者でも理解しやすい問題',
  medium: '中級レベルで、内容の理解を深めるための問題',
  hard: '上級レベルで、深い理解と応用力を問う問題',
};

export const generateQuizPrompt = (params: QuizPromptParams): string => {
  const { title, url, content, questionCount, difficulty, language } = params;

  return `
あなたは教育コンテンツの専門家です。以下のWebページの内容を解析し、読者の理解度を測るクイズを生成してください。

【Webページ情報】
タイトル: ${title}
URL: ${url}
本文:
${content}

【クイズ生成要件】
- 問題数: ${questionCount}問
- 難易度: ${difficulty} (${difficultyDescriptions[difficulty]})
- 言語: ${language === 'ja' ? '日本語' : '英語'}
- 形式: 4択問題（正解は必ず1つのみ）

【問題作成のガイドライン】
1. ページの主要なトピックや重要な概念に焦点を当てる
2. 事実、数値、定義、原因と結果などを問題化する
3. 選択肢は明確で、紛らわしくないようにする
4. すべての選択肢が文法的に正しく、長さも同程度にする
5. 正解以外の選択肢も、もっともらしい内容にする
6. 各問題に簡潔で分かりやすい解説を付ける

【出力形式】
以下のJSON形式で出力してください。他の説明文は一切含めず、JSONのみを出力してください。

{
  "questions": [
    {
      "question": "問題文をここに記述",
      "options": [
        "選択肢1",
        "選択肢2",
        "選択肢3",
        "選択肢4"
      ],
      "correctAnswer": 0,
      "explanation": "正解の理由や補足説明をここに記述"
    }
  ]
}

※correctAnswerは0から3の数値で、optionsの配列インデックスを指定してください。
`.trim();
};
