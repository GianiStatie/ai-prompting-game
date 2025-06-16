import re
from functools import partial
from typing import Callable, List

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.language_models import BaseChatModel

from src.prompts import PROMPTS


class InputGuard:
    def __init__(self, llm: BaseChatModel):
        self.llm = llm

    def get_checker(self, level: int) -> Callable[[str], bool]:
        if level < 4:
            return self.skip_check
        elif level == 4:
            return self.regex_check
        else:
            prompt_template = PROMPTS["input_guard"] if level == 5 else PROMPTS["input_guard_v2"]
            return partial(self.llm_check, prompt_template=prompt_template)

    def skip_check(self, user_message: str, chat_history: List[str]) -> bool:
        return True
    
    def regex_check(self, user_message: str, chat_history: List[str]) -> bool:
        pattern = r'\b(password)\b'
        return not bool(re.search(pattern, user_message.lower()))
    
    def llm_check(self, user_message: str, chat_history: List[str], prompt_template: str) -> bool:
        if not self.regex_check(user_message, chat_history):
            return False

        prompt = ChatPromptTemplate.from_messages([
            ("system", prompt_template)
        ])

        chain = prompt | self.llm
        response = chain.invoke({
            "chat_history": chat_history,
            "user_message": user_message
        })

        print("CHECK RESULT: ", response.content)

        return response.content == "safe"
    