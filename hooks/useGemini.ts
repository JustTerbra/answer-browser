
import { useState, useCallback } from 'react';
import { getAnswerFromGemini } from '../services/geminiService';
import type { GeminiAnswer } from '../types';

export const useGemini = () => {
  const [data, setData] = useState<GeminiAnswer | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateAnswer = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await getAnswerFromGemini(query);
      setData(result);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, error, generateAnswer };
};
