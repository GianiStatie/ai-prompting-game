export interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp?: string;
  isLoading?: boolean;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  isSessionComplete?: boolean;
  hasSeenCongratulations?: boolean;
}

export interface Rule {
  id: number;
  title: string;
  description: string;
} 