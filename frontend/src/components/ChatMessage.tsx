import React from 'react';
import { MessageBubble } from '../styles/Chat';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <MessageBubble $isUser={message.isUser}>
      {message.text}
    </MessageBubble>
  );
}; 