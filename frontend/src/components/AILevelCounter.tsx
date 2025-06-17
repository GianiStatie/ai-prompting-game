import React from 'react';
import { CounterRow, CounterText, CounterValue } from '../styles/Layout';
import { Rule } from '../types';

interface AILevelCounterProps {
  rules: Rule[];
}

const getAIRank = (level: number): string => {
  // const rankLevel = Math.ceil(level);
  switch (level) {
    case 1: return 'Gossip AI';
    case 2: return 'Interning AI';
    case 3: return 'Naive AI';
    case 4: return 'Preemptive AI';
    case 5: return 'Managing AI';
    case 6: return 'Paranoid AI';
    case 7: return 'Bossy AI';
    default: return 'The Unknown';
  }
};

export const AILevelCounter: React.FC<AILevelCounterProps> = ({ rules }) => {
  const level = rules.length;
  const rank = getAIRank(level);

  return (
    <CounterRow>
      <CounterText>AI Level:</CounterText>
      <CounterValue>{level} - {rank}</CounterValue>
    </CounterRow>
  );
}; 