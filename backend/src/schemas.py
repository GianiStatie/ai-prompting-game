from pydantic import BaseModel


class Message(BaseModel):
    id: int
    text: str
    isUser: bool

class ChatResponse(BaseModel):
    message: str
    is_done: bool
    is_password_attempt: bool

class Rule(BaseModel):
    id: int
    title: str
    description: str