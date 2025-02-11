import React from 'react';
import { ClipboardCheck, Briefcase, Plane } from 'lucide-react';
import TravelChecklist from './TravelChecklist';
import DocumentChecklist from './DocumentChecklist';
import AIConcierge from './AIConcierge';
import TravelDetails from './TravelDetails';
import { useLanguage } from '../../../lib/context/LanguageContext';

export default function PreArrivalSection() {
  const { t } = useLanguage();

  return (
    <div className="p-6 space-y-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="space-y-6">
            <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
              <Plane className="h-5 w-5 mr-2" />
              {t('portal.preArrival.travel.title')}
            </h3>
            <TravelDetails />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
            <ClipboardCheck className="h-5 w-5 mr-2" />
            {t('portal.preArrival.checklist.title')}
          </h3>
          <TravelChecklist />
        </div>

        <div className="space-y-6">
          <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
            <Briefcase className="h-5 w-5 mr-2" />
            {t('portal.preArrival.documents.title')}
          </h3>
          <DocumentChecklist />
        </div>

        <div className="lg:col-span-2">
          <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white mb-6">
            <ClipboardCheck className="h-5 w-5 mr-2" />
            {t('portal.preArrival.concierge.title')}
          </h3>
          <AIConcierge />
        </div>
      </div>
    </div>
  );
}