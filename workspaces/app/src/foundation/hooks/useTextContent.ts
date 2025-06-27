import { useCallback, useState } from 'react';

type TextType = 'term' | 'contact' | 'question' | 'company' | 'overview';

export const useTextContent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTextContent = useCallback(async (type: TextType): Promise<string> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/texts/${type}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${type} content`);
      }
      const data = await response.json();
      return data.content;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    error,
    fetchTextContent,
    loading,
  };
};
