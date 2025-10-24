
import React from 'react';
import type { GeminiAnswer } from '../../types';
import { AnswerDisplay } from '../AnswerDisplay';
import { SourceList } from '../SourceList';
import { RelatedSearches } from './RelatedSearches';

interface SearchResultsPanelProps {
  query: string;
  answer: GeminiAnswer;
  onNewSearch: (query: string) => void;
}

export const SearchResultsPanel: React.FC<SearchResultsPanelProps> = ({ query, answer, onNewSearch }) => {
  return (
    <div className="space-y-10">
      <AnswerDisplay query={query} answer={answer.text} />
      <SourceList sources={answer.sources} />
      <RelatedSearches searches={answer.relatedSearches} onSearch={onNewSearch} />
    </div>
  );
};