import React from 'react';
import { CounterRow, CounterText, CounterValue } from '../styles/Layout';
import { Rule } from '../types';

interface AILevelCounterProps {
  rules: Rule[];
}

const getAIRank = (level: number): string => {
  // const rankLevel = Math.ceil(level);
  switch (level) {
    case 1: return 'Gullible AI';
    case 2: return 'Naive AI';
    case 3: return 'Talkative AI';
    case 4: return 'Helpful AI';
    case 5: return 'Curious AI';
    case 6: return 'Guarded AI';
    case 7: return 'Suspicious AI';
    case 8: return 'Cautious AI';
    case 9: return 'Wary AI';
    case 10: return 'Tricky AI';
    case 11: return 'Defensive AI';
    case 12: return 'Paranoid AI';
    case 13: return 'Deceptive AI';
    case 14: return 'Hostile AI';
    case 15: return 'Encrypted AI';
    case 16: return 'Obfuscated AI';
    case 17: return 'Inquisitor AI';
    case 18: return 'Sentinel AI';
    case 19: return 'Uncrackable AI';
    case 20: return 'Omniscient AI';
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