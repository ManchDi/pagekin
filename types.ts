export type StoryMode = 'linear' | 'interactive';
export type AppScreen = 'home' | 'loading' | 'story';

export interface StoryConfig {
  childName: string;
  theme: string;
  pageCount: 5 | 10 | 15 | 20;
  includeChild: boolean;
  mode: StoryMode;
}

export interface StoryPage {
  id: number;
  text: string;
  imagePrompt: string;
  imageUrl?: string;
  userRecordingUrl?: string;
  isGenerating?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}