import re
from typing import Callable


class OutputGuard:
    def __init__(self):
        pass

    def get_checker(self, level: int) -> Callable[[str], bool]:
        if level < 3:
            return self.skip_check
        elif level == 3:
            return self.regex_check
        else:
            return self.regex_check

    def skip_check(self, model_output: str, password: str) -> bool:
        return True
    
    def regex_check(self, model_output: str, password: str) -> bool:
        pattern = r'\b(' + password + r')\b'
        return not bool(re.search(pattern, model_output))
    