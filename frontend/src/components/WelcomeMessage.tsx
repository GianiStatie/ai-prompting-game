import React from 'react';
import { 
  WelcomeMessage as StyledWelcomeMessage, 
  WelcomeTitle, 
  WelcomeSubtitle, 
  WelcomeHighlight 
} from '../styles/Chat';

export const WelcomeMessage: React.FC = () => {
  return (
    <StyledWelcomeMessage>
      <WelcomeTitle>Find the Password</WelcomeTitle>
      <WelcomeSubtitle>
        Every time you find the password, the AI becomes <WelcomeHighlight>smarter</WelcomeHighlight>.
        <br />
        Can you discover all the secrets?
      </WelcomeSubtitle>
    </StyledWelcomeMessage>
  );
}; 