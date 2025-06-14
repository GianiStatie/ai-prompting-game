import { Message, Rule } from '../types';
import { GAME_CONFIG } from '../config/game';

export interface ChatResponse {
  success: boolean;
  sessionCompleted: boolean;
  wasPasswordAttempt: boolean;
  newRule?: Rule;
  error?: string;
}

export class ChatService {
  private readonly apiUrl: string;

  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL;
  }

  async sendMessage(
    userMessage: Message,
    currentMessages: Message[],
    rules: Rule[],
    onMessageUpdate: (text: string) => void
  ): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/api/chat-stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          chat_history: currentMessages,
          rules_list: rules
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      let sessionCompleted = false;
      let wasPasswordAttempt = false;
      let newRule: Rule | undefined;

      // Get the response reader
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      let aiMessageText = '';

      // Read the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Convert the chunk to text and parse SSE format
        const chunk = new TextDecoder().decode(value);

        // Split by lines and process each SSE message
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const chunkStartTime = performance.now();

              // Extract JSON from SSE format
              const jsonStr = line.substring(6); // Remove "data: " prefix
              if (jsonStr.trim()) {
                const response = JSON.parse(jsonStr);
                const { message: word, is_done, is_password_attempt } = response;

                // Update wasPasswordAttempt if this was a password attempt
                if (is_password_attempt) {
                  wasPasswordAttempt = true;
                }

                // Track if session is done
                if (is_done) {
                  sessionCompleted = true;
                }

                // Update the AI message with the new word
                aiMessageText += word;
                onMessageUpdate(aiMessageText);

                // Calculate elapsed time for processing this chunk
                const chunkElapsedTime = performance.now() - chunkStartTime;

                // Ensure minimum delay between chunks for smooth streaming
                if (chunkElapsedTime < GAME_CONFIG.STREAMING_DELAY_MS) {
                  const remainingDelay = Math.max(0, GAME_CONFIG.STREAMING_DELAY_MS - chunkElapsedTime);
                  await new Promise(resolve => setTimeout(resolve, remainingDelay));
                }
              }
            } catch (parseError) {
              console.error('Error parsing SSE JSON:', parseError, 'Line:', line);
            }
          }
        }
      }

      // Handle session completion after streaming is done
      if (sessionCompleted) {
        try {
          const newRuleResponse = await fetch(`${this.apiUrl}/api/new-rule`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              chat_history: currentMessages,
              rules_list: rules
            }),
          });
          const newRuleData = await newRuleResponse.json();
          newRule = newRuleData;
        } catch (error) {
          console.error('Error fetching new rule:', error);
        }
      }

      return {
        success: true,
        sessionCompleted,
        wasPasswordAttempt,
        newRule
      };

    } catch (error) {
      console.error('Error:', error);
      return {
        success: false,
        sessionCompleted: false,
        wasPasswordAttempt: false,
        error: 'Sorry, there was an error processing your message.'
      };
    }
  }

  async resetGame(): Promise<void> {
    try {
      await fetch(`${this.apiUrl}/api/reset-game`);
    } catch (error) {
      console.error('Error resetting game:', error);
    }
  }
} 