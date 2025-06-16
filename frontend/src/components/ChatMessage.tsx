import React from 'react';
import { MessageBubble, Spinner } from '../styles/Chat';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <MessageBubble $isUser={message.isUser}>
      {!message.isUser && message.isLoading ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Spinner />
          <span>Thinking...</span>
        </div>
      ) : (
        message.text
      )}
    </MessageBubble>
  );
}; 