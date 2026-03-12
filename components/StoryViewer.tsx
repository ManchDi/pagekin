import React from 'react';
import { StoryPage } from '../types';

interface StoryViewerProps {
  page: StoryPage;
  isLoading: boolean;
  isPremium: boolean;
}

const ImagePlaceholder: React.FC = () => (
    <div className="w-full h-full bg-purple-200 rounded-2xl flex items-center justify-center animate-pulse">
        <svg className="w-1/4 h-1/4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
    </div>
);

const StoryViewer: React.FC<StoryViewerProps> = ({ page, isLoading, isPremium }) => {
  const animationClass = isPremium ? 'animate-[pulse_4s_ease-in-out_infinite]' : '';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full bg-white/70 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-purple-200">
      <div className="aspect-square rounded-2xl overflow-hidden shadow-md">
        {isLoading ? (
          <ImagePlaceholder />
        ) : (
          <img
            src={page.imageUrl || 'https://picsum.photos/512/512'}
            alt={page.imagePrompt}
            className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${animationClass}`}
          />
        )}
      </div>
      <div className="flex items-center justify-center bg-purple-50/50 p-6 rounded-2xl">
        <p className="text-xl md:text-2xl leading-relaxed text-gray-700">
          {page.text}
        </p>
      </div>
    </div>
  );
};

export default StoryViewer;
