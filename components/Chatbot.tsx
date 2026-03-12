import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { XMarkIcon, PaperAirplaneIcon, SparklesIcon } from '@heroicons/react/24/solid';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose, messages, onSendMessage, isProcessing }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (input.trim() && !isProcessing) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 w-[90vw] max-w-sm h-[70vh] max-h-96 bg-white rounded-2xl shadow-2xl flex flex-col z-40 overflow-hidden border-4 border-purple-300">
      <header className="bg-purple-400 text-white p-4 flex justify-between items-center">
        <h3 className="text-xl font-fredoka flex items-center gap-2">
            <SparklesIcon className="w-6 h-6"/>
            Ask Sparky!
        </h3>
        <button onClick={onClose} className="text-white hover:text-purple-200">
          <XMarkIcon className="w-6 h-6" />
        </button>
      </header>
      <div className="flex-1 p-4 overflow-y-auto bg-purple-50">
        <div className="flex flex-col gap-3">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-sm px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-blue-400 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex justify-start">
               <div className="max-w-xs lg:max-w-sm px-4 py-2 rounded-2xl bg-gray-200 text-gray-800 rounded-bl-none">
                <span className="animate-pulse">...thinking</span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <footer className="p-2 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400"
            disabled={isProcessing}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isProcessing}
            className="bg-purple-500 text-white p-3 rounded-full hover:bg-purple-600 disabled:bg-gray-400 transition-colors"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Chatbot;
