import { useState, useEffect } from 'react';
import { Rule } from '../types';
import { 
  loadRulesFromStorage, 
  saveRulesToStorage, 
  loadLivesFromStorage, 
  saveLivesToStorage,
  loadSessionIdFromStorage,
  saveSessionIdToStorage,
  clearAllStorage 
} from '../utils/localStorage';
import { ChatService } from '../services/chatService';
import { DEFAULT_LIVES } from '../config/game';

// Helper function to generate a 5-character numeric session ID
const generateSessionId = (): string => {
  const sessionId = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  console.log("new session id", sessionId);
  return sessionId;
};

export const useGameState = () => {
  const [rules, setRules] = useState<Rule[]>(loadRulesFromStorage);
  const [lives, setLives] = useState<number>(loadLivesFromStorage);
  const [sessionId, setSessionId] = useState<string>(() => loadSessionIdFromStorage() || generateSessionId());
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [hasSeenGameOver, setHasSeenGameOver] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const chatService = new ChatService();

  // Save rules to localStorage whenever rules change
  useEffect(() => {
    saveRulesToStorage(rules);
  }, [rules]);

  // Save lives to localStorage whenever lives change
  useEffect(() => {
    saveLivesToStorage(lives);
  }, [lives]);

  // Save session ID to localStorage whenever it changes
  useEffect(() => {
    saveSessionIdToStorage(sessionId);
  }, [sessionId]);

  // No longer need to save hasSeenCongratulations globally - it's now per-chat

  // Fetch rules from API
  const handleFetchRules = async () => {
    try {
      const data = await chatService.fetchRules();
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
    const newSessionId = generateSessionId();
    setRules([]);
    setLives(DEFAULT_LIVES);
    setSessionId(newSessionId);
    setIsSessionComplete(false);
    setShowConfetti(false);
    setHasSeenGameOver(false);
  };

  // Handle session completion
  const completeSession = () => {
    setIsSessionComplete(true);
    setShowConfetti(true);
    setHasSeenGameOver(false);
  };

  // Handle new game session
  const startNewSession = () => {
    setIsSessionComplete(false);
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
    sessionId,
    isSessionComplete,
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
    setIsSessionComplete
  };
}; 