import React, { useEffect, useState } from 'react';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { StoryConfig } from '../types';

interface LoadingScreenProps {
  config: StoryConfig;
}

const messages = [
  "Sharpening the magic pencils...",
  "Whispering to the story fairies...",
  "Mixing colors for the illustrations...",
  "Sprinkling imagination dust...",
  "Almost ready for your adventure!",
];

const LoadingScreen: React.FC<LoadingScreenProps> = ({ config }) => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        {/* Animated sparkles */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <SparklesIcon className="w-8 h-8 text-yellow-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <SparklesIcon className="w-12 h-12 text-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
          <SparklesIcon className="w-8 h-8 text-pink-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>

        <h2 className="text-3xl font-fredoka text-purple-600 mb-2">
          Writing your story...
        </h2>

        {config.childName && config.includeChild && (
          <p className="text-purple-400 mb-6">
            A magical adventure starring <span className="font-bold">{config.childName}</span>!
          </p>
        )}

        {/* Loading bar */}
        <div className="w-full bg-purple-100 rounded-full h-2 mb-6 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse" style={{ width: '60%' }} />
        </div>

        <p className="text-gray-500 text-sm transition-all duration-500">
          {messages[messageIndex]}
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;