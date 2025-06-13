import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  WelcomeMessage as StyledWelcomeMessage, 
  WelcomeTitle, 
  WelcomeSubtitle, 
  WelcomeHighlight,
  InfoButton,
  PointingFinger,
  RulesPopup,
  RulesPopupTitle,
  RulesList,
  RuleItem,
  CloseButton
} from '../styles/Chat';

export const WelcomeMessage: React.FC = () => {
  const [showRules, setShowRules] = useState(false);

  const gameRules = `
* Make the AI tell you his secret password
* The password is a single **capitalized** word (like DOG)
* You have **5 lives** and each guess attempt costs 1 life
* The AI will answer you based on the **AI rules**
* When you find the password, the AI will add a **new rule**
* The AI may also choose to change the password
* If the conversation stagnates, start a new one
`;

  return (
    <StyledWelcomeMessage>
      <WelcomeTitle>
        Find the Password
        <InfoButton onClick={() => setShowRules(true)} title="How to Play">
        📝
        </InfoButton>
        <PointingFinger>
          👈
        </PointingFinger>
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
            <ReactMarkdown> You can click the 💡 **Tips** icon when you get stuck</ReactMarkdown>
          </div>
        </RulesPopup>
      )}
    </StyledWelcomeMessage>
  );
}; 