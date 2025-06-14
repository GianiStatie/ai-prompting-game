import styled from 'styled-components';

// Media query breakpoints
const MOBILE_BREAKPOINT = '768px';

export const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #343541;
  color: #fff;
  
  @media (max-width: ${MOBILE_BREAKPOINT}) {
    flex-direction: column;
  }
`;

export const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  min-width: 0; /* Prevent flex item from overflowing */
`;

export const ToggleButton = styled.button<{ $isDrawerOpen?: boolean }>`
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
  transition: all 0.3s ease;
  min-width: 44px; /* Minimum touch target size */
  min-height: 44px;

  &:hover {
    background-color: #2b2c2f;
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    position: fixed;
    left: ${props => props.$isDrawerOpen ? '240px' : '8px'}; /* Stick directly to drawer edge */
    top: 8px;
    z-index: 1003; /* Higher than sidebar z-index (1002) */
    background-color: rgba(32, 33, 35, 0.95);
    backdrop-filter: blur(10px);
    border-color: #19c37d;
    
    /* Make it more visible when drawer is open */
    &:hover {
      background-color: rgba(25, 195, 125, 0.2);
      border-color: #19c37d;
    }
  }

  @media (max-width: 480px) {
    left: ${props => props.$isDrawerOpen ? '85vw' : '8px'}; /* Stick directly to drawer edge */
  }
`;

export const TipsButton = styled.button`
  position: absolute;
  right: 12px;
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
  transition: all 0.2s;
  font-size: 16px;
  min-width: 44px; /* Minimum touch target size */
  min-height: 44px;

  &:hover {
    background-color: #2b2c2f;
    color: #19c37d;
    border-color: #19c37d;
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    position: fixed;
    right: 8px;
    top: 8px;
    z-index: 1001;
    background-color: rgba(32, 33, 35, 0.95);
    backdrop-filter: blur(10px);
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

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    position: fixed;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    backdrop-filter: blur(10px);
    font-size: 12px;
    
    /* Move below buttons on very small screens */
    @media (max-width: 480px) {
      top: 60px;
      flex-direction: row;
      width: auto;
      max-width: calc(100vw - 16px);
    }
  }
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

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding: 6px 10px;
    
    @media (max-width: 480px) {
      border-bottom: none;
      border-right: 1px solid #565869;
      
      &:last-child {
        border-right: none;
      }
    }
  }
`;

export const CounterText = styled.span`
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  min-width: 80px;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 12px;
    min-width: 60px;
    
    @media (max-width: 480px) {
      font-size: 11px;
      min-width: 40px;
    }
  }
`;

export const CounterValue = styled.span`
  color: #19c37d;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  flex: 1;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 12px;
    
    @media (max-width: 480px) {
      font-size: 11px;
    }
  }
`;

export const LifeIcon = styled.span<{ $isActive: boolean }>`
  opacity: ${props => props.$isActive ? '1' : '0.3'};
  font-size: 16px;
  transition: opacity 0.2s ease;
  filter: ${props => props.$isActive ? 'none' : 'grayscale(100%)'};

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 14px;
    
    @media (max-width: 480px) {
      font-size: 12px;
    }
  }
`;