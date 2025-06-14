// Game configuration constants
export const GAME_CONFIG = {
  // Number of lives players start with and are restored to when password is found
  DEFAULT_LIVES: 5,
  
  // Maximum height for the textarea input (in pixels)
  MAX_TEXTAREA_HEIGHT: 200,
  
  // Delay between streaming chunks (in milliseconds)
  STREAMING_DELAY_MS: 42,
} as const;

// Export individual values for convenience
export const { DEFAULT_LIVES } = GAME_CONFIG; 