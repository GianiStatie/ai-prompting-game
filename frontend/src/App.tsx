import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp?: string;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

interface Rule {
  id: number;
  title: string;
  description: string;
}

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #343541;
  color: #fff;
`;

const SideDrawer = styled.div<{ $isOpen: boolean }>`
  width: ${props => props.$isOpen ? '260px' : '0'};
  background-color: #202123;
  transition: width 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const DrawerContent = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const NewChatButton = styled.button`
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #565869;
  background-color: transparent;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: background-color 0.2s;
  white-space: nowrap;

  &:hover {
    background-color: #2b2c2f;
  }
`;

const PlusIcon = styled.span`
  font-size: 18px;
  line-height: 1;
`;

const ToggleButton = styled.button`
  position: absolute;
  left: 12px;
  top: 12px;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #565869;
  background-color: transparent;
  color: #fff;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2b2c2f;
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 48px;
  position: relative;
`;

const MessageBubble = styled.div<{ $isUser: boolean }>`
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: ${props => props.$isUser ? '#2b2c2f' : '#444654'};
  align-self: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  margin-left: ${props => props.$isUser ? 'auto' : '0'};
  margin-right: ${props => props.$isUser ? '0' : 'auto'};
`;

const InputContainer = styled.div`
  padding: 20px;
  background-color: #343541;
  border-top: 1px solid #565869;
`;

const InputForm = styled.form`
  display: flex;
  gap: 10px;
  max-width: 800px;
  margin: 0 auto;
`;

const Input = styled.textarea`
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #565869;
  background-color: #40414f;
  color: #fff;
  font-size: 16px;
  resize: none;
  min-height: 48px;
  max-height: 60px; /* 3 rows approximately */
  overflow-y: auto;
  font-family: inherit;
  line-height: 1.5;
  
  &:focus {
    outline: none;
    border-color: #6b6c7b;
  }

  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #565869;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #6b6c7b;
  }
`;

const SendButton = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  background-color: #19c37d;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #15a067;
  }
`;

const RulesSection = styled.div`
  margin-top: 0px;
  padding-top: 0px;
`;

const RulesHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2b2c2f;
  }
`;

const RulesTitle = styled.span`
  font-size: 14px;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RulesCount = styled.span`
  font-size: 12px;
  color: #c5c5d2;
  background-color: #2b2c2f;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
`;

const RulesList = styled.div<{ $isOpen: boolean }>`
  max-height: ${props => props.$isOpen ? '300px' : '0'};
  overflow-y: auto;
  transition: max-height 0.3s ease;
  margin-top: 8px;
  padding-right: 4px;

  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #565869;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #6b6c7b;
  }
`;

const RuleItem = styled.div`
  padding: 8px 12px;
  font-size: 13px;
  color: #c5c5d2;
  border-radius: 4px;
  margin-bottom: 4px;
  background-color: #2b2c2f;
`;

const ChevronIcon = styled.span<{ $isOpen: boolean }>`
  transform: rotate(${props => props.$isOpen ? '90deg' : '0deg'});
  transition: transform 0.2s ease;
  font-size: 12px;
`;

const WelcomeMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 20px;
  gap: 16px;
  max-width: 600px;
  width: 100%;
`;

const WelcomeTitle = styled.h1`
  font-size: 32px;
  color: #fff;
  margin: 0;
`;

const WelcomeSubtitle = styled.p`
  font-size: 16px;
  color: #c5c5d2;
  margin: 0;
  line-height: 1.5;
`;

const WelcomeHighlight = styled.span`
  color: #19c37d;
  font-weight: bold;
`;

const ChatHistorySection = styled.div`
  margin-bottom: 0px;
  border-bottom: 1px solid #565869;
  padding-bottom: 12px;
`;

const ChatHistoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px;
  margin-bottom: 8px;
`;

const ChatHistoryTitle = styled.span`
  font-size: 14px;
  color: #fff;
  font-weight: 600;
`;

const ChatList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 4px;

  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #565869;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #6b6c7b;
  }
`;

const ChatItem = styled.div<{ $isActive: boolean }>`
  padding: 8px 12px;
  font-size: 13px;
  color: ${props => props.$isActive ? '#fff' : '#c5c5d2'};
  border-radius: 4px;
  cursor: pointer;
  background-color: ${props => props.$isActive ? '#19c37d' : 'transparent'};
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  group: relative;

  &:hover {
    background-color: ${props => props.$isActive ? '#19c37d' : '#2b2c2f'};
  }
`;

const ChatTitle = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 2px 4px;
  border-radius: 4px;
`;

const ChatTitleInput = styled.input`
  flex: 1;
  background: transparent;
  border: 1px solid #565869;
  border-radius: 4px;
  color: inherit;
  font-size: inherit;
  font-family: inherit;
  padding: 2px 4px;
  outline: none;

  &:focus {
    border-color: #19c37d;
  }
`;

const ActionButton = styled.button`
  opacity: 0;
  background: none;
  border: none;
  color: #c5c5d2;
  cursor: pointer;
  padding: 2px;
  border-radius: 2px;
  font-size: 12px;
  transition: opacity 0.2s;

  ${ChatItem}:hover & {
    opacity: 1;
  }
