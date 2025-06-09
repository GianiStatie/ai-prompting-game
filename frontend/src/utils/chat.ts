// Generate chat title from first message
export const generateChatTitle = (firstMessage: string): string => {
  const words = firstMessage.trim().split(' ');
  const title = words.slice(0, 6).join(' ');
  return title.length > 50 ? title.substring(0, 47) + '...' : title;
};

// Fetch rules from API
export const fetchRules = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/rules`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching rules:', error);
    return [];
  }
}; 