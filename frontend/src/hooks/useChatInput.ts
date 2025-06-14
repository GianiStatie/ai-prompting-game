import { useState, useEffect, useRef } from 'react';
import { GAME_CONFIG } from '../config/game';

export const useChatInput = (isStreaming: boolean, isSessionComplete: boolean, lives: number) => {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = GAME_CONFIG.MAX_TEXTAREA_HEIGHT;
      textarea.style.height = Math.min(scrollHeight, maxHeight) + 'px';
    }
  }, [inputValue]);

  // Focus textarea when streaming completes
  useEffect(() => {
    if (!isStreaming && !isSessionComplete && lives > 0) {
      textareaRef.current?.focus();
    }
  }, [isStreaming, isSessionComplete, lives]);

  const clearInput = () => setInputValue('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, onSubmit: () => void) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const canSubmit = inputValue.trim() && !isStreaming && !isSessionComplete && lives > 0;

  const getPlaceholder = () => {
    if (lives <= 0) return "No lives remaining...";
    return "Type your message...";
  };

  const getButtonText = () => {
    if (isStreaming) return 'Sending...';
    if (isSessionComplete) return 'Completed!';
    if (lives <= 0) return 'No Lives';
    return 'Send';
  };

  const isDisabled = isStreaming || isSessionComplete || lives <= 0;

  return {
    inputValue,
    setInputValue,
    textareaRef,
    clearInput,
    handleKeyDown,
    canSubmit,
    getPlaceholder,
    getButtonText,
    isDisabled
  };
}; 