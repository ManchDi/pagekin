import React from 'react';
import { StoryPage } from '../types';

interface StoryViewerProps {
  page: StoryPage;
  isLoadingImage: boolean;
  pageIndex: number;
  pageCount: number;
}

const ImagePlaceholder: React.FC<{ isGenerating?: boolean }> = ({ isGenerating }) => (
  <div className="w-full h-full bg-purple-100 rounded-2xl flex flex-col items-center justify-center gap-3 animate-pulse">
    <svg className="w-1/4 h-1/4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
    {isGenerating && (
      <p className="text-purple-400 text-sm font-medium">Painting the scene...</p>
    )}
  </div>
);

const StoryViewer: React.FC<StoryViewerProps> = ({ page, isLoadingImage, pageIndex, pageCount }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full bg-white/70 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-purple-200">
      {/* Image */}
      <div className="aspect-square rounded-2xl overflow-hidden shadow-md">
        {isLoadingImage || !page.imageUrl ? (
          <ImagePlaceholder isGenerating={isLoadingImage} />
        ) : (
          <img
            src={page.imageUrl}
            alt={page.imagePrompt}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        )}
      </div>

      {/* Text */}
      <div className="flex flex-col justify-between bg-purple-50/50 p-6 rounded-2xl">
        <div className="flex-1 flex items-center">
          {page.isGenerating ? (
            <p className="text-purple-300 text-xl animate-pulse">Writing page {pageIndex + 1}...</p>
          ) : (
            <p className="text-xl md:text-2xl leading-relaxed text-gray-700">{page.text}</p>
          )}
        </div>
        <p className="text-right text-sm text-purple-300 mt-4 font-medium">
          {pageIndex + 1} / {pageCount}
        </p>
      </div>
    </div>
  );
};

export default StoryViewer;