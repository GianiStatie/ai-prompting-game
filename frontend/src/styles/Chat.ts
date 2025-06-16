import styled, { keyframes } from 'styled-components';

// Media query breakpoints
const MOBILE_BREAKPOINT = '768px';

// Spinner animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const Spinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #666;
  border-top: 2px solid #fff;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-right: 8px;
`;

export const ChatContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 48px;
  position: relative;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding: 12px;
    gap: 16px;
    margin-top: 80px; /* More space for fixed headers */
    
    /* Account for very small screens with repositioned counters */
    @media (max-width: 480px) {
      margin-top: 120px;
    }
  }
`;

export const MessageBubble = styled.div<{ $isUser: boolean }>`
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: ${props => props.$isUser ? '#2b2c2f' : '#444654'};
  align-self: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  margin-left: ${props => props.$isUser ? 'auto' : '0'};
  margin-right: ${props => props.$isUser ? '0' : 'auto'};
  word-wrap: break-word;
  overflow-wrap: break-word;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    max-width: 90%;
    padding: 10px 14px;
    font-size: 15px;
    line-height: 1.4;
  }

  @media (max-width: 480px) {
    max-width: 95%;
    padding: 8px 12px;
    font-size: 14px;
  }
`;

export const InputContainer = styled.div`
  padding: 20px;
  background-color: #343541;
  border-top: 1px solid #565869;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding: 16px 12px;
    /* Add safe area padding for devices with home indicators */
    padding-bottom: max(16px, env(safe-area-inset-bottom));
  }
`;

export const InputForm = styled.form`
  display: flex;
  gap: 10px;
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    gap: 8px;
    max-width: 100%;
  }
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

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 16px; /* Prevent zoom on iOS */
    padding: 14px 12px;
    min-height: 50px;
    max-height: 80px;
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
  min-width: 44px; /* Minimum touch target size */
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background-color: #15a067;
  }

  &:disabled {
    background-color: #6b6c7b;
    cursor: not-allowed;
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding: 14px 20px;
    min-width: 60px;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    padding: 14px 16px;
    min-width: 50px;
    font-size: 13px;
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

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding: 20px 16px;
    gap: 12px;
    max-width: 90%;
  }
`;

export const WelcomeTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  position: relative;
  display: inline-block;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 24px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

export const WelcomeSubtitle = styled.p`
  font-size: 16px;
  color: #c5c5d2;
  margin: 0;
  line-height: 1.5;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

export const WelcomeHighlight = styled.span`
  color: #19c37d;
  font-weight: bold;
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

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    width: 95%;
    max-width: none;
    margin: 0 10px;
    padding: 20px;
    max-height: 85vh;
    border-radius: 8px;
  }

  @media (max-width: 480px) {
    width: calc(100% - 20px);
    margin: 0 10px;
    padding: 16px;
    max-height: 90vh;
    top: 50%;
  }
`;

export const RulesPopupTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 20px;
    margin-bottom: 12px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

export const RulesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    gap: 10px;
  }
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

    @media (max-width: ${MOBILE_BREAKPOINT}) {
      font-size: 20px;
      margin-bottom: 12px;
    }

    @media (max-width: 480px) {
      font-size: 18px;
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }
  }

  ul {
    margin: 0;
    padding-left: 20px;
    list-style-type: disc;

    @media (max-width: ${MOBILE_BREAKPOINT}) {
      padding-left: 16px;
    }
  }

  li {
    margin-bottom: 4px;
    color: #fff;
    
    @media (max-width: ${MOBILE_BREAKPOINT}) {
      font-size: 14px;
    }
  }

  blockquote {
    margin: 16px 0 0 0;
    padding: 12px;
    border-left: 4px solid #19c37d;
    background-color: rgba(25, 195, 125, 0.1);
    border-radius: 0 8px 8px 0;
    color: #fff;

    @media (max-width: ${MOBILE_BREAKPOINT}) {
      margin: 12px 0 0 0;
      padding: 10px;
      font-size: 14px;
    }
  }

  strong {
    color: #19c37d;
    font-weight: 600;
  }

  p {
    margin: 0;
    color: #fff;
    
    @media (max-width: ${MOBILE_BREAKPOINT}) {
      font-size: 14px;
    }
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding: 10px;
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
  min-width: 32px;
  min-height: 32px;

  &:hover {
    color: #19c37d;
    background-color: rgba(25, 195, 125, 0.1);
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    min-width: 40px;
    min-height: 40px;
    font-size: 18px;
  }
`; 