import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import { ChatContainer as StyledChatContainer } from '../styles/Chat';
import { WelcomeMessage } from './WelcomeMessage';
import { ChatMessage } from './ChatMessage';

interface ChatContainerProps {
  messages: Message[];
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <StyledChatContainer>
      {messages.length === 0 ? (
        <WelcomeMessage />
      ) : (
        <>
          {messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </StyledChatContainer>
  );
}; 