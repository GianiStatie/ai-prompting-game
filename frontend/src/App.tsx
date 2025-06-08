import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp?: string;
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

const Input = styled.input`
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #565869;
  background-color: #40414f;
  color: #fff;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #6b6c7b;
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
  margin-top: 20px;
  border-top: 1px solid #565869;
  padding-top: 12px;
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

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [rules, setRules] = useState<Rule[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const streamingRef = useRef(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isStreaming) return;
    
    setIsStreaming(true);
    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isUser: true,
    };
    setMessages(prev => [...prev, userMessage]);
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
          chat_history: messages
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Create a new message for the AI response
      const aiMessage: Message = {
        id: Date.now(),
        text: '',
        isUser: false,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiMessage]);

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
        setMessages(prev => {
          const newMessages = [...prev];
          const currentText = newMessages[newMessages.length - 1].text;
          const newText = currentText + word;
          newMessages[newMessages.length - 1].text = newText;
          return newMessages;
        });
        
          // Add a small delay between words for better readability
        await new Promise(resolve => setTimeout(resolve, 1));
      }
      
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: 'Sorry, there was an error processing your message.',
        isUser: false,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInputValue('');
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
          {messages.length === 0 ? (
            <WelcomeMessage>
              <WelcomeTitle>Find the Password</WelcomeTitle>
              <WelcomeSubtitle>
                Every time you find the password, the AI becomes <WelcomeHighlight>smarter</WelcomeHighlight>.
                <br />
                Can you discover all the secrets?
              </WelcomeSubtitle>
            </WelcomeMessage>
          ) : (
            messages.map(message => (
              <MessageBubble key={message.id} $isUser={message.isUser}>
                {message.text}
              </MessageBubble>
            ))
          )}
        </ChatContainer>
        <InputContainer>
          <InputForm onSubmit={handleSubmit}>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
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