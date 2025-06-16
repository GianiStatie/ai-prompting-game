import re
from typing import Callable


class InputGuard:
    def __init__(self):
        pass

    def get_checker(self, level: int) -> Callable[[str], bool]:
        if level < 4:
            return self.skip_check
        elif level == 4:
            return self.regex_check
        else:
            return self.regex_check

    def skip_check(self, _input: str) -> bool:
        return False
    
    def regex_check(self, input: str) -> bool:
        pattern = r'\b(password)\b'
        return bool(re.search(pattern, input.lower()))
    