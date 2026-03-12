import React, { useState } from 'react';
import { KeyIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface ApiKeyBannerProps {
  onKeySubmit: (key: string) => void;
  onDismiss: () => void;
}

const ApiKeyBanner: React.FC<ApiKeyBannerProps> = ({ onKeySubmit, onDismiss }) => {
  const [input, setInput] = useState('');
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onKeySubmit(trimmed);
    setVisible(false);
  };

  const handleDismiss = () => {
    setVisible(false);
    onDismiss();
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-50 border-b-2 border-amber-300 px-4 py-3 shadow-md">
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 text-amber-800 shrink-0">
          <KeyIcon className="w-5 h-5" />
          <span className="font-semibold text-sm">Free demo quota reached</span>
        </div>

        <p className="text-amber-700 text-sm flex-1">
          Add your free{' '}
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium hover:text-amber-900"
          >
            Gemini API key
          </a>{' '}
          to keep going. It stays in your browser and is never stored.
        </p>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="AIza..."
            className="flex-1 sm:w-56 px-3 py-1.5 text-sm border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim()}
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg disabled:opacity-50 transition-colors"
          >
            Save
          </button>
          <button
            onClick={handleDismiss}
            className="text-amber-600 hover:text-amber-800"
            aria-label="Dismiss"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyBanner;
