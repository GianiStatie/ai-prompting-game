import { useState } from 'react';

export const useChatRename = () => {
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const startRename = (chatId: string, currentTitle: string) => {
    setEditingChatId(chatId);
    setEditingTitle(currentTitle);
  };

  const saveRename = (chatId: string, onRename: (chatId: string, newTitle: string) => void) => {
    if (editingTitle.trim()) {
      onRename(chatId, editingTitle);
    }
    cancelRename();
  };

  const cancelRename = () => {
    setEditingChatId(null);
    setEditingTitle('');
  };

  const handleKeyDown = (e: React.KeyboardEvent, chatId: string, onRename: (chatId: string, newTitle: string) => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveRename(chatId, onRename);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelRename();
    }
  };

  return {
    editingChatId,
    editingTitle,
    setEditingTitle,
    startRename,
    saveRename,
    cancelRename,
    handleKeyDown
  };
}; 