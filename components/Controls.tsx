import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon, StopIcon, MicrophoneIcon, ArrowPathIcon, TrashIcon } from '@heroicons/react/24/solid';

interface ControlsProps {
  onPrev: () => void;
  onNext: () => void;
  onReadAloud: () => void;
  onToggleRecording: () => void;
  onDeleteRecording: () => void;
  isReading: boolean;
  isRecording: boolean;
  hasRecording: boolean;
  hasPrev: boolean;
  hasNext: boolean;
  isImageLoading: boolean;
}

const ControlButton: React.FC<{ onClick: () => void; disabled: boolean; children: React.ReactNode; className?: string }> = ({ onClick, disabled, children, className = '' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-6 py-3 rounded-full text-white font-bold text-lg shadow-md transform transition-transform duration-200 flex items-center gap-2 focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100 ${className}`}
  >
    {children}
  </button>
);


const Controls: React.FC<ControlsProps> = ({ onPrev, onNext, onReadAloud, onToggleRecording, onDeleteRecording, isReading, isRecording, hasRecording, hasPrev, hasNext, isImageLoading }) => {
  const getRecordButton = () => {
    if (isRecording) {
      return {
        text: 'Stop',
        icon: <StopIcon className="h-6 w-6" />,
        color: 'bg-red-500 hover:bg-red-600 focus:ring-red-300'
      };
    }
    if (hasRecording) {
      return {
        text: 'Re-record',
        icon: <ArrowPathIcon className="h-6 w-6" />,
        color: 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-300'
      };
    }
    return {
      text: 'Record',
      icon: <MicrophoneIcon className="h-6 w-6" />,
      color: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-300'
    };
  };

  const recordButton = getRecordButton();

  return (
    <div className="flex justify-center items-center gap-2 sm:gap-4 flex-wrap">
      <ControlButton onClick={onPrev} disabled={!hasPrev || isImageLoading || isReading || isRecording} className="bg-pink-500 hover:bg-pink-600 focus:ring-pink-300">
        <ChevronLeftIcon className="h-6 w-6" />
        Prev
      </ControlButton>
      
      <ControlButton onClick={onReadAloud} disabled={isImageLoading || isRecording} className={`w-32 sm:w-40 justify-center ${isReading ? 'bg-red-500 hover:bg-red-600 focus:ring-red-300' : 'bg-green-500 hover:bg-green-600 focus:ring-green-300'}`}>
        {isReading ? (
          <>
            <StopIcon className="h-6 w-6" />
            Stop
          </>
        ) : (
          <>
            <PlayIcon className="h-6 w-6" />
            Read
          </>
        )}
      </ControlButton>

      <div className="flex items-center gap-2">
        <ControlButton 
          onClick={onToggleRecording} 
          disabled={isImageLoading || isReading} 
          className={`w-36 sm:w-40 justify-center ${recordButton.color}`}
        >
          {recordButton.icon}
          {recordButton.text}
        </ControlButton>
        {hasRecording && !isRecording && (
          <button 
            onClick={onDeleteRecording} 
            disabled={isImageLoading || isReading}
            className="p-3.5 rounded-full bg-gray-500 hover:bg-gray-600 text-white shadow-md transform transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:bg-gray-400 disabled:shadow-none disabled:scale-100"
            aria-label="Delete recording"
          >
            <TrashIcon className="h-6 w-6" />
          </button>
        )}
      </div>

      <ControlButton onClick={onNext} disabled={!hasNext || isImageLoading || isReading || isRecording} className="bg-pink-500 hover:bg-pink-600 focus:ring-pink-300">
        Next
        <ChevronRightIcon className="h-6 w-6" />
      </ControlButton>
    </div>
  );
};

export default Controls;
