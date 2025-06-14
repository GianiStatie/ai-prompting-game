import { Message, Rule } from '../types';
import { GAME_CONFIG } from '../config/game';
import { loadRulesFromStorage, saveRulesToStorage } from '../utils/localStorage';

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
      const response = await this.makeStreamRequest(userMessage, currentMessages, rules);
      const streamResult = await this.processStreamResponse(response, onMessageUpdate);
      
      let newRule: Rule | undefined;
      if (streamResult.sessionCompleted) {
        newRule = await this.handleSessionCompletion(currentMessages, rules);
      }

      return {
        success: true,
        sessionCompleted: streamResult.sessionCompleted,
        wasPasswordAttempt: streamResult.wasPasswordAttempt,
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

  private async makeStreamRequest(
    userMessage: Message,
    currentMessages: Message[],
    rules: Rule[]
  ): Promise<Response> {
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

    return response;
  }

  private async processStreamResponse(
    response: Response,
    onMessageUpdate: (text: string) => void
  ): Promise<{ sessionCompleted: boolean; wasPasswordAttempt: boolean }> {
    let sessionCompleted = false;
    let wasPasswordAttempt = false;

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No reader available');
    }

    let aiMessageText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = new TextDecoder().decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const result = await this.processSseLine(line, aiMessageText, onMessageUpdate);
          if (result) {
            aiMessageText = result.aiMessageText;
            if (result.isPasswordAttempt) {
              wasPasswordAttempt = true;
            }
            if (result.isDone) {
              sessionCompleted = true;
            }
          }
        }
      }
    }

    return { sessionCompleted, wasPasswordAttempt };
  }

  private async processSseLine(
    line: string,
    currentAiMessageText: string,
    onMessageUpdate: (text: string) => void
  ): Promise<{ aiMessageText: string; isPasswordAttempt: boolean; isDone: boolean } | null> {
    try {
      const chunkStartTime = performance.now();

      const jsonStr = line.substring(6); // Remove "data: " prefix
      if (!jsonStr.trim()) {
        return null;
      }

      const response = JSON.parse(jsonStr);
      const { message: word, is_done, is_password_attempt } = response;

      const updatedAiMessageText = currentAiMessageText + word;
      onMessageUpdate(updatedAiMessageText);

      // Calculate elapsed time for processing this chunk
      const chunkElapsedTime = performance.now() - chunkStartTime;

      // Ensure minimum delay between chunks for smooth streaming
      if (chunkElapsedTime < GAME_CONFIG.STREAMING_DELAY_MS) {
        const remainingDelay = Math.max(0, GAME_CONFIG.STREAMING_DELAY_MS - chunkElapsedTime);
        await new Promise(resolve => setTimeout(resolve, remainingDelay));
      }

      return {
        aiMessageText: updatedAiMessageText,
        isPasswordAttempt: !!is_password_attempt,
        isDone: !!is_done
      };

    } catch (parseError) {
      console.error('Error parsing SSE JSON:', parseError, 'Line:', line);
      return null;
    }
  }

  private async handleSessionCompletion(
    currentMessages: Message[],
    rules: Rule[]
  ): Promise<Rule | undefined> {
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
      return newRuleData;
    } catch (error) {
      console.error('Error fetching new rule:', error);
      return undefined;
    }
  }

  async resetGame(): Promise<void> {
    try {
      await fetch(`${this.apiUrl}/api/reset-game`);
    } catch (error) {
      console.error('Error resetting game:', error);
    }
  }

  async fetchRules(): Promise<Rule[]> {
    try {
      // read from localStorage
      const rules = loadRulesFromStorage();
      if (rules.length > 0) {
        return rules;
      }
      // if no rules in localStorage, fetch from API
      const response = await fetch(`${this.apiUrl}/api/rules`);
      const defaultRules = await response.json();
      saveRulesToStorage(defaultRules);
      return defaultRules;
    } catch (error) {
      console.error('Error fetching rules:', error);
      return [];
    }
  }
} 