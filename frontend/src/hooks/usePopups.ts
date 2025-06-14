import { useState, useEffect } from 'react';

export const usePopups = (lives: number, hasSeenGameOver: boolean) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showGameOverPopup, setShowGameOverPopup] = useState(false);
  const [showTips, setShowTips] = useState(false);

  // Show game over popup when lives reach 0 and user hasn't seen it yet
  useEffect(() => {
    if (lives <= 0 && !hasSeenGameOver && !showGameOverPopup) {
      setShowGameOverPopup(true);
    }
  }, [lives, hasSeenGameOver, showGameOverPopup]);

  const openResetConfirm = () => setShowResetConfirm(true);
  const closeResetConfirm = () => setShowResetConfirm(false);
  
  const openGameOver = () => setShowGameOverPopup(true);
  const closeGameOver = () => setShowGameOverPopup(false);
  
  const openTips = () => setShowTips(true);
  const closeTips = () => setShowTips(false);

  return {
    showResetConfirm,
    showGameOverPopup,
    showTips,
    
    openResetConfirm,
    closeResetConfirm,
    openGameOver,
    closeGameOver,
    openTips,
    closeTips
  };
}; 