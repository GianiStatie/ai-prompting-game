import styled from 'styled-components';

export const ChatContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 48px;
  position: relative;
`;

export const MessageBubble = styled.div<{ $isUser: boolean }>`
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: ${props => props.$isUser ? '#2b2c2f' : '#444654'};
  align-self: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  margin-left: ${props => props.$isUser ? 'auto' : '0'};
  margin-right: ${props => props.$isUser ? '0' : 'auto'};
`;

export const InputContainer = styled.div`
  padding: 20px;
  background-color: #343541;
  border-top: 1px solid #565869;
`;

export const InputForm = styled.form`
  display: flex;
  gap: 10px;
  max-width: 800px;
  margin: 0 auto;
`;

export const Input = styled.textarea`
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
  
  &:focus:not(:disabled) {
    outline: none;
    border-color: #6b6c7b;
  }

  &:disabled {
    background-color: #2b2c2f;
    color: #6b6c7b;
    cursor: not-allowed;
    border-color: #3b3c3f;
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

export const SendButton = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  background-color: #19c37d;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: #15a067;
  }

  &:disabled {
    background-color: #6b6c7b;
    cursor: not-allowed;
  }
`;

export const WelcomeMessage = styled.div`
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

export const WelcomeTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const WelcomeSubtitle = styled.p`
  font-size: 16px;
  color: #c5c5d2;
  margin: 0;
  line-height: 1.5;
`;

export const WelcomeHighlight = styled.span`
  color: #19c37d;
  font-weight: bold;
`;

export const InfoButton = styled.button`
  background: none;
  border: none;
  color: #565869;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    color: #19c37d;
    background-color: rgba(25, 195, 125, 0.1);
  }
`;

export const RulesPopup = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #2b2c2f;
  border: 2px solid #19c37d;
  border-radius: 12px;
  padding: 24px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
`;

export const RulesPopupTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const RulesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const RuleItem = styled.div`
  background-color: rgba(32, 33, 35, 0.9);
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #565869;
  text-align: left;
  line-height: 1.6;

  h1 {
    font-size: 24px;
    font-weight: 600;
    margin: 0 0 16px 0;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  ul {
    margin: 0;
    padding-left: 20px;
    list-style-type: disc;
  }

  li {
    margin-bottom: 4px;
    color: #fff;
  }

  blockquote {
    margin: 16px 0 0 0;
    padding: 12px;
    border-left: 4px solid #19c37d;
    background-color: rgba(25, 195, 125, 0.1);
    border-radius: 0 8px 8px 0;
    color: #fff;
  }

  strong {
    color: #19c37d;
    font-weight: 600;
  }

  p {
    margin: 0;
    color: #fff;
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: #565869;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    color: #19c37d;
    background-color: rgba(25, 195, 125, 0.1);
  }
`; 