`;

const EditButton = styled(ActionButton)`
  transition: all 0.2s ease;
  
  &:hover {
    color: #19c37d;
    background-color: rgba(25, 195, 125, 0.2);
    transform: scale(1.25);
  }
`;

const DeleteButton = styled(ActionButton)`
  margin-left: 4px;
  
  &:hover {
    color: #ff6b6b;
    background-color: rgba(255, 107, 107, 0.1);
  }
`;

function App() {
  // Load chats from localStorage on initialization
  const loadChatsFromStorage = (): Chat[] => {
    try {
      const storedChats = localStorage.getItem('ai-prompting-game-chats');
      if (storedChats) {
        return JSON.parse(storedChats);
      }
    } catch (error) {
      console.error('Error loading chats from localStorage:', error);
    }
    return [];
  };

  // Save chats to localStorage
  const saveChatsToStorage = (chats: Chat[]) => {
    try {
      localStorage.setItem('ai-prompting-game-chats', JSON.stringify(chats));
    } catch (error) {
      console.error('Error saving chats to localStorage:', error);
    }
  };

  // Load active chat ID from localStorage
  const loadActiveChatIdFromStorage = (): string | null => {
    try {
      return localStorage.getItem('ai-prompting-game-active-chat-id');
    } catch (error) {
      console.error('Error loading active chat ID from localStorage:', error);
    }
    return null;
  };

  // Save active chat ID to localStorage
  const saveActiveChatIdToStorage = (chatId: string | null) => {
    try {
      if (chatId) {
        localStorage.setItem('ai-prompting-game-active-chat-id', chatId);
      } else {
        localStorage.removeItem('ai-prompting-game-active-chat-id');
      }
    } catch (error) {
      console.error('Error saving active chat ID to localStorage:', error);
    }
  };

  const [chats, setChats] = useState<Chat[]>(loadChatsFromStorage);
  const [activeChatId, setActiveChatId] = useState<string | null>(loadActiveChatIdFromStorage);
  const [inputValue, setInputValue] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [rules, setRules] = useState<Rule[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  // Generate chat title from first message
  const generateChatTitle = (firstMessage: string): string => {
    const words = firstMessage.trim().split(' ');
    const title = words.slice(0, 6).join(' ');
    return title.length > 50 ? title.substring(0, 47) + '...' : title;
  };

  // Create a new chat
  const createNewChat = (): string => {
    const newChatId = `chat_${Date.now()}`;
    
    // Count existing "New Chat" titles to determine the next number
    const newChatPattern = /^New Chat( \d+)?$/;
    const existingNewChatNumbers = chats
      .filter(chat => newChatPattern.test(chat.title))
      .map(chat => {
        const match = chat.title.match(/^New Chat( (\d+))?$/);
        return match && match[2] ? parseInt(match[2], 10) : 1;
      })
      .sort((a, b) => a - b);
    
    // Find the next available number
    let nextNumber = 1;
    for (const num of existingNewChatNumbers) {
      if (num === nextNumber) {
        nextNumber++;
      } else {
        break;
      }
    }
    
    const newChat: Chat = {
      id: newChatId,
      title: `New Chat ${nextNumber}`,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChatId);
    return newChatId;
  };

  // Initialize with first chat and validate active chat ID
  useEffect(() => {
    if (chats.length === 0) {
      createNewChat();
    } else {
      // Validate that the active chat ID exists in the loaded chats
      if (activeChatId && !chats.find(chat => chat.id === activeChatId)) {
        // If active chat ID doesn't exist, set to the first chat
        setActiveChatId(chats[0].id);
      } else if (!activeChatId) {
        // If no active chat ID, set to the first chat
        setActiveChatId(chats[0].id);
      }
    }
  }, []);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/rules`);
        const data = await response.json();
        setRules(data);
      } catch (error) {
        console.error('Error fetching rules:', error);
      }
    };

    fetchRules();
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 120; // 3 rows max
      textarea.style.height = Math.min(scrollHeight, maxHeight) + 'px';
    }
  }, [inputValue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isStreaming) return;
    
    // Ensure we have an active chat
    let currentChatId = activeChatId;
    if (!currentChatId) {
      currentChatId = createNewChat();
    }
    
    setIsStreaming(true);
    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isUser: true,
    };

    // Update chat with user message
    setChats(prev => prev.map(chat => {
      if (chat.id === currentChatId) {
        const updatedMessages = [...chat.messages, userMessage];
        const title = chat.messages.length === 0 ? generateChatTitle(inputValue) : chat.title;
        return {
          ...chat,
          messages: updatedMessages,
          title,
          updatedAt: new Date().toISOString()
        };
      }
      return chat;
    }));

    setInputValue('');

    try {
      // Send message to backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat-stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          chat_history: currentMessages
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Create a new message for the AI response
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: '',
        isUser: false,
        timestamp: new Date().toISOString()
      };
      
      // Add AI message to chat
      setChats(prev => prev.map(chat => {
        if (chat.id === currentChatId) {
          return {
            ...chat,
            messages: [...chat.messages, aiMessage],
            updatedAt: new Date().toISOString()
          };
        }
        return chat;
      }));

      // Get the response reader
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      // Read the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Convert the chunk to text
        const word = new TextDecoder().decode(value);
        
        // Update the AI message with the new word
        setChats(prev => prev.map(chat => {
          if (chat.id === currentChatId) {
            const updatedMessages = [...chat.messages];
            const lastMessage = updatedMessages[updatedMessages.length - 1];
            if (!lastMessage.isUser) {
              lastMessage.text += word;
            }
            return {
              ...chat,
              messages: updatedMessages,
              updatedAt: new Date().toISOString()
            };
          }
          return chat;
        }));
        
        // Add a small delay between words for better readability
        await new Promise(resolve => setTimeout(resolve, 1));
      }
      
    } catch (error) {
      console.error('Error:', error);
      setChats(prev => prev.map(chat => {
        if (chat.id === currentChatId) {
          return {
            ...chat,
            messages: [...chat.messages, {
              id: Date.now() + 2,
              text: 'Sorry, there was an error processing your message.',
              isUser: false,
              timestamp: new Date().toISOString()
            }],
            updatedAt: new Date().toISOString()
          };
        }
        return chat;
      }));
    } finally {
      setIsStreaming(false);
    }
  };

  const handleNewChat = () => {
    createNewChat();
    setInputValue('');
  };

  const handleChatSelect = (chatId: string) => {
    setActiveChatId(chatId);
  };

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleStartRename = (chatId: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingChatId(chatId);
    setEditingTitle(currentTitle);
  };

  const handleSaveRename = (chatId: string) => {
    if (editingTitle.trim()) {
      setChats(prev => prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, title: editingTitle.trim(), updatedAt: new Date().toISOString() }
          : chat
      ));
    }
    setEditingChatId(null);
    setEditingTitle('');
  };

  const handleCancelRename = () => {
    setEditingChatId(null);
    setEditingTitle('');
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent, chatId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveRename(chatId);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelRename();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const toggleRules = () => {
    setIsRulesOpen(!isRulesOpen);
  };

  return (
    <AppContainer>
      <SideDrawer $isOpen={isDrawerOpen}>
        <DrawerContent>
          <NewChatButton onClick={handleNewChat}>
            <PlusIcon>+</PlusIcon>
            New Chat
          </NewChatButton>
          
          <ChatHistorySection>
            <ChatHistoryHeader>
              <ChatHistoryTitle>Chat History</ChatHistoryTitle>
            </ChatHistoryHeader>
            <ChatList>
              {chats.map((chat) => (
                <ChatItem 
                  key={chat.id} 
                  $isActive={chat.id === activeChatId}
                  onClick={() => handleChatSelect(chat.id)}
                >
                  {editingChatId === chat.id ? (
                    <ChatTitleInput
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onKeyDown={(e) => handleRenameKeyDown(e, chat.id)}
                      onBlur={() => handleSaveRename(chat.id)}
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <ChatTitle>
                      {chat.title}
                    </ChatTitle>
                  )}
                  <EditButton onClick={(e) => handleStartRename(chat.id, chat.title, e)}>
                    ✏️
                  </EditButton>
                  <DeleteButton onClick={(e) => handleDeleteChat(chat.id, e)}>
                    ×
                  </DeleteButton>
                </ChatItem>
              ))}
            </ChatList>
          </ChatHistorySection>
          
          <RulesSection>
            <RulesHeader onClick={toggleRules}>
              <ChevronIcon $isOpen={isRulesOpen}>›</ChevronIcon>
              <RulesTitle>
                AI Rules
                <RulesCount>{rules.length}</RulesCount>
              </RulesTitle>
            </RulesHeader>
            <RulesList $isOpen={isRulesOpen}>
              {rules.map((rule, index) => (
                <RuleItem key={index}>{rule.title}</RuleItem>
              ))}
            </RulesList>
          </RulesSection>
        </DrawerContent>
      </SideDrawer>
      <MainContent>
        <ToggleButton onClick={toggleDrawer}>
          {isDrawerOpen ? '←' : '→'}
        </ToggleButton>
        <ChatContainer>
          {currentMessages.length === 0 ? (
            <WelcomeMessage>
              <WelcomeTitle>Find the Password</WelcomeTitle>
              <WelcomeSubtitle>
                Every time you find the password, the AI becomes <WelcomeHighlight>smarter</WelcomeHighlight>.
                <br />
                Can you discover all the secrets?
              </WelcomeSubtitle>
            </WelcomeMessage>
          ) : (
            <>
              {currentMessages.map(message => (
                <MessageBubble key={message.id} $isUser={message.isUser}>
                  {message.text}
                </MessageBubble>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </ChatContainer>
        <InputContainer>
          <InputForm onSubmit={handleSubmit}>
            <Input
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
            />
            <SendButton type="submit" disabled={isStreaming}>
              {isStreaming ? 'Sending...' : 'Send'}
            </SendButton>
          </InputForm>
        </InputContainer>
      </MainContent>
    </AppContainer>
  );
}

export default App; 