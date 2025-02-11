import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Section } from './types';

interface GuideAccordionProps {
  sections: Section[];
}

export default function GuideAccordion({ sections }: GuideAccordionProps) {
  const [openSections, setOpenSections] = useState<number[]>([]);

  const toggleSection = (index: number) => {
    setOpenSections(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="space-y-4">
      {sections.map((section, index) => (
        <div 
          key={index}
          className="border dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800"
        >
          <button
            onClick={() => toggleSection(index)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <div className="flex items-center">
              <ChevronRight 
                className={`h-5 w-5 mr-2 text-yellow-500 transition-transform ${
                  openSections.includes(index) ? 'rotate-90' : ''
                }`}
              />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {index + 1}. {section.title}
              </h3>
            </div>
          </button>

          <div className={`
            overflow-hidden transition-all duration-300
            ${openSections.includes(index) ? 'max-h-[2000px]' : 'max-h-0'}
          `}>
            <div className="p-4 border-t dark:border-gray-700">
              {section.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}