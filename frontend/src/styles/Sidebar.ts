import styled from 'styled-components';

export const SideDrawer = styled.div<{ $isOpen: boolean }>`
  width: ${props => props.$isOpen ? '260px' : '0'};
  background-color: #202123;
  transition: width 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const DrawerContent = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
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

  &:hover {
    background-color: #2b2c2f;
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

  &:hover {
    background-color: #2b2c2f;
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
`;

export const ChatHistoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px;
  margin-bottom: 8px;
`;

export const ChatHistoryTitle = styled.span`
  font-size: 14px;
  color: #fff;
  font-weight: 600;
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

  &:hover {
    background-color: ${props => props.$isActive ? '#19c37d' : '#2b2c2f'};
  }
`;

export const ChatTitle = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 2px 4px;
  border-radius: 4px;
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
`;

export const EditButton = styled(ActionButton)`
  transition: all 0.2s ease;
  
  &:hover {
    color: #19c37d;
    background-color: rgba(255, 107, 107, 0.1);
    transform: scale(1.25);
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
`;

export const RulesSection = styled.div`
  margin-top: 0px;
  padding-top: 0px;
`;

export const RulesHeader = styled.div`
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

export const RulesTitle = styled.span`
  font-size: 14px;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const RulesCount = styled.span`
  font-size: 12px;
  color: #c5c5d2;
  background-color: #2b2c2f;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
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
`;

export const RuleItem = styled.div`
  padding: 8px 12px;
  font-size: 13px;
  color: #c5c5d2;
  border-radius: 4px;
  margin-bottom: 4px;
  background-color: #2b2c2f;
`;

export const ChevronIcon = styled.span<{ $isOpen: boolean }>`
  transform: rotate(${props => props.$isOpen ? '90deg' : '0deg'});
  transition: transform 0.2s ease;
  font-size: 12px;
`; 