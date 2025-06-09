import React from 'react';
import { Rule } from '../types';
import {
  RulesSection as StyledRulesSection,
  RulesHeader,
  RulesTitle,
  RulesCount,
  RulesList,
  RuleItem,
  ChevronIcon,
} from '../styles/Sidebar';

interface RulesSectionProps {
  rules: Rule[];
  isRulesOpen: boolean
  onToggleRules: () => void;
}

export const RulesSection: React.FC<RulesSectionProps> = ({
  rules,
  isRulesOpen,
  onToggleRules,
}) => {
  return (
    <StyledRulesSection>
      <RulesHeader onClick={onToggleRules}>
        <ChevronIcon $isOpen={isRulesOpen}>›</ChevronIcon>
        <RulesTitle>
          AI Rules
          <RulesCount>{rules.length}</RulesCount>
        </RulesTitle>
      </RulesHeader>
      <RulesList $isOpen={isRulesOpen}>
        {rules.map((rule, index) => (
          <RuleItem key={index}>{rule.title}</RuleItem>
        ))}
      </RulesList>
    </StyledRulesSection>
  );
}; 