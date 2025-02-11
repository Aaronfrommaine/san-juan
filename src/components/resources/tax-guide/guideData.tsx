import React from 'react';
import { Section } from './types';

export const sections: Section[] = [
  {
    title: 'Why Puerto Rico?',
    content: (
      <ul className="space-y-2 text-gray-600 dark:text-gray-300">
        <li className="flex items-start gap-2">
          <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
          <span><strong>Tax-Advantaged Environment:</strong> As a territory, Puerto Rico's tax laws differ significantly from mainland U.S. regulations.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
          <span><strong>No Federal Income Tax on Puerto Rico-Sourced Income:</strong> Bona fide residents do not pay U.S. federal income tax on PR-sourced income.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
          <span><strong>Growing Real Estate Market:</strong> The island's real estate market has surged, driven by luxury developments, tourism, and high-net-worth individuals.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
          <span><strong>Strategic Location:</strong> Puerto Rico is a gateway for business in North, South, and Central America.</span>
        </li>
      </ul>
    )
  },
  {
    title: 'Key Tax Incentives Under Act 60',
    content: (
      <div className="space-y-4 text-gray-600 dark:text-gray-300">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">1. Individual Investors – Income and Capital Gains Tax Benefits</h4>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
              <span>100% tax exemption on Puerto Rico-sourced dividends and interest.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <span>Capital Gains:</span>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>• Assets acquired after establishing PR residency: 100% exempt until 2036.</li>
                  <li>• Pre-residency assets: 5% tax on post-residency appreciation, if sold within a specific timeframe.</li>
                </ul>
              </div>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">2. Export Services</h4>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
              <span>Flat 4% corporate tax rate on net income from eligible export services.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
              <span>100% tax exemption on dividends from export service income.</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3. Property Tax Exemptions</h4>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
              <span>Many real estate investments qualify for partial or full property tax exemptions.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
              <span>Especially beneficial for developers or investors in tourism-related properties.</span>
            </li>
          </ul>
        </div>
      </div>
    )
  },
  {
    title: 'Residency Requirements',
    content: (
      <div className="space-y-4 text-gray-600 dark:text-gray-300">
        <p>To benefit from Act 60, you must establish bona fide residency in Puerto Rico, which includes:</p>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
            <span><strong>Physical Presence:</strong> Spend at least 183 days in Puerto Rico per calendar year.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
            <span><strong>Primary Tax Home:</strong> Demonstrate that Puerto Rico is your main place of business/residence.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
            <span><strong>Closer Connection Test:</strong> Show stronger ties to Puerto Rico than any other jurisdiction.</span>
          </li>
        </ul>
        <div className="mt-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Additional Obligations:</h4>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
              <span>Purchase or lease a primary residence in Puerto Rico within two years of establishing residency.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
              <span>Make annual charitable donations of at least $10,000, with $5,000 going toward child poverty-focused nonprofits.</span>
            </li>
          </ul>
        </div>
      </div>
    )
  },
  {
    title: 'Real Estate Market Opportunities',
    content: (
      <ul className="space-y-2 text-gray-600 dark:text-gray-300">
        <li className="flex items-start gap-2">
          <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
          <span><strong>High-End Developments:</strong> Dorado Beach, Palmas del Mar, and San Juan have seen an influx of luxury buyers.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
          <span><strong>Short-Term Rental Market:</strong> The booming tourism industry presents lucrative Airbnb/vacation rental returns.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
          <span><strong>Redevelopment Projects:</strong> Take advantage of government incentives for revitalizing distressed properties in Opportunity Zones.</span>
        </li>
      </ul>
    )
  },
  {
    title: 'Application Process',
    content: (
      <div className="space-y-4 text-gray-600 dark:text-gray-300">
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
            <div>
              <strong>Register via Single Business Portal (SBP):</strong>
              <p className="mt-1">All Act 60 applicants apply online through the SBP platform.</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
            <div>
              <strong>Submit Required Documentation:</strong>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• Proof of Puerto Rico residency</li>
                <li>• Evidence of compliance with charitable contribution requirements</li>
                <li>• Financial statements and tax returns</li>
                <li>• Business plan (if applicable)</li>
              </ul>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
            <div>
              <strong>Tax Exemption Decree:</strong>
              <p className="mt-1">Once approved, you receive a binding tax exemption decree from the PR government.</p>
            </div>
          </li>
        </ul>
      </div>
    )
  },
  {
    title: 'Compliance & Pitfalls to Avoid',
    content: (
      <div className="space-y-4 text-gray-600 dark:text-gray-300">
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
            <div>
              <strong>Strict Compliance:</strong>
              <p className="mt-1">The PR government closely monitors Act 60 participants; expect residency audits.</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
            <div>
              <strong>Substantial Presence:</strong>
              <p className="mt-1">Failing to meet the 183-day rule or other tests can lead to disqualification.</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
            <div>
              <strong>Charitable Contributions:</strong>
              <p className="mt-1">Keep records of timely donations to approved nonprofits.</p>
            </div>
          </li>
        </ul>
      </div>
    )
  },
  {
    title: 'Case Study: Success Story',
    content: (
      <div className="space-y-4 text-gray-600 dark:text-gray-300">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Investor Profile: John's Journey</h4>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
              <span><strong>Background:</strong> Real estate investor from Florida, relocated to Puerto Rico in 2023.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
              <span><strong>Investment:</strong> Purchased a $2M beachfront property in Dorado for rental income.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
              <span><strong>Tax Benefits:</strong> Saved approximately $300,000 annually in federal income and capital gains taxes.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
              <span><strong>Community Impact:</strong> Contributed $20,000 to local nonprofits, including a child poverty fund.</span>
            </li>
          </ul>
        </div>
      </div>
    )
  },
  {
    title: 'Strategic Tips for Investors',
    content: (
      <div className="space-y-4 text-gray-600 dark:text-gray-300">
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
            <div>
              <strong>Engage Local Experts:</strong>
              <p className="mt-1">Use local accountants, attorneys, and real estate pros familiar with Act 60.</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
            <div>
              <strong>Evaluate Long-Term Plans:</strong>
              <p className="mt-1">Ensure Puerto Rico aligns with your personal and financial goals.</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
            <div>
              <strong>Consider Family Needs:</strong>
              <p className="mt-1">Assess schools, healthcare, and resources if relocating with family.</p>
            </div>
          </li>
        </ul>
      </div>
    )
  },
  {
    title: 'Conclusion',
    content: (
      <div className="space-y-4 text-gray-600 dark:text-gray-300">
        <p>
          Puerto Rico's Act 60 offers unparalleled opportunities for real estate investors seeking tax 
          advantages and a tropical lifestyle. By understanding and adhering to the law's requirements, 
          you can unlock significant financial benefits while contributing to Puerto Rico's economic growth.
        </p>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Next Steps</h4>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
              <span>Schedule a consultation with our tax experts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
              <span>Review our property portfolio</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
              <span>Join our network of successful investors</span>
            </li>
          </ul>
        </div>
      </div>
    )
  }
];