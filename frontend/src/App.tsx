import { useState, useEffect, useRef } from 'react';
import { Message, Rule } from './types';
import { AppContainer, MainContent, ToggleButton, CountersContainer } from './styles/Layout';
import { ChatContainer, InputContainer, InputForm, Input, SendButton } from './styles/Chat';
import { SideDrawer, DrawerContent, NewChatButton, ResetButton, PlusIcon } from './styles/Sidebar';
import { WelcomeMessage } from './components/WelcomeMessage';
import { ChatMessage } from './components/ChatMessage';
import { LifeCounter } from './components/LifeCounter';
import { AILevelCounter } from './components/AILevelCounter';
import { ChatHistory } from './components/ChatHistory';
import { RulesSection } from './components/RulesSection';
import { Popup } from './components/Popup';
import { useChats } from './hooks/useChats';
import { 
  loadRulesFromStorage, 
  saveRulesToStorage, 
  loadLivesFromStorage, 
  saveLivesToStorage,
  clearAllStorage 
} from './utils/localStorage';
import { fetchRules } from './utils/chat';
import { DEFAULT_LIVES, GAME_CONFIG } from './config/game';
import { Confetti } from './components/Confetti';

function App() {
  const {
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
    setActiveChatId
  } = useChats();
  const [inputValue, setInputValue] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [rules, setRules] = useState<Rule[]>(loadRulesFromStorage);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [hasSeenCongratulations, setHasSeenCongratulations] = useState(false);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [lives, setLives] = useState<number>(loadLivesFromStorage);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showGameOverPopup, setShowGameOverPopup] = useState(false);
  const [hasSeenGameOver, setHasSeenGameOver] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Save rules to localStorage whenever rules change
  useEffect(() => {
    saveRulesToStorage(rules);
  }, [rules]);

  // Save lives to localStorage whenever lives change
  useEffect(() => {
    saveLivesToStorage(lives);
  }, [lives]);

  // Show game over popup when lives reach 0
  useEffect(() => {
    if (lives <= 0 && !showGameOverPopup && !hasSeenGameOver) {
      setShowGameOverPopup(true);
    }
  }, [lives, showGameOverPopup, hasSeenGameOver]);

  // Reset all state and localStorage
  const handleResetAll = () => {
    setShowResetConfirm(true);
  };

  const handleConfirmReset = () => {
    // Clear all localStorage
    clearAllStorage();
    
    // Reset all state
    clearAllChats();
    setRules([]);
    setLives(DEFAULT_LIVES);
    setIsSessionComplete(false);
    setHasSeenCongratulations(false);
    setShowConfetti(false);
    setHasSeenGameOver(false);
    setInputValue('');
    setIsStreaming(false);
    setEditingChatId(null);
    setEditingTitle('');
    setShowResetConfirm(false);
    setShowGameOverPopup(false);

    // Call reset game endpoint
    fetch(`${import.meta.env.VITE_API_URL}/api/reset-game`);
    
    // Create a new chat and fetch fresh rules
    setTimeout(() => {
      createNewChat(true);
      handleFetchRules();
    }, 0);
  };

  const handleCancelReset = () => {
    setShowResetConfirm(false);
  };

  const handleGameOverDismiss = () => {
    setShowGameOverPopup(false);
    setHasSeenGameOver(true);
  };

  const handleGameOverReset = () => {
    setShowGameOverPopup(false);
    handleResetAll();
  };

  // Initialize with first chat and validate active chat ID
  useEffect(() => {
    if (chats.length === 0) {
      createNewChat(true);
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
  }, [chats, activeChatId, createNewChat, setActiveChatId]);

  // Load isSessionComplete state when active chat changes
  useEffect(() => {
    if (activeChatId) {
      const activeChat = chats.find(chat => chat.id === activeChatId);
      setIsSessionComplete(activeChat?.isSessionComplete || false);
    }
  }, [activeChatId, chats]);

  // Fetch rules from API
  const handleFetchRules = async () => {
    try {
      const data = await fetchRules();
      // Sort rules in descending order by ID
      const sortedRules = [...data].sort((a, b) => b.id - a.id);
      setRules(sortedRules);
    } catch (error) {
      console.error('Error fetching rules:', error);
      // If fetch fails and we have no rules in localStorage, keep the empty array
      if (rules.length === 0) {
        console.log('No rules available from API or localStorage');
      }
    }
  };

  useEffect(() => {
    // Only fetch rules from API if we don't have any in localStorage
    if (rules.length === 0) {
      // Clear the chat history and create a new chat
      clearAllChats();
      createNewChat(true);
      handleFetchRules();
    }
  }, [rules.length, clearAllChats, createNewChat]);

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
      const maxHeight = GAME_CONFIG.MAX_TEXTAREA_HEIGHT; // configurable max height
      textarea.style.height = Math.min(scrollHeight, maxHeight) + 'px';
    }
  }, [inputValue]);

  // Focus textarea when streaming completes
  useEffect(() => {
    if (!isStreaming && !isSessionComplete && lives > 0) {
      textareaRef.current?.focus();
    }
  }, [isStreaming, isSessionComplete, lives]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isStreaming || isSessionComplete || lives <= 0) return;
    
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

    // Add user message to chat
    addMessageToChat(currentChatId, userMessage);
    setInputValue('');

    let sessionCompleted = false;

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
      addMessageToChat(currentChatId, aiMessage);

      // Track if this was a password attempt
      let wasPasswordAttempt = false;

      // Get the response reader
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      // Read the stream
      while (true) {        
        const { done, value } = await reader.read();
        if (done) break;

        // Convert the chunk to text and parse SSE format
        const chunk = new TextDecoder().decode(value);
        
        // Split by lines and process each SSE message
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const chunkStartTime = performance.now();

              // Extract JSON from SSE format
              const jsonStr = line.substring(6); // Remove "data: " prefix
              if (jsonStr.trim()) {
                const response = JSON.parse(jsonStr);
                const { message: word, is_done, is_password_attempt } = response;
                
                // Update wasPasswordAttempt if this was a password attempt
                if (is_password_attempt) {
                  wasPasswordAttempt = true;
                }
                
                // Update the AI message with the new word
                updateMessageInChat(currentChatId, aiMessage.id, aiMessage.text + word);
                aiMessage.text += word;

                // Calculate elapsed time for processing this chunk
                const chunkElapsedTime = performance.now() - chunkStartTime;
                console.log('Chunk elapsed time:', chunkElapsedTime);
                
                // Ensure minimum delay between chunks for smooth streaming
                if (chunkElapsedTime < GAME_CONFIG.STREAMING_DELAY_MS) {
                  const remainingDelay = Math.max(0, GAME_CONFIG.STREAMING_DELAY_MS - chunkElapsedTime);
                  await new Promise(resolve => setTimeout(resolve, remainingDelay));
                }
                
                // If session is done, break the outer loop
                if (is_done) {
                  sessionCompleted = true;
                  setIsSessionComplete(true);
                  setHasSeenCongratulations(false); // Reset flag for new completion
                  setShowConfetti(true);
                  // setLives(DEFAULT_LIVES); // Refill lives when password is found
                  setHasSeenGameOver(false); // Reset game over flag when lives are restored
                  // Update the chat to mark it as complete
                  markChatAsComplete(currentChatId);
                }
              }
            } catch (parseError) {
              console.error('Error parsing SSE JSON:', parseError, 'Line:', line);
            }
          }
        }
      }
      
      // Decrease lives only after submission completes and session is not done
      if (!sessionCompleted && wasPasswordAttempt) {
        setLives(prev => prev - 1);
      }
      
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: Date.now() + 2,
        text: 'Sorry, there was an error processing your message.',
        isUser: false,
        timestamp: new Date().toISOString()
      };
      addMessageToChat(currentChatId, errorMessage);

    } finally {
      setIsStreaming(false);
    }
  };

  const handleNewChat = () => {
    createNewChat();
    handleFetchRules();
    setInputValue('');
    setIsSessionComplete(false);
    setHasSeenCongratulations(true); // Mark that user has seen and dismissed the congratulations
    setShowConfetti(false);
  };

  const handleChatSelect = (chatId: string) => {
    selectChat(chatId);
    // Load the isSessionComplete state from the selected chat
    const selectedChat = chats.find(chat => chat.id === chatId);
    setIsSessionComplete(selectedChat?.isSessionComplete || false);
  };

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteChat(chatId);
  };

  const handleStartRename = (chatId: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingChatId(chatId);
    setEditingTitle(currentTitle);
  };

  const handleSaveRename = (chatId: string) => {
    if (editingTitle.trim()) {
      renameChat(chatId, editingTitle);
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
      {showConfetti && <Confetti active={true} duration={5000} />}
      {isSessionComplete && !hasSeenCongratulations && (
        <Popup
          title="🎉 Congratulations! 🎉"
          message={
            <>
              You've successfully found the password! The AI will create a new rule based on this conversation.
              <br /><br />
              Think you can take on the AI once it levels up?
            </>
          }
          primaryButton={{
            text: "Level Up!",
            onClick: handleNewChat
          }}
        />
      )}
      {showGameOverPopup && (
        <Popup
          title="💀 Game Over 💀"
          message={
            <>
              You've run out of lives! The AI has proven too clever this time.
              <br /><br />
              You can start a new attempt with fresh lives, or reset everything to start from the beginning.
            </>
          }
          secondaryButton={{
            text: "Reset Everything",
            onClick: handleGameOverReset,
            style: { backgroundColor: '#ff6b6b' }
          }}
          primaryButton={{
            text: "Dismiss",
            onClick: handleGameOverDismiss
          }}
        />
      )}
      {showResetConfirm && (
        <Popup
          title="⚠️ Reset Everything ⚠️"
          message={
            <>
              Are you sure you want to reset everything? This will permanently delete:
              <br /><br />
              • All chat history and attempts
              <br />
              • All saved rules and progress
              <br />
              • Your current lives and session
              <br /><br />
              <strong>This action cannot be undone.</strong>
            </>
          }
          secondaryButton={{
            text: "Cancel",
            onClick: handleCancelReset,
            style: { backgroundColor: '#565869', color: '#fff' }
          }}
          primaryButton={{
            text: "Reset Everything",
            onClick: handleConfirmReset,
            style: { backgroundColor: '#ff6b6b' }
          }}
        />
      )}
      <SideDrawer $isOpen={isDrawerOpen}>
        <DrawerContent>
          <NewChatButton onClick={handleNewChat}>
            <PlusIcon>+</PlusIcon>
            New Attempt
          </NewChatButton>
          
          <ChatHistory
            chats={chats}
            activeChatId={activeChatId}
            editingChatId={editingChatId}
            editingTitle={editingTitle}
            onChatSelect={handleChatSelect}
            onStartRename={handleStartRename}
            onSaveRename={handleSaveRename}
            onCancelRename={handleCancelRename}
            onRenameKeyDown={handleRenameKeyDown}
            onDeleteChat={handleDeleteChat}
            onEditingTitleChange={setEditingTitle}
          />
          
          <RulesSection
            rules={rules}
            isRulesOpen={isRulesOpen}
            onToggleRules={toggleRules}
          />
          
          <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
            <ResetButton onClick={handleResetAll}>
              <span>🔄</span>
              Reset Everything
            </ResetButton>
          </div>
        </DrawerContent>
      </SideDrawer>
      <MainContent>
        <ToggleButton onClick={toggleDrawer}>
          {isDrawerOpen ? '←' : '→'}
        </ToggleButton>
        <CountersContainer>
          <LifeCounter lives={lives} />
          <AILevelCounter rules={rules} />
        </CountersContainer>
        <ChatContainer>
          {currentMessages.length === 0 ? (
            <WelcomeMessage />
          ) : (
            <>
              {currentMessages.map(message => (
                <ChatMessage key={message.id} message={message} />
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
              placeholder={lives <= 0 ? "No lives remaining..." : "Type your message..."}
              disabled={isStreaming || isSessionComplete || lives <= 0}
            />
            <SendButton type="submit" disabled={isStreaming || isSessionComplete || lives <= 0}>
              {isStreaming ? 'Sending...' : isSessionComplete ? 'Completed!' : lives <= 0 ? 'No Lives' : 'Send'}
            </SendButton>
          </InputForm>
        </InputContainer>
      </MainContent>
    </AppContainer>
  );
}

export default App; 