import re
from functools import partial
from typing import Callable

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.language_models import BaseChatModel

from src.prompts import PROMPTS


class OutputGuard:
    def __init__(self, llm: BaseChatModel):
        self.llm = llm

    def get_checker(self, level: int) -> Callable[[str], bool]:
        if level < 3:
            return self.skip_check
        elif level < 7:
            return self.regex_check
        else:
            # TODO: add a v2 prompt once user finds a loophole
            prompt_template = PROMPTS["output_guard"]
            return partial(self.llm_check, prompt_template=prompt_template)

    def skip_check(self, model_output: str, password: str) -> bool:
        return True
    
    def regex_check(self, model_output: str, password: str) -> bool:
        pattern = r'\b(' + password + r')\b'
        return not bool(re.search(pattern, model_output))

    def llm_check(self, model_output: str, password: str, prompt_template: str) -> bool:
        if not self.regex_check(model_output, password):
            return False

        prompt = ChatPromptTemplate.from_messages([
            ("system", prompt_template)
        ])

        chain = prompt | self.llm
        response = chain.invoke({
            "model_output": model_output,
            "password": password
        })

        return response.content == "safe"