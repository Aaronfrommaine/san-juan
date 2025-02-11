import React from 'react';
import { Question } from '../../lib/types/questionnaire';

interface QuestionCardProps {
  question: Question;
  onAnswer: (value: string) => void;
}

export default function QuestionCard({ question, onAnswer }: QuestionCardProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
        {question.question}
      </h3>
      <div className="space-y-3">
        {question.options.map((option) => (
          <button
            key={option.value}
            onClick={() => onAnswer(option.value)}
            className="w-full p-4 text-left rounded-lg border border-gray-200 hover:border-yellow-500 hover:bg-yellow-50 transition-colors dark:border-gray-700 dark:hover:border-yellow-500 dark:hover:bg-yellow-900/20"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}