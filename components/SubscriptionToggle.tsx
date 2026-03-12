import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';

interface SubscriptionToggleProps {
  isPremium: boolean;
  onToggle: () => void;
}

const SubscriptionToggle: React.FC<SubscriptionToggleProps> = ({ isPremium, onToggle }) => {
  return (
    <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-inner border border-yellow-300">
      <StarIcon className={`w-6 h-6 transition-colors ${isPremium ? 'text-yellow-400' : 'text-gray-300'}`} />
      <span className="font-bold text-yellow-600 font-fredoka">Animated Illustrations</span>
      <button
        onClick={onToggle}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 ${isPremium ? 'bg-yellow-400' : 'bg-gray-300'}`}
      >
        <span
          className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isPremium ? 'translate-x-6' : 'translate-x-1'}`}
        />
      </button>
    </div>
  );
};

export default SubscriptionToggle;
