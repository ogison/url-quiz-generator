import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI: GoogleGenerativeAI | null = null;

const getGenAI = () => {
  if (genAI) return genAI;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set');
  }

  genAI = new GoogleGenerativeAI(apiKey);
  return genAI;
};

export const getGenerativeModel = () => {
  return getGenAI().getGenerativeModel({ model: 'gemini-pro' });
};
