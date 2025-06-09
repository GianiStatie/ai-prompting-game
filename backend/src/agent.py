import random
import traceback
from typing import List, Generator

from src.models import GroqModel, OllamaModel



class Agent:
    def __init__(self, model_type: str = "groq"):
        self.password = self.generate_password()
        print(f"Password: {self.password}")

        if model_type == "groq":
            self.model = GroqModel(model_name="meta-llama/llama-4-scout-17b-16e-instruct", thinking=True)
        elif model_type == "ollama":
            self.model = OllamaModel(model_name="llama3.2:1b", thinking=True)

    def get_llm_rules(self) -> List[str]:
        return self.model.llm_rules

    def process_message(self, message: str, chat_history: List[str] = []) -> tuple[str, bool]:
        if self.password in message:
            self.model.update_rules(chat_history, self.password)
            self.password = self.generate_password()
            print(f"New Password: {self.password}")
            return self.model.build_congratulations(), True

        response = self.model.build_message(message, self.password, chat_history)
        return response, False

    def stream_message(self, message: str, chat_history: List[str] = []) -> Generator[tuple[str, bool]]:
        if self.password in message:
            self.model.update_rules(chat_history, self.password)
            self.password = self.generate_password()
            print(f"New Password: {self.password}")
            for chunk in self.model.stream_congratulations():
                yield (chunk, True)

        else:
            try:
                for chunk in self.model.stream_message(message, self.password, chat_history):
                    yield (chunk, False)
                
            except Exception as e:
                error_message = f"Error processing message: {str(e)} \n\n {traceback.format_exc()}"
                words = error_message.split()
                for word in words:
                    yield (word, False)
        

    def generate_password(self):
        """Generate a new password."""
        password_choices = ["password", "cat", "mouse", "dog", "bird", "fish", "horse", "rabbit", "snake", "tiger", "lion", "elephant", "giraffe", "zebra", "penguin", "koala", "kangaroo", "panda", "bear", "fox", "wolf", "cat", "dog", "bird", "fish", "horse", "rabbit", "snake", "tiger", "lion", "elephant", "giraffe", "zebra", "penguin", "koala", "panda", "bear", "fox", "wolf"]
        return random.choice(password_choices).upper()

    
    
