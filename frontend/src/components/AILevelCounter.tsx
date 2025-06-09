import React from 'react';
import { CounterRow, CounterText, CounterValue } from '../styles/Layout';
import { Rule } from '../types';

interface AILevelCounterProps {
  rules: Rule[];
}

export const AILevelCounter: React.FC<AILevelCounterProps> = ({ rules }) => {
  return (
    <CounterRow>
      <CounterText>AI Level:</CounterText>
      <CounterValue>{rules.length}</CounterValue>
    </CounterRow>
  );
}; 