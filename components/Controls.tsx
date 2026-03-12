import React from 'react';
import {
  ChevronLeftIcon, ChevronRightIcon, PlayIcon, StopIcon,
  MicrophoneIcon, ArrowPathIcon, TrashIcon, HomeIcon, ArrowDownTrayIcon,
} from '@heroicons/react/24/solid';

interface ControlsProps {
  onPrev: () => void;
  onNext: () => void;
  onReadAloud: () => void;
  onToggleRecording: () => void;
  onDeleteRecording: () => void;
  onGoHome: () => void;
  onSavePDF: () => void;
  isReading: boolean;
  isLoadingTTS: boolean;
  isRecording: boolean;
  hasRecording: boolean;
  hasPrev: boolean;
  hasNext: boolean;
  isImageLoading: boolean;
  isPageGenerating: boolean;
  isSavingPDF: boolean;
}

const ControlButton: React.FC<{
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
  className?: string;
  title?: string;
}> = ({ onClick, disabled, children, className = '', title }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`px-4 py-3 rounded-full text-white font-bold shadow-md transform transition-transform duration-200 flex items-center gap-2 focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100 ${className}`}
  >
    {children}
  </button>
);

const Controls: React.FC<ControlsProps> = ({
  onPrev, onNext, onReadAloud, onToggleRecording, onDeleteRecording,
  onGoHome, onSavePDF,
  isReading, isLoadingTTS, isRecording, hasRecording, hasPrev, hasNext,
  isImageLoading, isPageGenerating, isSavingPDF,
}) => {
  const isBusy = isImageLoading || isPageGenerating;

  const getReadButton = () => {
    if (isLoadingTTS) return { text: 'Loading...', icon: <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />, color: 'bg-gray-400' };
    if (isReading) return { text: 'Stop', icon: <StopIcon className="h-5 w-5" />, color: 'bg-red-500 hover:bg-red-600 focus:ring-red-300' };
    return { text: 'Read', icon: <PlayIcon className="h-5 w-5" />, color: 'bg-green-500 hover:bg-green-600 focus:ring-green-300' };
  };

  const getRecordButton = () => {
    if (isRecording) return { text: 'Stop', icon: <StopIcon className="h-5 w-5" />, color: 'bg-red-500 hover:bg-red-600 focus:ring-red-300' };
    if (hasRecording) return { text: 'Re-record', icon: <ArrowPathIcon className="h-5 w-5" />, color: 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-300' };
    return { text: 'Record', icon: <MicrophoneIcon className="h-5 w-5" />, color: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-300' };
  };

  const readBtn = getReadButton();
  const recordBtn = getRecordButton();

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Main controls row */}
      <div className="flex justify-center items-center gap-2 sm:gap-3 flex-wrap">
        {/* Home */}
        <ControlButton
          onClick={onGoHome}
          disabled={isRecording}
          className="bg-gray-400 hover:bg-gray-500 focus:ring-gray-300"
          title="New story"
        >
          <HomeIcon className="h-5 w-5" />
        </ControlButton>

        {/* Prev */}
        <ControlButton
          onClick={onPrev}
          disabled={!hasPrev || isBusy || isReading || isRecording}
          className="bg-pink-500 hover:bg-pink-600 focus:ring-pink-300"
        >
          <ChevronLeftIcon className="h-5 w-5" />
          Prev
        </ControlButton>

        {/* Read aloud */}
        <ControlButton
          onClick={onReadAloud}
          disabled={isBusy || isRecording || (isLoadingTTS && !isReading)}
          className={`w-32 justify-center ${readBtn.color}`}
        >
          {readBtn.icon}
          {readBtn.text}
        </ControlButton>

        {/* Record */}
        <div className="flex items-center gap-2">
          <ControlButton
            onClick={onToggleRecording}
            disabled={isBusy || isReading || isLoadingTTS}
            className={`w-36 justify-center ${recordBtn.color}`}
          >
            {recordBtn.icon}
            {recordBtn.text}
          </ControlButton>
          {hasRecording && !isRecording && (
            <button
              onClick={onDeleteRecording}
              disabled={isBusy || isReading}
              className="p-3 rounded-full bg-gray-400 hover:bg-gray-500 text-white shadow-md transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:opacity-50"
              aria-label="Delete recording"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Next */}
        <ControlButton
          onClick={onNext}
          disabled={!hasNext || isBusy || isReading || isRecording}
          className="bg-pink-500 hover:bg-pink-600 focus:ring-pink-300"
        >
          Next
          <ChevronRightIcon className="h-5 w-5" />
        </ControlButton>
      </div>

      {/* Save PDF — secondary row, visually distinct */}
      <button
        onClick={onSavePDF}
        disabled={isSavingPDF || isRecording || isBusy}
        className="flex items-center gap-2 px-5 py-2 bg-white border-2 border-purple-300 text-purple-600 font-semibold rounded-full shadow-sm hover:bg-purple-50 hover:border-purple-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
      >
        {isSavingPDF ? (
          <span className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin inline-block" />
        ) : (
          <ArrowDownTrayIcon className="h-4 w-4" />
        )}
        {isSavingPDF ? 'Preparing PDF...' : 'Save as PDF'}
      </button>
    </div>
  );
};

export default Controls;