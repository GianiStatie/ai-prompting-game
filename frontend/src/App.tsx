import { useState, useEffect } from 'react';
import { Message } from './types';
import { AppContainer, MainContent, ToggleButton, TipsButton, CountersContainer } from './styles/Layout';
import { InputContainer, InputForm, Input, SendButton } from './styles/Chat';
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
    selectChat,
    deleteChat,
    renameChat,
    clearAllChats,
  } = useChats();

  const {
    rules,
    lives,
    isSessionComplete,
    hasSeenCongratulations,
    hasSeenGameOver,
    showConfetti,
    handleFetchRules,
    resetGameState,
    completeSession,
    startNewSession,
    decreaseLives,
    addRule,
    setHasSeenGameOver
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
  } = usePopups(lives);

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

  // Load isSessionComplete state when active chat changes
  useEffect(() => {
    if (activeChatId) {
      const activeChat = chats.find(chat => chat.id === activeChatId);
      // This will be handled by the useGameState hook if needed
    }
  }, [activeChatId, chats]);

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
      timestamp: new Date().toISOString()
    };
    
    addMessageToChat(currentChatId, aiMessage);

    // Send message using the chat service
    const response = await chatService.sendMessage(
      userMessage,
      currentMessages,
      rules,
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
      // Handle error
      const errorMessage: Message = {
        id: Date.now() + 2,
        text: response.error || 'Sorry, there was an error processing your message.',
        isUser: false,
        timestamp: new Date().toISOString()
      };
      addMessageToChat(currentChatId, errorMessage);
    }

    setIsStreaming(false);
  };

  const handleNewChat = () => {
    createNewChat();
    handleFetchRules();
    startNewSession();
  };

  const handleChatSelect = (chatId: string) => {
    selectChat(chatId);
    const selectedChat = chats.find(chat => chat.id === chatId);
    // Handle session complete state if needed
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
        onCloseTips={closeTips}
        onCancelReset={closeResetConfirm}
        onConfirmReset={handleConfirmReset}
        onGameOverDismiss={handleGameOverDismiss}
        onGameOverReset={handleGameOverReset}
        onNewChat={handleNewChat}
      />
      
      <SideDrawer $isOpen={isDrawerOpen}>
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
            <Input
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, () => handleSubmit(e as any))}
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