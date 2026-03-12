import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StoryPage, ChatMessage } from './types';
import { STORY_PAGES } from './constants';
import { generateImage, generateSpeech, getChatResponse, QuotaError } from './services/geminiService';
import StoryViewer from './components/StoryViewer';
import Controls from './components/Controls';
import Chatbot from './components/Chatbot';
import SubscriptionToggle from './components/SubscriptionToggle';
import ApiKeyBanner from './components/ApiKeyBanner';
import { SparklesIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/solid';

const App: React.FC = () => {
  const [storyPages, setStoryPages] = useState<StoryPage[]>(STORY_PAGES);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatProcessing, setIsChatProcessing] = useState(false);

  // API key state — undefined means "use proxy", string means "use directly"
  const [userApiKey, setUserApiKey] = useState<string | undefined>(undefined);
  const [showApiKeyBanner, setShowApiKeyBanner] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const userAudioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Intercepts QuotaError and surfaces the API key banner
  const handleQuotaError = useCallback((error: unknown) => {
    if (error instanceof QuotaError) {
      setShowApiKeyBanner(true);
      return true;
    }
    return false;
  }, []);

  const generateIllustrationForPage = useCallback(async (pageIndex: number) => {
    if (storyPages[pageIndex].imageUrl) return;
    setIsLoadingImage(true);
    try {
      const imageUrl = await generateImage(storyPages[pageIndex].imagePrompt, userApiKey);
      setStoryPages(prevPages => {
        const newPages = [...prevPages];
        newPages[pageIndex] = { ...newPages[pageIndex], imageUrl };
        return newPages;
      });
    } catch (error) {
      if (!handleQuotaError(error)) console.error('Failed to generate image:', error);
    } finally {
      setIsLoadingImage(false);
    }
  }, [storyPages, userApiKey, handleQuotaError]);

  useEffect(() => {
    generateIllustrationForPage(currentPageIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPageIndex, generateIllustrationForPage]);

  const stopReading = useCallback(() => {
    audioSourceRef.current?.stop();
    audioSourceRef.current = null;
    if (userAudioRef.current) {
      userAudioRef.current.pause();
      userAudioRef.current.currentTime = 0;
      userAudioRef.current = null;
    }
    setIsReading(false);
  }, []);

  const handleStopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  const handleNextPage = () => {
    if (currentPageIndex < storyPages.length - 1) {
      stopReading();
      handleStopRecording();
      setCurrentPageIndex(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      stopReading();
      handleStopRecording();
      setCurrentPageIndex(prev => prev - 1);
    }
  };

  const handleReadAloud = async () => {
    if (isReading) { stopReading(); return; }

    const currentPage = storyPages[currentPageIndex];
    if (currentPage.userRecordingUrl) {
      setIsReading(true);
      const audio = new Audio(currentPage.userRecordingUrl);
      userAudioRef.current = audio;
      audio.play().catch(() => setIsReading(false));
      audio.onended = () => { setIsReading(false); userAudioRef.current = null; };
      return;
    }

    setIsReading(true);
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const audioBuffer = await generateSpeech(currentPage.text, userApiKey);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => setIsReading(false);
      source.start();
      audioSourceRef.current = source;
    } catch (error) {
      if (!handleQuotaError(error)) console.error('Failed to generate speech:', error);
      setIsReading(false);
    }
  };

  const handleStartRecording = async () => {
    if (storyPages[currentPageIndex].userRecordingUrl) {
      URL.revokeObjectURL(storyPages[currentPageIndex].userRecordingUrl!);
      setStoryPages(prev => {
        const pages = [...prev];
        delete pages[currentPageIndex].userRecordingUrl;
        return pages;
      });
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = e => audioChunksRef.current.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const url = URL.createObjectURL(new Blob(audioChunksRef.current, { type: 'audio/webm' }));
        setStoryPages(prev => {
          const pages = [...prev];
          pages[currentPageIndex] = { ...pages[currentPageIndex], userRecordingUrl: url };
          return pages;
        });
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch {
      alert('Could not access microphone. Please allow microphone access in your browser.');
    }
  };

  const handleToggleRecording = () => {
    isRecording ? handleStopRecording() : handleStartRecording();
  };

  const handleDeleteRecording = useCallback(() => {
    const url = storyPages[currentPageIndex].userRecordingUrl;
    if (url) {
      URL.revokeObjectURL(url);
      setStoryPages(prev => {
        const pages = [...prev];
        delete pages[currentPageIndex].userRecordingUrl;
        return pages;
      });
    }
  }, [storyPages, currentPageIndex]);

  const handleSendMessage = async (message: string) => {
    setIsChatProcessing(true);
    const updated: ChatMessage[] = [...chatHistory, { role: 'user', content: message }];
    setChatHistory(updated);
    try {
      const response = await getChatResponse(updated, userApiKey);
      setChatHistory(prev => [...prev, { role: 'model', content: response }]);
    } catch (error) {
      if (!handleQuotaError(error)) {
        setChatHistory(prev => [...prev, { role: 'model', content: "Oops! I had a little trouble thinking. Please try again." }]);
      }
    } finally {
      setIsChatProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 text-gray-800 p-4 sm:p-6 md:p-8 flex flex-col items-center">
      {showApiKeyBanner && (
        <ApiKeyBanner
          onKeySubmit={(key) => { setUserApiKey(key); setShowApiKeyBanner(false); }}
          onDismiss={() => setShowApiKeyBanner(false)}
        />
      )}

      <header className="w-full max-w-5xl mb-6 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl text-purple-600 font-fredoka flex items-center justify-center gap-3">
          <SparklesIcon className="w-10 h-10 text-yellow-400" />
          StoryTime AI
          <SparklesIcon className="w-10 h-10 text-yellow-400" />
        </h1>
        <p className="text-lg text-purple-500 mt-2">Where every story is a new adventure!</p>
      </header>

      <main className="w-full max-w-5xl flex-grow flex flex-col lg:flex-row gap-8">
        <StoryViewer page={storyPages[currentPageIndex]} isLoading={isLoadingImage} isPremium={isPremium} />
      </main>

      <footer className="w-full max-w-5xl mt-6">
        <Controls
          onNext={handleNextPage}
          onPrev={handlePrevPage}
          onReadAloud={handleReadAloud}
          isReading={isReading}
          hasNext={currentPageIndex < storyPages.length - 1}
          hasPrev={currentPageIndex > 0}
          isImageLoading={isLoadingImage}
          onToggleRecording={handleToggleRecording}
          isRecording={isRecording}
          hasRecording={!!storyPages[currentPageIndex].userRecordingUrl}
          onDeleteRecording={handleDeleteRecording}
        />
        <div className="mt-4 flex justify-center">
          <SubscriptionToggle isPremium={isPremium} onToggle={() => setIsPremium(!isPremium)} />
        </div>
      </footer>

      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 bg-orange-400 hover:bg-orange-500 text-white p-4 rounded-full shadow-lg transform hover:scale-110 transition-transform duration-200 z-50"
        aria-label="Open chatbot"
      >
        <ChatBubbleBottomCenterTextIcon className="w-8 h-8" />
      </button>

      <Chatbot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        messages={chatHistory}
        onSendMessage={handleSendMessage}
        isProcessing={isChatProcessing}
      />
    </div>
  );
};

export default App;
