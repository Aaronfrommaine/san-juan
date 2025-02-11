import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GuideHeader from './GuideHeader';
import GuideAccordion from './GuideAccordion';
import { sections } from './guideData';

export default function TaxBenefitsGuide() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Resources
        </button>

        <GuideHeader />
        <GuideAccordion sections={sections} />

        <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Note: This guide is for informational purposes only. Please consult with qualified tax and legal professionals for advice specific to your situation.
          </p>
        </div>
      </div>
    </div>
  );
}