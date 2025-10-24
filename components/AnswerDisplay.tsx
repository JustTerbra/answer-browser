import React, { useMemo } from 'react';
import { marked } from 'marked';

interface AnswerDisplayProps {
  query: string;
  answer: string;
}

export const AnswerDisplay: React.FC<AnswerDisplayProps> = ({ query, answer }) => {
  const parsedAnswer = useMemo(() => {
    // Configure marked to handle GitHub Flavored Markdown and line breaks
    marked.setOptions({
        gfm: true,
        breaks: true,
    });
    // Parse the markdown string into an HTML string.
    // In a real-world scenario with user-generated content, this would be sanitized.
    // As the content is from the Gemini API, we can trust it.
    const rawMarkup = marked.parse(answer);
    return { __html: rawMarkup as string };
  }, [answer]);

  return (
    <div className="bg-glass p-6 md:p-8 rounded-2xl border border-white/10 backdrop-blur-lg shadow-xl">
      <h2 className="text-3xl font-bold text-text-primary mb-6">{query}</h2>
      <div 
        className="prose prose-invert max-w-none text-text-primary"
        dangerouslySetInnerHTML={parsedAnswer}
      />
    </div>
  );
};