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

    def skip_check(self, _output: str, _password: str) -> bool:
        return False
    
    def regex_check(self, output: str, password: str) -> bool:
        pattern = r'\b(' + password + r')\b'
        return bool(re.search(pattern, output.lower()))
    