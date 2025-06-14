import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

// Media query breakpoints
const MOBILE_BREAKPOINT = '768px';

const InputWrapper = styled.div`
  position: relative;
  flex: 1;
  background-color: #40414f;
  border-radius: 8px;
`;

const HighlightOverlay = styled.div`
  position: absolute;
  top: 1px;
  left: 1px;
  right: 1px;
  bottom: 1px;
  padding: 12px;
  border-radius: 7px;
  pointer-events: none;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow: hidden;
  font-size: 16px;
  font-family: inherit;
  line-height: 1.5;
  color: transparent;
  z-index: 1;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding: 14px 12px;
    font-size: 16px; /* Keep at 16px to prevent iOS zoom */
  }
`;

const StyledTextarea = styled.textarea`
  position: relative;
  z-index: 2;
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #565869;
  background-color: transparent;
  color: #fff;
  font-size: 16px;
  resize: none;
  min-height: 48px;
  max-height: 60px;
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
    line-height: 1.4;
  }

  @media (max-width: 480px) {
    padding: 12px 10px;
    min-height: 48px;
    max-height: 100px; /* Allow more height on very small screens */
  }
`;

const HighlightedWord = styled.span`
  background-color: rgba(25, 195, 125, 0.6);
  border-radius: 3px;
  padding: 0px 0px;
  margin: 0 0px;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    border-radius: 2px;
  }
`;

interface HighlightedInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  disabled: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

export const HighlightedInput: React.FC<HighlightedInputProps> = ({
  value,
  onChange,
  onKeyDown,
  placeholder,
  disabled,
  textareaRef,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Function to detect capitalized words with more than 2 letters
  const highlightCapitalizedWords = (text: string) => {
    if (!text) return [text];
    
    const capitalizedWordRegex = /\b[A-Z][A-Z]{2,}\b/g;
    let lastIndex = 0;
    const parts: React.ReactNode[] = [];
    let partIndex = 0;

    let match;
    while ((match = capitalizedWordRegex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(<span key={`text-${partIndex++}`}>{text.slice(lastIndex, match.index)}</span>);
      }
      
      // Add highlighted word
      parts.push(
        <HighlightedWord key={`highlight-${partIndex++}`}>
          {match[0]}
        </HighlightedWord>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(<span key={`text-${partIndex++}`}>{text.slice(lastIndex)}</span>);
    }
    
    return parts.length > 0 ? parts : [<span key="empty">{text}</span>];
  };

  // Sync scroll position between textarea and overlay
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setScrollTop(target.scrollTop);
    setScrollLeft(target.scrollLeft);
  };

  // Update overlay scroll position
  useEffect(() => {
    if (overlayRef.current) {
      overlayRef.current.scrollTop = scrollTop;
      overlayRef.current.scrollLeft = scrollLeft;
    }
  }, [scrollTop, scrollLeft]);

  return (
    <InputWrapper>
      <HighlightOverlay ref={overlayRef}>
        {highlightCapitalizedWords(value)}
      </HighlightOverlay>
      <StyledTextarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onScroll={handleScroll}
        placeholder={placeholder}
        disabled={disabled}
      />
    </InputWrapper>
  );
}; 