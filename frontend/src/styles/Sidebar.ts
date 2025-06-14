import styled from 'styled-components';

// Media query breakpoints
const MOBILE_BREAKPOINT = '768px';

export const SideDrawer = styled.div<{ $isOpen: boolean }>`
  width: ${props => props.$isOpen ? '260px' : '0'};
  background-color: #202123;
  transition: width 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: ${props => props.$isOpen ? '240px' : '0'};
    z-index: 1002;
    box-shadow: ${props => props.$isOpen ? '2px 0 10px rgba(0, 0, 0, 0.3)' : 'none'};
    
    /* Backdrop overlay */
    &::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      opacity: ${props => props.$isOpen ? '1' : '0'};
      visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
      transition: opacity 0.3s ease, visibility 0.3s ease;
      z-index: -1;
    }
  }

  @media (max-width: 480px) {
    width: ${props => props.$isOpen ? '85vw' : '0'};
    max-width: 280px;
  }
`;

export const DrawerContent = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding: 16px;
    gap: 12px;
    /* Account for safe area on mobile devices */
    padding-top: max(16px, env(safe-area-inset-top) + 16px);
    padding-bottom: max(16px, env(safe-area-inset-bottom) + 16px);
  }
`;

export const NewChatButton = styled.button`
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
  min-height: 44px; /* Minimum touch target size */

  &:hover {
    background-color: #2b2c2f;
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding: 14px 16px;
    font-size: 15px;
    min-height: 48px;
  }
`;

export const ResetButton = styled.button`
  width: 100%;
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
  min-height: 44px; /* Minimum touch target size */

  &:hover {
    background-color: #2b2c2f;
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding: 14px 16px;
    font-size: 15px;
    min-height: 48px;
  }
`;

export const PlusIcon = styled.span`
  font-size: 18px;
  line-height: 1;
`;

export const ChatHistorySection = styled.div`
  margin-bottom: 0px;
  border-bottom: 1px solid #565869;
  padding-bottom: 12px;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding-bottom: 16px;
  }
`;

export const ChatHistoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px;
  margin-bottom: 8px;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding: 10px 8px;
    margin-bottom: 12px;
  }
`;

export const ChatHistoryTitle = styled.span`
  font-size: 14px;
  color: #fff;
  font-weight: 600;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 15px;
  }
`;

export const ChatList = styled.div`
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

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    max-height: 250px;
    gap: 6px;
  }
`;

export const ChatItem = styled.div<{ $isActive: boolean }>`
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
  min-height: 40px; /* Minimum touch target size */

  &:hover {
    background-color: ${props => props.$isActive ? '#19c37d' : '#2b2c2f'};
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding: 12px 14px;
    font-size: 14px;
    min-height: 48px;
    border-radius: 6px;
  }
`;

export const ChatTitle = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 2px 4px;
  border-radius: 4px;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding: 4px 6px;
  }
`;

export const ChatTitleInput = styled.input`
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

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding: 6px 8px;
    font-size: 14px;
  }
`;

export const ActionButton = styled.button`
  opacity: 0;
  background: none;
  border: none;
  color: #c5c5d2;
  cursor: pointer;
  padding: 2px;
  border-radius: 2px;
  font-size: 12px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;

  ${ChatItem}:hover & {
    opacity: 1;
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    opacity: 1; /* Always show on mobile for better usability */
    width: 32px;
    height: 32px;
    font-size: 14px;
    padding: 4px;
  }
`;

export const EditButton = styled(ActionButton)`
  transition: all 0.2s ease;
  
  &:hover {
    color: #19c37d;
    background-color: rgba(255, 107, 107, 0.1);
    transform: scale(1.25);
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    &:hover {
      transform: scale(1.1);
    }
  }
`;

export const DeleteButton = styled(ActionButton)`
  margin-left: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    color: #ff6b6b;
    background-color: rgba(255, 107, 107, 0.1);
    transform: scale(1.25);
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    margin-left: 6px;
    
    &:hover {
      transform: scale(1.1);
    }
  }
`;

export const RulesSection = styled.div`
  margin-top: 0px;
  padding-top: 0px;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding-top: 8px;
  }
`;

export const RulesHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s;
  min-height: 40px; /* Minimum touch target size */

  &:hover {
    background-color: #2b2c2f;
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding: 12px 10px;
    min-height: 48px;
  }
`;

export const RulesTitle = styled.span`
  font-size: 14px;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 15px;
  }
`;

export const RulesCount = styled.span`
  font-size: 12px;
  color: #c5c5d2;
  background-color: #2b2c2f;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 13px;
    padding: 3px 8px;
    min-width: 24px;
  }
`;

export const RulesList = styled.div<{ $isOpen: boolean }>`
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

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    max-height: ${props => props.$isOpen ? '250px' : '0'};
    margin-top: 12px;
  }
`;

export const RuleItem = styled.div`
  padding: 8px 12px;
  font-size: 13px;
  color: #c5c5d2;
  border-radius: 4px;
  background-color: rgba(32, 33, 35, 0.5);
  border: 1px solid #565869;
  margin-bottom: 8px;
  line-height: 1.4;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding: 10px 14px;
    font-size: 14px;
    margin-bottom: 10px;
    border-radius: 6px;
  }
`;

export const ChevronIcon = styled.span<{ $isOpen: boolean }>`
  transform: rotate(${props => props.$isOpen ? '90deg' : '0deg'});
  transition: transform 0.2s ease;
  font-size: 12px;
`; 