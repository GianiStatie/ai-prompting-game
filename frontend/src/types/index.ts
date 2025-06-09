export interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp?: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  isSessionComplete?: boolean;
}

export interface Rule {
  id: number;
  title: string;
  description: string;
} 