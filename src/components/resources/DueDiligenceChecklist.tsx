import React, { useState } from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DueDiligenceChecklist() {
  const [openSections, setOpenSections] = useState<number[]>([]);
  const navigate = useNavigate();

  const toggleSection = (index: number) => {
    setOpenSections(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Resources
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Due Diligence Checklist
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Essential checklist for mainland U.S. investors considering Puerto Rico real estate
          </p>
        </div>

        {/* Checklist */}
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
                ${openSections.includes(index) ? 'max-h-[1000px]' : 'max-h-0'}
              `}>
                <div className="p-4 border-t dark:border-gray-700">
                  <ul className="space-y-3">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-5 h-5 mt-1">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                          />
                        </div>
                        <div>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {item.title}
                          </p>
                          {item.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Note: This checklist is for informational purposes only and should not replace professional legal or financial advice.
          </p>
        </div>
      </div>
    </div>
  );
}

const sections = [
  {
    title: 'Preliminary Research',
    items: [
      {
        title: 'Understand Local Market Trends',
        description: 'Analyze current real estate trends in Puerto Rico, focusing on property values, demand, and future projections.'
      },
      {
        title: 'Identify Emerging Neighborhoods',
        description: 'Research areas experiencing growth, such as Cabo Rojo, Fajardo, Mayagüez, Vieques, and Aguadilla.'
      },
      {
        title: 'Familiarize with Local Laws',
        description: 'Study Puerto Rico\'s real estate laws, tax incentives (e.g., Act 60), and regulations that differ from mainland U.S.'
      }
    ]
  },
  {
    title: 'Financial Evaluation',
    items: [
      {
        title: 'Property Appraisal',
        description: 'Obtain a professional appraisal to determine the property\'s fair market value.'
      },
      {
        title: 'Comparative Market Analysis (CMA)',
        description: 'Compare similar properties in the area to assess competitiveness and investment potential.'
      },
      {
        title: 'Calculate Expenses',
        description: 'Estimate all costs, including property taxes, maintenance, insurance, and potential renovation expenses.'
      },
      {
        title: 'Assess Rental Income Potential',
        description: 'If considering rental properties, analyze expected rental income and occupancy rates.'
      }
    ]
  },
  {
    title: 'Legal Due Diligence',
    items: [
      {
        title: 'Title Search',
        description: 'Verify the property\'s title to ensure it\'s free from liens, encumbrances, or disputes.'
      },
      {
        title: 'Zoning and Land Use',
        description: 'Confirm the property\'s zoning classification aligns with your intended use.'
      },
      {
        title: 'Review Legal Compliance',
        description: 'Ensure all renovations or constructions have the necessary permits and comply with local building codes.'
      }
    ]
  },
  {
    title: 'Physical Inspection',
    items: [
      {
        title: 'Hire a Qualified Inspector',
        description: 'Engage a licensed inspector familiar with Puerto Rico\'s building standards to assess the property\'s condition.'
      },
      {
        title: 'Environmental Assessment',
        description: 'Check for environmental hazards, such as flood zones or hurricane exposure.'
      },
      {
        title: 'Evaluate Infrastructure',
        description: 'Assess the condition of utilities, access roads, and essential services.'
      }
    ]
  },
  {
    title: 'Tax Considerations',
    items: [
      {
        title: 'Understand Property Taxes',
        description: 'Learn about Puerto Rico\'s property tax system, including assessment rates and payment schedules.'
      },
      {
        title: 'Explore Tax Incentives',
        description: 'Investigate eligibility for tax benefits under Acts like Act 60, which offers incentives for investors.'
      }
    ]
  },
  {
    title: 'Financing',
    items: [
      {
        title: 'Explore Financing Options',
        description: 'Research available mortgage options in Puerto Rico, noting that terms may differ from mainland U.S.'
      },
      {
        title: 'Currency Considerations',
        description: 'Be aware that while Puerto Rico uses the U.S. dollar, financial institutions may have different lending criteria.'
      }
    ]
  },
  {
    title: 'Engage Local Professionals',
    items: [
      {
        title: 'Real Estate Agent',
        description: 'Partner with a local agent experienced with mainland investors.'
      },
      {
        title: 'Legal Counsel',
        description: 'Hire an attorney specializing in Puerto Rican real estate law.'
      },
      {
        title: 'Tax Advisor',
        description: 'Consult with a tax professional knowledgeable about both U.S. and Puerto Rican tax systems.'
      }
    ]
  },
  {
    title: 'Cultural and Community Assessment',
    items: [
      {
        title: 'Community Integration',
        description: 'Understand the local culture and community dynamics to ensure a harmonious investment.'
      },
      {
        title: 'Language Considerations',
        description: 'While many Puerto Ricans speak English, Spanish is the predominant language; consider this in your interactions.'
      }
    ]
  },
  {
    title: 'Final Verification',
    items: [
      {
        title: 'Reconfirm All Information',
        description: 'Before closing, double-check all data, documents, and compliance with legal requirements.'
      },
      {
        title: 'Secure Title Insurance',
        description: 'Obtain title insurance to protect against potential future disputes.'
      }
    ]
  },
  {
    title: 'Post-Purchase Considerations',
    items: [
      {
        title: 'Property Management',
        description: 'Decide whether to hire a local property management company, especially if you reside outside Puerto Rico.'
      },
      {
        title: 'Ongoing Compliance',
        description: 'Stay informed about any changes in local laws or tax regulations that may affect your investment.'
      }
    ]
  }
];