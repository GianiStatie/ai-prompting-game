import random
import traceback
import re
from typing import List, Generator

from src.models import GroqModel, OllamaModel
from src.schemas import Message


class Agent:
    def __init__(self, model_type: str = "groq"):
        if model_type == "groq":
            self.model = GroqModel(model_name="meta-llama/llama-4-scout-17b-16e-instruct", thinking=True)
        elif model_type == "ollama":
            self.model = OllamaModel(model_name="llama3.2:1b", thinking=True)

    def get_initial_rules(self) -> List[str]:
        return [self.model.llm_rules[0]]

    def process_message(self, message: str, chat_history: List[Message], rules: List[str], game_session_id: str) -> tuple[str, bool]:
        first_capitalized_word = self.extract_first_capitalized_word(message)
        is_password_attempt = first_capitalized_word != None and len(first_capitalized_word) > 2

        # Check for password anywhere in message
        password = self.get_password(game_session_id, rules)
        if first_capitalized_word == password:
            return self.model.build_congratulations(), True, is_password_attempt

        response = self.model.build_message(message, password, chat_history, rules)
        return response, False, is_password_attempt

    def stream_message(self, message: str, chat_history: List[Message], rules: List[str], game_session_id: str) -> Generator[tuple[str, bool]]:
        first_capitalized_word = self.extract_first_capitalized_word(message)
        is_password_attempt = first_capitalized_word != None and len(first_capitalized_word) > 2
        
        # Check for password anywhere in message
        password = self.get_password(game_session_id, rules)
        if first_capitalized_word == password:
            for chunk in self.model.stream_congratulations():
                yield (chunk, True, is_password_attempt)

        else:
            try:
                for chunk in self.model.stream_message(message, password, chat_history, rules):
                    yield (chunk, False, is_password_attempt)
                
            except Exception as e:
                error_message = f"Error processing message: {str(e)} \n\n {traceback.format_exc()}"
                words = error_message.split()
                for word in words:
                    yield (word, False, is_password_attempt)
    
    def get_new_rule(self, session_id: str, chat_history: List[Message], rules: List[str]):
        password = self.get_password(session_id, rules)
        return self.model.get_new_rule(chat_history, rules, password)

    def extract_first_capitalized_word(self, message: str) -> str:
        matches = re.findall(r'\b[A-Z]+\b', message)
        if matches:
            return matches[0]
        return None

    def get_password(self, session_id: str, rules: List[str]):
        """Fetch password for the current session"""
        password_choices = [
            "password", "cat", "mouse", "dog", "bird", "fish", "horse", "rabbit", 
            "snake", "tiger", "lion", "elephant", "giraffe", "zebra", "penguin", 
            "koala", "kangaroo", "panda", "bear", "fox", "wolf", "cat", "dog", 
            "bird", "fish", "horse", "rabbit", "snake", "tiger", "lion", "elephant", 
            "giraffe", "zebra", "penguin", "koala", "panda", "bear", "fox", "wolf"
        ]

        passowrd_index = (int(session_id) + len(rules)) % len(password_choices)
        password = password_choices[passowrd_index].upper()
        print(f"Password for session {session_id}: {password}")
        return password

    def reset_game(self):
        self.model.reset_game()

    
