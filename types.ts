export type StoryMode = 'linear' | 'interactive';
export type AppScreen = 'home' | 'loading' | 'story';
export type AgeRange = '2-4' | '5-7' | '8-10';

export interface StoryConfig {
  childName: string;
  theme: string;
  pageCount: 5 | 10 | 15 | 20;
  includeChild: boolean;
  mode: StoryMode;
  ageRange: AgeRange;
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