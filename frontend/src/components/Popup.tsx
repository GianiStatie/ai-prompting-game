import React, { useEffect } from 'react';
import { PopupOverlay, PopupContent, PopupTitle, PopupMessage, PopupButton } from '../styles/Popup';

interface PopupProps {
  title: string;
  message: string | React.ReactNode;
  primaryButton: {
    text: string;
    onClick: () => void;
    style?: React.CSSProperties;
  };
  secondaryButton?: {
    text: string;
    onClick: () => void;
    style?: React.CSSProperties;
  };
}

export const Popup: React.FC<PopupProps> = ({ 
  title, 
  message, 
  primaryButton, 
  secondaryButton 
}) => {
  // Add keyboard event handler for Enter key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        primaryButton.onClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [primaryButton]);

  return (
    <PopupOverlay>
      <PopupContent>
        <PopupTitle>{title}</PopupTitle>
        <PopupMessage>{message}</PopupMessage>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          {secondaryButton && (
            <PopupButton onClick={secondaryButton.onClick} style={secondaryButton.style}>
              {secondaryButton.text}
            </PopupButton>
          )}
          <PopupButton onClick={primaryButton.onClick} style={primaryButton.style}>
            {primaryButton.text}
          </PopupButton>
        </div>
      </PopupContent>
    </PopupOverlay>
  );
}; 