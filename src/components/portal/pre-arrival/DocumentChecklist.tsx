import React, { useState } from 'react';
import { useChecklist } from '../../../lib/hooks/useChecklist';
import { useLanguage } from '../../../lib/context/LanguageContext';
import { FileText } from 'lucide-react';
import InvestorQuiz from '../../questionnaire/InvestorQuiz';

export default function DocumentChecklist() {
  const { t } = useLanguage();
  const [showQuiz, setShowQuiz] = useState(false);
  
  const documentItems = [
    { id: 'id', label: t('checklist.docs.id') },
    { id: 'tax-returns', label: t('checklist.docs.tax') },
    { id: 'bank-statements', label: t('checklist.docs.bank') },
    { id: 'proof-funds', label: t('checklist.docs.funds') },
    { 
      id: 'investment-goals', 
      label: t('checklist.docs.goals'),
      action: 'quiz'
    }
  ];

  const { checkedItems, toggleItem } = useChecklist('document-checklist', documentItems);

  return (
    <div className="space-y-3">
      {documentItems.map((item) => (
        <div
          key={item.id}
          className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
        >
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={checkedItems.includes(item.id)}
              onChange={() => toggleItem(item.id)}
              className="h-4 w-4 text-yellow-500 rounded border-gray-300 focus:ring-yellow-500"
            />
            <label className="flex-1 text-sm text-gray-700 dark:text-gray-200">
              {item.label}
            </label>
            {item.action === 'quiz' && (
              <button
                onClick={() => setShowQuiz(true)}
                className="p-2 text-yellow-600 hover:text-yellow-500"
              >
                <FileText className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      ))}

      {showQuiz && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <InvestorQuiz onComplete={() => {
              toggleItem('investment-goals');
              setShowQuiz(false);
            }} />
            <button
              onClick={() => setShowQuiz(false)}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}