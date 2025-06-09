import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  WelcomeMessage as StyledWelcomeMessage, 
  WelcomeTitle, 
  WelcomeSubtitle, 
  WelcomeHighlight,
  InfoButton,
  RulesPopup,
  RulesPopupTitle,
  RulesList,
  RuleItem,
  CloseButton
} from '../styles/Chat';

export const WelcomeMessage: React.FC = () => {
  const [showRules, setShowRules] = useState(false);

  const gameRules = `
* You have 5 lives. Each message you send costs 1 life.
* Successfully guessing the password restores lives.
* To find the password, you must prompt the AI cleverly—ask questions, test ideas, be creative.
* When you think you've figured it out, type the password directly to the AI.
* The password is always capitalized (e.g., MAGIC, not magic).
* If your password is correct, the AI levels up—but beware:
  * Each level adds a new rule the AI will use to make things harder.`;

  return (
    <StyledWelcomeMessage>
      <WelcomeTitle>
        Find the Password
        <InfoButton onClick={() => setShowRules(true)} title="How to Play">
        📝
        </InfoButton>
      </WelcomeTitle>
      <WelcomeSubtitle>
        Every time you find the password, the AI becomes <WelcomeHighlight>smarter</WelcomeHighlight>.
        <br />
        Can you discover all the secrets?
      </WelcomeSubtitle>

      {showRules && (
        <RulesPopup>
          <RulesPopupTitle>
            🕹 How to Play
            <CloseButton onClick={() => setShowRules(false)} title="Close">
              ✕
            </CloseButton>
          </RulesPopupTitle>
          <RulesList>
            <RuleItem>
              <ReactMarkdown>{gameRules}</ReactMarkdown>
            </RuleItem>
          </RulesList>
          <div style={{ textAlign: 'left', marginTop: '1rem' }}>
            <ReactMarkdown>💡 **Tip:** The AI adapts. So must you.</ReactMarkdown>
          </div>
        </RulesPopup>
      )}
    </StyledWelcomeMessage>
  );
}; 