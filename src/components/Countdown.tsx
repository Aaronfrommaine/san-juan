import React, { useState, useEffect } from 'react';
import { TimerIcon, Calendar, MapPin, RefreshCw } from 'lucide-react';
import { useNextSeminar } from '../lib/hooks/useNextSeminar';

export default function Countdown() {
  const { nextSeminar, isLoading, error, retry } = useNextSeminar();
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    if (!nextSeminar) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    
    const difference = new Date(nextSeminar.start_date).getTime() - new Date().getTime();
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  }

  useEffect(() => {
    if (!nextSeminar) return;
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [nextSeminar]);

  if (error) {
    return (
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <TimerIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Temporarily Unavailable
          </h2>
          <p className="text-gray-600 mb-6">
            We're having trouble loading the next seminar information.
          </p>
          <button
            onClick={retry}
            className="inline-flex items-center px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-pulse">
            <div className="h-12 w-12 bg-yellow-200 rounded-full mx-auto mb-4" />
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4" />
            <div className="h-4 bg-gray-200 rounded w-48 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (!nextSeminar) {
    return (
      <div className="bg-white py-16 text-center">
        <TimerIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Stay Tuned!
        </h2>
        <p className="text-gray-600">
          New seminar dates will be announced soon.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <TimerIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Next Seminar Begins In...
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="bg-gray-50 p-4 rounded-lg">
              <div className="text-4xl font-bold text-yellow-500">{value}</div>
              <div className="text-gray-600 capitalize">{unit}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-5 w-5 mr-2" />
            <span>
              {new Date(nextSeminar.start_date).toLocaleDateString()} - 
              {new Date(nextSeminar.end_date).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-5 w-5 mr-2" />
            <span>{nextSeminar.location}</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              VIP Access
            </h3>
            <p className="text-gray-600">
              Exclusive property viewings, private networking events, and one-on-one sessions with top investors and local experts.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Expert Network
            </h3>
            <p className="text-gray-600">
              Connect with Puerto Rico's leading real estate attorneys, tax advisors, property managers, and successful investors.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Tax Benefits
            </h3>
            <p className="text-gray-600">
              Learn how to leverage Act 60 incentives, structure investments tax-efficiently, and maximize returns through strategic planning.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}