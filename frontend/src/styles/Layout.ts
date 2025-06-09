import styled from 'styled-components';

export const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #343541;
  color: #fff;
`;

export const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const ToggleButton = styled.button`
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

export const CountersContainer = styled.div`
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  background-color: rgba(32, 33, 35, 0.9);
  border-radius: 8px;
  border: 1px solid #565869;
  z-index: 5;
  overflow: hidden;
  pointer-events: none;
`;

export const CounterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid #565869;
  
  &:last-child {
    border-bottom: none;
  }
`;

export const CounterText = styled.span`
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  min-width: 80px;
`;

export const CounterValue = styled.span`
  color: #19c37d;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  flex: 1;
`;

export const LifeIcon = styled.span<{ $isActive: boolean }>`
  opacity: ${props => props.$isActive ? '1' : '0.3'};
  font-size: 16px;
  transition: opacity 0.2s ease;
  filter: ${props => props.$isActive ? 'none' : 'grayscale(100%)'};
`;