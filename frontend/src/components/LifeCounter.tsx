import React from 'react';
import { LifeCounter as StyledLifeCounter, LifeCounterText, LifeIcon } from '../styles/Layout';

interface LifeCounterProps {
  lives: number;
}

export const LifeCounter: React.FC<LifeCounterProps> = ({ lives }) => {
  return (
    <StyledLifeCounter>
      <LifeCounterText>Lives:</LifeCounterText>
      {[1, 2, 3].map(heartNumber => (
        <LifeIcon key={heartNumber} $isActive={lives >= heartNumber}>
          ❤️
        </LifeIcon>
      ))}
    </StyledLifeCounter>
  );
}; 