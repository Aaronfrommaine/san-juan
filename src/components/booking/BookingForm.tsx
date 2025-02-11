import React, { useState } from 'react';
import { Package } from './types';
import { useBooking } from './useBooking';
import SeminarSelect from './SeminarSelect';
import SpouseSection from './SpouseSection';
import { plans } from '../../lib/config/pricing';
import { useAuth } from '../auth/AuthProvider';

interface BookingFormProps {
  onClose: () => void;
  selectedPackage?: Package;
}

export default function BookingForm({ onClose, selectedPackage }: BookingFormProps) {
  const { user } = useAuth();
  const { submitBooking, isLoading } = useBooking();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    company: '',
    investmentGoals: '',
    seminarId: '',
    package: selectedPackage?.name || 'Standard Package',
    includeSpouse: selectedPackage?.spouseIncluded || false,
    spouse: {
      firstName: '',
      lastName: '',
      email: ''
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      if (!formData.seminarId) {
        alert('Please select a seminar date');
        return;
      }
      setStep(step + 1);
      return;
    }
    
    await submitBooking(formData);
    onClose();
  };

  const currentPackage = plans.find(p => p.name === formData.package);
  const totalPrice = currentPackage ? currentPackage.price + (formData.includeSpouse ? currentPackage.spousePrice || 0 : 0) : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {step === 1 ? (
        <>
          {!selectedPackage && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Package
              </label>
              <select
                name="package"
                value={formData.package}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              >
                {plans.map((plan) => (
                  <option key={plan.name} value={plan.name}>
                    {plan.name} - ${plan.price.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Select Seminar Date
            </h3>
            <SeminarSelect
              value={formData.seminarId}
              onChange={(value) => setFormData(prev => ({ ...prev, seminarId: value }))}
            />
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Company (Optional)
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Investment Goals
            </label>
            <textarea
              name="investmentGoals"
              required
              value={formData.investmentGoals}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>

          <SpouseSection
            selectedPackage={formData.package}
            includeSpouse={formData.includeSpouse}
            onToggleSpouse={(include) => setFormData(prev => ({ ...prev, includeSpouse: include }))}
            spouseData={formData.spouse}
            onSpouseDataChange={(data) => setFormData(prev => ({ 
              ...prev, 
              spouse: { ...prev.spouse, ...data }
            }))}
          />

          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="flex justify-between items-center text-lg font-medium text-yellow-800 dark:text-yellow-200">
              <span>Total Price:</span>
              <span>${totalPrice.toLocaleString()}</span>
            </div>
            {formData.includeSpouse && !currentPackage?.spouseIncluded && (
              <p className="text-sm text-yellow-600 dark:text-yellow-300 mt-1">
                Includes spouse/partner fee: ${currentPackage?.spousePrice?.toLocaleString()}
              </p>
            )}
          </div>
        </>
      )}

      <div className="flex justify-end gap-4">
        {step === 2 && (
          <button
            type="button"
            onClick={() => setStep(1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
          >
            Back
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading || !formData.seminarId}
          className="px-4 py-2 text-sm font-medium text-black bg-yellow-500 hover:bg-yellow-400 rounded-md disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : step === 1 ? 'Next' : 'Complete Booking'}
        </button>
      </div>
    </form>
  );
}