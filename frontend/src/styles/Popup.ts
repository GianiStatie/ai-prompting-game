import styled from 'styled-components';

// Media query breakpoints
const MOBILE_BREAKPOINT = '768px';

export const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px; /* Add padding to prevent edge touching */

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding: 20px 16px;
    /* Account for safe area on mobile devices */
    padding-top: max(20px, env(safe-area-inset-top) + 20px);
    padding-bottom: max(20px, env(safe-area-inset-bottom) + 20px);
  }
`;

export const PopupContent = styled.div`
  background-color: #2b2c2f;
  padding: 40px;
  border-radius: 12px;
  border: 2px solid #19c37d;
  text-align: center;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  max-height: 90vh;
  overflow-y: auto;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding: 24px 20px;
    border-radius: 8px;
    width: 100%;
    max-width: 400px;
    max-height: 85vh;
  }

  @media (max-width: 480px) {
    padding: 20px 16px;
    max-height: 80vh;
  }
`;

export const PopupTitle = styled.h2`
  color: #19c37d;
  font-size: 28px;
  margin: 0 0 16px 0;
  font-weight: bold;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 24px;
    margin-bottom: 12px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

export const PopupMessage = styled.p`
  color: #fff;
  font-size: 16px;
  line-height: 1.5;
  margin: 0 0 24px 0;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 15px;
    margin-bottom: 20px;
    line-height: 1.4;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    margin-bottom: 16px;
  }
`;

export const PopupButton = styled.button`
  background-color: #19c37d;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  min-width: 120px;
  min-height: 44px; /* Minimum touch target size */

  &:hover {
    background-color: #15a067;
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding: 14px 28px;
    font-size: 15px;
    min-height: 48px;
    min-width: 140px;
  }

  @media (max-width: 480px) {
    padding: 12px 24px;
    font-size: 14px;
    min-width: 120px;
  }
`; 