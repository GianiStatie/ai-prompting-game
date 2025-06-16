import React from 'react';
import { MessageBubble } from '../styles/Chat';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const Spinner: React.FC = () => (
  <div style={{
    display: 'inline-block',
    width: '16px',
    height: '16px',
    border: '2px solid #666',
    borderTop: '2px solid #fff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginRight: '8px'
  }} />
);

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