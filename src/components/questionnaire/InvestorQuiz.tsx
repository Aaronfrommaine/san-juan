import React, { useState } from 'react';
import { questions, results } from '../../lib/data/questionnaire';
import { InvestorType } from '../../lib/types/questionnaire';
import { useQuestionnaireResults } from '../../lib/hooks/useQuestionnaireResults';
import QuestionCard from './QuestionCard';
import ResultCard from './ResultCard';
import ProgressBar from './ProgressBar';

interface InvestorQuizProps {
  onComplete?: () => void;
}

export default function InvestorQuiz({ onComplete }: InvestorQuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<InvestorType[]>([]);
  const { submitResults, isSubmitting } = useQuestionnaireResults();
  const [error, setError] = useState<string | null>(null);

  const handleAnswer = async (answer: InvestorType) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        const resultType = calculateResult(newAnswers);
        await submitResults(resultType);
        onComplete?.();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save results');
        console.error('Error saving results:', err);
      }
    }
  };

  const calculateResult = (allAnswers: InvestorType[]): InvestorType => {
    const counts = allAnswers.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<InvestorType, number>);

    return Object.entries(counts).reduce((a, b) => 
      (counts[a[0] as InvestorType] > counts[b[0] as InvestorType] ? a : b)
    )[0] as InvestorType;
  };

  const restart = () => {
    setCurrentStep(0);
    setAnswers([]);
    setError(null);
  };

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <button
          onClick={restart}
          className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (answers.length === questions.length) {
    const resultType = calculateResult(answers);
    return (
      <ResultCard 
        result={results[resultType]} 
        onRestart={restart}
        isSubmitting={isSubmitting}
      />
    );
  }

  return (
    <div className="space-y-6">
      <ProgressBar currentStep={currentStep} totalSteps={questions.length} />
      <QuestionCard question={questions[currentStep]} onAnswer={handleAnswer} />
    </div>
  );
}