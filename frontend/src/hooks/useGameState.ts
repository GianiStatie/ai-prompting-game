import { useState, useEffect } from 'react';
import { Rule } from '../types';
import { 
  loadRulesFromStorage, 
  saveRulesToStorage, 
  loadLivesFromStorage, 
  saveLivesToStorage,
  clearAllStorage 
} from '../utils/localStorage';
import { fetchRules } from '../utils/chat';
import { DEFAULT_LIVES } from '../config/game';

export const useGameState = () => {
  const [rules, setRules] = useState<Rule[]>(loadRulesFromStorage);
  const [lives, setLives] = useState<number>(loadLivesFromStorage);
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [hasSeenCongratulations, setHasSeenCongratulations] = useState(false);
  const [hasSeenGameOver, setHasSeenGameOver] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Save rules to localStorage whenever rules change
  useEffect(() => {
    saveRulesToStorage(rules);
  }, [rules]);

  // Save lives to localStorage whenever lives change
  useEffect(() => {
    saveLivesToStorage(lives);
  }, [lives]);

  // Fetch rules from API
  const handleFetchRules = async () => {
    try {
      const data = await fetchRules();
      // Sort rules in descending order by ID
      const sortedRules = [...data].sort((a, b) => b.id - a.id);
      setRules(sortedRules);
    } catch (error) {
      console.error('Error fetching rules:', error);
      // If fetch fails and we have no rules in localStorage, keep the empty array
      if (rules.length === 0) {
        console.log('No rules available from API or localStorage');
      }
    }
  };

  // Reset all game state
  const resetGameState = () => {
    clearAllStorage();
    setRules([]);
    setLives(DEFAULT_LIVES);
    setIsSessionComplete(false);
    setHasSeenCongratulations(false);
    setShowConfetti(false);
    setHasSeenGameOver(false);
  };

  // Handle session completion
  const completeSession = () => {
    setIsSessionComplete(true);
    setHasSeenCongratulations(false);
    setShowConfetti(true);
    setHasSeenGameOver(false);
  };

  // Handle new game session
  const startNewSession = () => {
    setIsSessionComplete(false);
    setHasSeenCongratulations(true);
    setShowConfetti(false);
  };

  // Decrease lives
  const decreaseLives = () => {
    setLives(prev => prev - 1);
  };

  // Add new rule to the beginning of rules array
  const addRule = (newRule: Rule) => {
    const updatedRules = [newRule, ...rules];
    setRules(updatedRules);
    saveRulesToStorage(updatedRules);
  };

  return {
    // State
    rules,
    lives,
    isSessionComplete,
    hasSeenCongratulations,
    hasSeenGameOver,
    showConfetti,
    
    // Actions
    handleFetchRules,
    resetGameState,
    completeSession,
    startNewSession,
    decreaseLives,
    addRule,
    setHasSeenGameOver,
    setShowConfetti,
    setHasSeenCongratulations
  };
}; 