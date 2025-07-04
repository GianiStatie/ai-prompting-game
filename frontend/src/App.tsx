import { useState, useEffect } from 'react';
import { Message } from './types';
import { AppContainer, MainContent, ToggleButton, TipsButton, CountersContainer } from './styles/Layout';
import { InputContainer, InputForm, SendButton } from './styles/Chat';
import { HighlightedInput } from './components/HighlightedInput';
import { SideDrawer, DrawerContent, NewChatButton, ResetButton, PlusIcon } from './styles/Sidebar';
import { ChatContainer } from './components/ChatContainer';
import { LifeCounter } from './components/LifeCounter';
import { AILevelCounter } from './components/AILevelCounter';
import { ChatHistory } from './components/ChatHistory';
import { RulesSection } from './components/RulesSection';
import { PopupsContainer } from './components/PopupsContainer';
import { Confetti } from './components/Confetti';
import { useChats } from './hooks/useChats';
import { useGameState } from './hooks/useGameState';
import { usePopups } from './hooks/usePopups';
import { useChatInput } from './hooks/useChatInput';
import { useChatRename } from './hooks/useChatRename';
import { useUIState } from './hooks/useUIState';
import { ChatService } from './services/chatService';

function App() {
  const {
    chats,
    activeChatId,
    currentMessages,
    createNewChat,
    addMessageToChat,
    updateMessageInChat,
    markChatAsComplete,
    markCongratulationsAsSeen,
    selectChat,
    deleteChat,
    renameChat,
    clearAllChats,
  } = useChats();

  const {
    rules,
    lives,
    sessionId,
    isSessionComplete,
    hasSeenGameOver,
    showConfetti,
    handleFetchRules,
    resetGameState,
    completeSession,
    startNewSession,
    decreaseLives,
    addRule,
    setHasSeenGameOver,
    setIsSessionComplete
  } = useGameState();

  const {
    showResetConfirm,
    showGameOverPopup,
    showTips,
    openResetConfirm,
    closeResetConfirm,
    closeGameOver,
    openTips,
    closeTips
  } = usePopups(lives, hasSeenGameOver);

  const [isStreaming, setIsStreaming] = useState(false);
  const chatService = new ChatService();

  const {
    inputValue,
    setInputValue,
    textareaRef,
    clearInput,
    handleKeyDown,
    canSubmit,
    getPlaceholder,
    getButtonText,
    isDisabled
  } = useChatInput(isStreaming, isSessionComplete, lives);

  const {
    editingChatId,
    editingTitle,
    setEditingTitle,
    startRename,
    saveRename,
    cancelRename,
    handleKeyDown: handleRenameKeyDown
  } = useChatRename();

  const { isDrawerOpen, isRulesOpen, toggleDrawer, toggleRules } = useUIState();

  // Initialize app with a new chat if no chats exist
  useEffect(() => {
    if (chats.length === 0 && !activeChatId) {
      createNewChat(true);
      handleFetchRules();
    }
  }, []); // Empty dependency array means this runs once on mount

  // Load isSessionComplete state when active chat changes
  useEffect(() => {
    if (activeChatId) {
      const activeChat = chats.find(chat => chat.id === activeChatId);
      setIsSessionComplete(activeChat?.isSessionComplete || false);
    } else {
      setIsSessionComplete(false);
    }
  }, [activeChatId, chats]);

  // Mobile sidebar backdrop click handler
  useEffect(() => {
    const handleBackdropClick = (e: MouseEvent) => {
      // Check if we're on mobile (width < 768px)
      if (window.innerWidth < 768 && isDrawerOpen) {
        const sidebar = document.querySelector('[data-sidebar]');
        if (sidebar && !sidebar.contains(e.target as Node)) {
          toggleDrawer();
        }
      }
    };

    if (isDrawerOpen) {
      // Add a small delay to prevent immediate closing when opening
      const timer = setTimeout(() => {
        document.addEventListener('click', handleBackdropClick);
      }, 100);
      
      return () => {
        clearTimeout(timer);
        document.removeEventListener('click', handleBackdropClick);
      };
    }
  }, [isDrawerOpen, toggleDrawer]);

  // Get hasSeenCongratulations from the current active chat
  const currentChat = chats.find(chat => chat.id === activeChatId);
  const hasSeenCongratulations = currentChat?.hasSeenCongratulations || false;

  // Close drawer on mobile when any popup appears
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const anyPopupOpen = showTips || showResetConfirm || showGameOverPopup || 
                        (isSessionComplete && !hasSeenCongratulations);
    
    if (isMobile && anyPopupOpen && isDrawerOpen) {
      toggleDrawer();
    }
  }, [showTips, showResetConfirm, showGameOverPopup, isSessionComplete, hasSeenCongratulations, isDrawerOpen, toggleDrawer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    
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

    addMessageToChat(currentChatId, userMessage);
    clearInput();

    // Create a new message for the AI response
    const aiMessage: Message = {
      id: Date.now() + 1,
      text: '',
      isUser: false,
      timestamp: new Date().toISOString(),
      isLoading: true
    };
    
    addMessageToChat(currentChatId, aiMessage);

    // Send message using the chat service
    const response = await chatService.sendMessage(
      userMessage,
      currentMessages,
      rules,
      sessionId,
      (text) => {
        updateMessageInChat(currentChatId, aiMessage.id, text);
      }
    );

    if (response.success) {
      // Handle session completion
      if (response.sessionCompleted) {
        completeSession();
        markChatAsComplete(currentChatId);
        if (response.newRule) {
          addRule(response.newRule);
        }
      }
      
      // Decrease lives only if it was a password attempt and session is not complete
      if (!response.sessionCompleted && response.wasPasswordAttempt) {
        decreaseLives();
      }
    } else {
      // Handle error - update the AI message with error text
      updateMessageInChat(currentChatId, aiMessage.id, response.error || 'Sorry, there was an error processing your message.');
    }

    setIsStreaming(false);
  };

  const handleNewChat = () => {
    // Mark congratulations as seen for the current chat before creating a new one
    if (activeChatId) {
      markCongratulationsAsSeen(activeChatId);
    }
    
    // Close drawer on mobile when creating new chat
    if (window.innerWidth < 768 && isDrawerOpen) {
      toggleDrawer();
    }
    
    createNewChat();
    handleFetchRules();
    startNewSession();
  };

  const handleChatSelect = (chatId: string) => {
    selectChat(chatId);
    // Mark congratulations as seen when switching to a different completed chat
    const selectedChat = chats.find(chat => chat.id === chatId);
    if (selectedChat?.isSessionComplete && !selectedChat?.hasSeenCongratulations) {
      markCongratulationsAsSeen(chatId);
    }
  };

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteChat(chatId);
  };

  const handleStartRename = (chatId: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    startRename(chatId, currentTitle);
  };

  const handleSaveRename = (chatId: string) => {
    saveRename(chatId, renameChat);
  };

  const handleRenameKeyDownWrapper = (e: React.KeyboardEvent, chatId: string) => {
    handleRenameKeyDown(e, chatId, renameChat);
  };

  const handleResetAll = () => {
    openResetConfirm();
  };

  const handleConfirmReset = async () => {
    resetGameState();
    clearAllChats();
    await chatService.resetGame();
    
    closeResetConfirm();
    
    // Create a new chat and fetch fresh rules
    setTimeout(() => {
      createNewChat(true);
      handleFetchRules();
    }, 0);
  };

  const handleGameOverDismiss = () => {
    closeGameOver();
    setHasSeenGameOver(true);
  };

  const handleGameOverReset = () => {
    closeGameOver();
    setHasSeenGameOver(true);
    handleResetAll();
  };

  return (
    <AppContainer>
      {showConfetti && <Confetti active={true} duration={5000} />}
      
      <PopupsContainer
        showTips={showTips}
        showResetConfirm={showResetConfirm}
        showGameOverPopup={showGameOverPopup}
        isSessionComplete={isSessionComplete}
        hasSeenCongratulations={hasSeenCongratulations}
        rules={rules}
        onCloseTips={closeTips}
        onCancelReset={closeResetConfirm}
        onConfirmReset={handleConfirmReset}
        onGameOverDismiss={handleGameOverDismiss}
        onGameOverReset={handleGameOverReset}
        onNewChat={handleNewChat}
      />
      
      <SideDrawer $isOpen={isDrawerOpen} data-sidebar>
        <DrawerContent>
          <NewChatButton onClick={handleNewChat}>
            <PlusIcon>+</PlusIcon>
            New Conversation
          </NewChatButton>
          
          <ChatHistory
            chats={chats}
            activeChatId={activeChatId}
            editingChatId={editingChatId}
            editingTitle={editingTitle}
            onChatSelect={handleChatSelect}
            onStartRename={handleStartRename}
            onSaveRename={handleSaveRename}
            onCancelRename={cancelRename}
            onRenameKeyDown={handleRenameKeyDownWrapper}
            onDeleteChat={handleDeleteChat}
            onEditingTitleChange={setEditingTitle}
          />
          
          <RulesSection
            rules={rules}
            isRulesOpen={isRulesOpen}
            onToggleRules={toggleRules}
          />
          
          <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
            <div style={{ 
              padding: '8px 0', 
              borderTop: '1px solid #333', 
              marginBottom: '12px',
              fontSize: '12px',
              color: '#888',
              textAlign: 'center',
              lineHeight: '1.4'
            }}>
              <div style={{ marginBottom: '4px' }}>
                Made by <a 
                  href="https://ro.linkedin.com/in/giani-statie" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: '#0077b5', 
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => (e.target as HTMLAnchorElement).style.textDecoration = 'underline'}
                  onMouseLeave={(e) => (e.target as HTMLAnchorElement).style.textDecoration = 'none'}
                >
                  Giani Statie
                </a>
              </div>
              <div style={{ fontSize: '11px', display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <a 
                  href="https://github.com/gianistatie/ai-prompting-game" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: '#888', 
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLAnchorElement).style.color = '#fff';
                    (e.target as HTMLAnchorElement).style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLAnchorElement).style.color = '#888';
                    (e.target as HTMLAnchorElement).style.textDecoration = 'none';
                  }}
                >
                  🔗 Source Code
                </a>
                <span>•</span>
                <a 
                  href="https://2bytesgoat.com/Projects/LanguageModels/Prompt-it!" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: '#888', 
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLAnchorElement).style.color = '#fff';
                    (e.target as HTMLAnchorElement).style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLAnchorElement).style.color = '#888';
                    (e.target as HTMLAnchorElement).style.textDecoration = 'none';
                  }}
                >
                  📝 Blog Post
                </a>
              </div>
            </div>
            <ResetButton onClick={handleResetAll}>
              <span>🔄</span>
              Reset Everything
            </ResetButton>
          </div>
        </DrawerContent>
      </SideDrawer>
      
      <MainContent>
        <ToggleButton $isDrawerOpen={isDrawerOpen} onClick={toggleDrawer}>
          {isDrawerOpen ? '←' : '→'}
        </ToggleButton>
        <TipsButton onClick={openTips} title="Tips & Strategies">
          💡
        </TipsButton>
        <CountersContainer>
          <LifeCounter lives={lives} />
          <AILevelCounter rules={rules} />
        </CountersContainer>
        
        <ChatContainer messages={currentMessages} />
        
        <InputContainer>
          <InputForm onSubmit={handleSubmit}>
            <HighlightedInput
              textareaRef={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, () => handleSubmit(e as React.FormEvent))}
              placeholder={getPlaceholder()}
              disabled={isDisabled}
            />
            <SendButton type="submit" disabled={isDisabled || !canSubmit}>
              {getButtonText()}
            </SendButton>
          </InputForm>
        </InputContainer>
      </MainContent>
    </AppContainer>
  );
}

export default App; 