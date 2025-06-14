import React from 'react';
import { Popup } from './Popup';
import { TipsPopup } from './TipsPopup';

interface PopupsContainerProps {
  // Popup states
  showTips: boolean;
  showResetConfirm: boolean;
  showGameOverPopup: boolean;
  isSessionComplete: boolean;
  hasSeenCongratulations: boolean;
  
  // Popup actions
  onCloseTips: () => void;
  onCancelReset: () => void;
  onConfirmReset: () => void;
  onGameOverDismiss: () => void;
  onGameOverReset: () => void;
  onNewChat: () => void;
}

export const PopupsContainer: React.FC<PopupsContainerProps> = ({
  showTips,
  showResetConfirm,
  showGameOverPopup,
  isSessionComplete,
  hasSeenCongratulations,
  onCloseTips,
  onCancelReset,
  onConfirmReset,
  onGameOverDismiss,
  onGameOverReset,
  onNewChat
}) => {
  return (
    <>
      <TipsPopup isVisible={showTips} onClose={onCloseTips} />
      
      {isSessionComplete && !hasSeenCongratulations && (
        <Popup
          title="🎉 Congratulations! 🎉"
          message={
            <>
              You've successfully found the password! The AI will create a new rule based on this conversation.
              <br /><br />
              Think you can take on the AI once it levels up?
            </>
          }
          primaryButton={{
            text: "Level Up!",
            onClick: onNewChat
          }}
        />
      )}
      
      {showGameOverPopup && (
        <Popup
          title="💀 Game Over 💀"
          message={
            <>
              You've run out of lives! The AI has proven too clever this time.
              <br /><br />
              You can start a new attempt with fresh lives, or reset everything to start from the beginning.
            </>
          }
          secondaryButton={{
            text: "Reset Everything",
            onClick: onGameOverReset,
            style: { backgroundColor: '#ff6b6b' }
          }}
          primaryButton={{
            text: "Dismiss",
            onClick: onGameOverDismiss
          }}
        />
      )}
      
      {showResetConfirm && (
        <Popup
          title="⚠️ Reset Everything ⚠️"
          message={
            <>
              Are you sure you want to reset everything? This will permanently delete:
              <br /><br />
              • All chat history and attempts
              <br />
              • All saved rules and progress
              <br />
              • Your current lives and session
              <br /><br />
              <strong>This action cannot be undone.</strong>
            </>
          }
          secondaryButton={{
            text: "Cancel",
            onClick: onCancelReset,
            style: { backgroundColor: '#565869', color: '#fff' }
          }}
          primaryButton={{
            text: "Reset Everything",
            onClick: onConfirmReset,
            style: { backgroundColor: '#ff6b6b' }
          }}
        />
      )}
    </>
  );
}; 