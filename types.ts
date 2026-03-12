export interface StoryPage {
  id: number;
  text: string;
  imagePrompt: string;
  imageUrl?: string;
  userRecordingUrl?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
