import React from 'react';
import { StopIcon, MicrophoneIcon, PlayIcon } from '@heroicons/react/24/solid';

type BannerMode = 'recording' | 'playing';

interface StoryModeBannerProps {
  mode: BannerMode;
  currentPage: number; // 1-based
  totalPages: number;
  onStop: () => void;
}

const StoryModeBanner: React.FC<StoryModeBannerProps> = ({
  mode, currentPage, totalPages, onStop,
}) => {
  const isRecording = mode === 'recording';

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 px-4 py-3 shadow-md flex items-center justify-between
      ${isRecording ? 'bg-red-500' : 'bg-green-500'}`}
    >
      <div className="flex items-center gap-3 text-white">
        {isRecording ? (
          <MicrophoneIcon className="w-5 h-5 animate-pulse" />
        ) : (
          <PlayIcon className="w-5 h-5" />
        )}
        <span className="font-semibold text-sm">
          {isRecording ? 'Recording story' : 'Playing story'}
        </span>
        <span className="text-white/80 text-sm">
          · Page {currentPage} of {totalPages}
        </span>
      </div>

      <button
        onClick={onStop}
        className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-3 py-1.5 rounded-full transition-colors"
      >
        <StopIcon className="w-4 h-4" />
        Stop
      </button>
    </div>
  );
};

export default StoryModeBanner;