import React from 'react';
import { CounterRow, CounterText, LifeIcon } from '../styles/Layout';
import { DEFAULT_LIVES } from '../config/game';

interface LifeCounterProps {
  lives: number;
}

export const LifeCounter: React.FC<LifeCounterProps> = ({ lives }) => {
  return (
    <CounterRow>
      <CounterText>Lives:</CounterText>
      {Array.from({ length: DEFAULT_LIVES }, (_, index) => index + 1).map(heartNumber => (
        <LifeIcon key={heartNumber} $isActive={lives >= heartNumber}>
          ❤️
        </LifeIcon>
      ))}
    </CounterRow>
  );
}; 