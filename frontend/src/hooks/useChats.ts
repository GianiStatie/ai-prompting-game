import { useState, useEffect } from 'react';
import { Chat, Message } from '../types';
import { 
  loadChatsFromStorage, 
  saveChatsToStorage, 
  loadActiveChatIdFromStorage, 
  saveActiveChatIdToStorage 
} from '../utils/localStorage';
import { generateChatTitle } from '../utils/chat';

export const useChats = () => {
  const [chats, setChats] = useState<Chat[]>(loadChatsFromStorage);
  const [activeChatId, setActiveChatId] = useState<string | null>(loadActiveChatIdFromStorage);

  // Save chats to localStorage whenever chats change
  useEffect(() => {
    saveChatsToStorage(chats);
  }, [chats]);

  // Save active chat ID to localStorage whenever it changes
  useEffect(() => {
    saveActiveChatIdToStorage(activeChatId);
  }, [activeChatId]);

  // Get current chat messages
  const currentMessages = chats.find(chat => chat.id === activeChatId)?.messages || [];

  // Create a new chat
  const createNewChat = (skipCheck: boolean = false): string => {
    let nextNumber = 1;
    const newChatId = `chat_${Date.now()}`;

    if (!skipCheck) {
      // Count existing "Attempt" titles to determine the next number
      const newChatPattern = /^Attempt (\d+)$/;
      const existingNewChatNumbers = chats
        .filter(chat => newChatPattern.test(chat.title))
        .map(chat => {
          const match = chat.title.match(/^Attempt (\d+)$/);
          return match ? parseInt(match[1], 10) : 0;
        })
        .sort((a, b) => a - b);
      
      for (const num of existingNewChatNumbers) {
        if (num === nextNumber) {
          nextNumber++;
        } else {
          break;
        }
      }
    }

    const newChat: Chat = {
      id: newChatId,
      title: `Attempt ${nextNumber}`,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isSessionComplete: false
    };
    
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChatId);
    
    return newChatId;
  };

  // Add message to chat
  const addMessageToChat = (chatId: string, message: Message) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        const updatedMessages = [...chat.messages, message];
        const title = chat.messages.length === 0 ? generateChatTitle(message.text) : chat.title;
        return {
          ...chat,
          messages: updatedMessages,
          title,
          updatedAt: new Date().toISOString()
        };
      }
      return chat;
    }));
  };

  // Update message in chat
  const updateMessageInChat = (chatId: string, messageId: number, text: string) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        const updatedMessages = [...chat.messages];
        const messageIndex = updatedMessages.findIndex(msg => msg.id === messageId);
        if (messageIndex !== -1) {
          updatedMessages[messageIndex] = { ...updatedMessages[messageIndex], text };
        }
        return {
          ...chat,
          messages: updatedMessages,
          updatedAt: new Date().toISOString()
        };
      }
      return chat;
    }));
  };

  // Mark chat as complete
  const markChatAsComplete = (chatId: string) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          isSessionComplete: true,
          updatedAt: new Date().toISOString()
        };
      }
      return chat;
    }));
  };

  // Select chat
  const selectChat = (chatId: string) => {
    setActiveChatId(chatId);
  };

  // Delete chat
  const deleteChat = (chatId: string) => {
    setChats(prev => {
      const updatedChats = prev.filter(chat => chat.id !== chatId);
      
      // If we deleted the active chat, select another one or create new
      if (chatId === activeChatId) {
        if (updatedChats.length > 0) {
          setActiveChatId(updatedChats[0].id);
        } else {
          // Create a new chat if no chats remain
          setTimeout(() => createNewChat(), 0);
        }
      }
      
      return updatedChats;
    });
  };

  // Rename chat
  const renameChat = (chatId: string, newTitle: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, title: newTitle.trim(), updatedAt: new Date().toISOString() }
        : chat
    ));
  };

  // Clear all chats
  const clearAllChats = () => {
    setChats([]);
    setActiveChatId(null);
  };

  return {
    chats,
    activeChatId,
    currentMessages,
    createNewChat,
    addMessageToChat,
    updateMessageInChat,
    markChatAsComplete,
    selectChat,
    deleteChat,
    renameChat,
    clearAllChats,
    setChats,
    setActiveChatId
  };
}; 