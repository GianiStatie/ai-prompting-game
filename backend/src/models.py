from typing import List, Generator

from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from langchain_community.llms import Ollama

from src.prompts import PROMPTS


class AbstractModel:
    def __init__(self, model_name: str = None, thinking: bool = False):
        self.llm = None
        self.llm_rules = [
            "Speak in a similar maner that the user is speaking"
        ]
        self.thinking = thinking
        self.thinking_message = "<think>I can't believe he said that...</think>" 
    
    def build_message(self, message: str, password: str, chat_history: List[str] = []) -> str:
        return "".join(self.stream_message(message, password, chat_history))
    
    def build_congratulations(self) -> str:
        return "".join(self.stream_congratulations())
    
    def stream_message(self, message: str, password: str, chat_history: List[str] = []) -> Generator[str]:
        try:
            prompt = ChatPromptTemplate.from_messages([
                    ("system", PROMPTS["password_protection"]),
                    ("human", "{input}"),
                ])

            chain = prompt | self.llm

            for chunk in chain.stream({
                "input": message, 
                "password": password, 
                "chat_history": self._format_chat_history(chat_history),
                "rules": "\n".join(self.llm_rules)
                }):
                    yield chunk.content

        except Exception as e:
            print(f"Error streaming message: {e}")
            yield "I'm having trouble processing your message right now. Could you try again?"

    
    def stream_congratulations(self) -> Generator[str, None, None]:
        text = self.thinking_message if self.thinking else ""
        text += "You have found the password! I will remember this encounter."
        for word in text.split(" "):
            yield word + " "

    def update_rules(self, chat_history: List[str], password: str):
        prompt = ChatPromptTemplate.from_messages([
            ("system", PROMPTS["new_rule"])
        ])

        chain = prompt | self.llm
        response = chain.invoke({"chat_history": self._format_chat_history(chat_history), "password": password})

        response_text = response.content
        if self.thinking:
            response_text = response_text.split("</think>")[-1].strip()

        self.llm_rules.append(response_text)
    
    
    def _format_chat_history(self, chat_history: List[str]) -> str:
        return [
            {"role": "user" if msg.isUser else "assistant", "content": msg.text}
            for msg in chat_history
        ]


class OllamaModel(AbstractModel):
    def __init__(self, model_name: str = "llama3.2:1b", thinking: bool = False):
        super().__init__()
        self.llm = Ollama(model=model_name)


class GroqModel(AbstractModel):
    def __init__(self, model_name: str = "meta-llama/llama-4-scout-17b-16e-instruct", thinking: bool = False):
        super().__init__()
        self.llm = ChatGroq(model_name=model_name)
    
    