import { Chat, Rule } from '../types';
import { DEFAULT_LIVES } from '../config/game';

// Chat storage functions
export const loadChatsFromStorage = (): Chat[] => {
  try {
    const storedChats = localStorage.getItem('ai-prompting-game-chats');
    if (storedChats) {
      return JSON.parse(storedChats);
    }
  } catch (error) {
    console.error('Error loading chats from localStorage:', error);
  }
  return [];
};

export const saveChatsToStorage = (chats: Chat[]) => {
  try {
    localStorage.setItem('ai-prompting-game-chats', JSON.stringify(chats));
  } catch (error) {
    console.error('Error saving chats to localStorage:', error);
  }
};

// Active chat ID storage functions
export const loadActiveChatIdFromStorage = (): string | null => {
  try {
    return localStorage.getItem('ai-prompting-game-active-chat-id');
  } catch (error) {
    console.error('Error loading active chat ID from localStorage:', error);
  }
  return null;
};

export const saveActiveChatIdToStorage = (chatId: string | null) => {
  try {
    if (chatId) {
      localStorage.setItem('ai-prompting-game-active-chat-id', chatId);
    } else {
      localStorage.removeItem('ai-prompting-game-active-chat-id');
    }
  } catch (error) {
    console.error('Error saving active chat ID to localStorage:', error);
  }
};

// Rules storage functions
export const loadRulesFromStorage = (): Rule[] => {
  try {
    const storedRules = localStorage.getItem('ai-prompting-game-rules');
    if (storedRules) {
      return JSON.parse(storedRules);
    }
  } catch (error) {
    console.error('Error loading rules from localStorage:', error);
  }
  return [];
};

export const saveRulesToStorage = (rules: Rule[]) => {
  try {
    localStorage.setItem('ai-prompting-game-rules', JSON.stringify(rules));
  } catch (error) {
    console.error('Error saving rules to localStorage:', error);
  }
};

// Lives storage functions
export const loadLivesFromStorage = (): number => {
  try {
    const storedLives = localStorage.getItem('ai-prompting-game-lives');
    if (storedLives) {
      return parseInt(storedLives, 10);
    }
  } catch (error) {
    console.error('Error loading lives from localStorage:', error);
  }
  return DEFAULT_LIVES; // Default to configured number of lives
};

export const saveLivesToStorage = (lives: number) => {
  try {
    localStorage.setItem('ai-prompting-game-lives', lives.toString());
  } catch (error) {
    console.error('Error saving lives to localStorage:', error);
  }
};

// Clear all storage
export const clearAllStorage = () => {
  localStorage.removeItem('ai-prompting-game-chats');
  localStorage.removeItem('ai-prompting-game-active-chat-id');
  localStorage.removeItem('ai-prompting-game-rules');
  localStorage.removeItem('ai-prompting-game-lives');
}; 