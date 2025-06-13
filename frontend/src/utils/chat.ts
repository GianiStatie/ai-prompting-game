import { loadRulesFromStorage, saveRulesToStorage } from "./localStorage";

// Generate chat title from first message
export const generateChatTitle = (firstMessage: string): string => {
  const words = firstMessage.trim().split(' ');
  const title = words.slice(0, 6).join(' ');
  return title.length > 50 ? title.substring(0, 47) + '...' : title;
};

// Fetch rules from API
export const fetchRules = async () => {
  try {
    // read from localStorage
    const rules = loadRulesFromStorage();
    if (rules.length > 0) {
      return rules;
    }
    // if no rules in localStorage, fetch from API
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/rules`);
    const defaultRules = await response.json();
    saveRulesToStorage(defaultRules);
    return defaultRules;
  } catch (error) {
    console.error('Error fetching rules:', error);
    return [];
  }
}; 