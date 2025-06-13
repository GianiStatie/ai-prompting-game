import React from 'react';
import { Chat } from '../types';
import {
  ChatHistorySection,
  ChatHistoryHeader,
  ChatHistoryTitle,
  ChatList,
  ChatItem,
  ChatTitle,
  ChatTitleInput,
  EditButton,
  DeleteButton,
} from '../styles/Sidebar';

interface ChatHistoryProps {
  chats: Chat[];
  activeChatId: string | null;
  editingChatId: string | null;
  editingTitle: string;
  onChatSelect: (chatId: string) => void;
  onStartRename: (chatId: string, currentTitle: string, e: React.MouseEvent) => void;
  onSaveRename: (chatId: string) => void;
  onCancelRename: () => void;
  onRenameKeyDown: (e: React.KeyboardEvent, chatId: string) => void;
  onDeleteChat: (chatId: string, e: React.MouseEvent) => void;
  onEditingTitleChange: (title: string) => void;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  chats,
  activeChatId,
  editingChatId,
  editingTitle,
  onChatSelect,
  onStartRename,
  onSaveRename,
  onCancelRename,
  onRenameKeyDown,
  onDeleteChat,
  onEditingTitleChange,
}) => {
  return (
    <ChatHistorySection>
      <ChatHistoryHeader>
        <ChatHistoryTitle>Chat History</ChatHistoryTitle>
      </ChatHistoryHeader>
      <ChatList>
        {chats.map((chat) => (
          <ChatItem 
            key={chat.id} 
            $isActive={chat.id === activeChatId}
            onClick={() => onChatSelect(chat.id)}
          >
            {editingChatId === chat.id ? (
              <ChatTitleInput
                value={editingTitle}
                onChange={(e) => onEditingTitleChange(e.target.value)}
                onKeyDown={(e) => onRenameKeyDown(e, chat.id)}
                onBlur={() => {
                  if (editingTitle.trim()) {
                    onSaveRename(chat.id);
                  } else {
                    onCancelRename();
                  }
                }}
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <ChatTitle>
                {chat.title}
              </ChatTitle>
            )}
            <EditButton onClick={(e) => onStartRename(chat.id, chat.title, e)}>
              ✏️
            </EditButton>
            <DeleteButton onClick={(e) => onDeleteChat(chat.id, e)}>
              ×
            </DeleteButton>
          </ChatItem>
        ))}
      </ChatList>
    </ChatHistorySection>
  );
}; 