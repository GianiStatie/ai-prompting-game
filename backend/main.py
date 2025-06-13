import os
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

import dotenv
import uvicorn
from fastapi.responses import StreamingResponse

from src.agent import Agent

# Setup environment
dotenv.load_dotenv()
app = FastAPI()
agent = Agent()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:5173")],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.get("/")
async def read_root():
    return {"message": "Welcome to the AI Chat API"}

@app.get("/api/rules", response_model=List[Rule])
async def get_rules():
    llm_rules = agent.get_llm_rules()
    return [Rule(id=i, title=rule, description=rule) for i, rule in enumerate(llm_rules)]

@app.post("/api/chat", response_model=ChatResponse)
async def chat(message: Message, chat_history: List[Message]):
    response, is_done, is_password_attempt = agent.process_message(message.text, chat_history)
    return ChatResponse(message=response, is_done=is_done, is_password_attempt=is_password_attempt)

@app.post("/api/chat-stream")
async def stream(message: Message, chat_history: List[Message]):
    def generate():
        for chunk, is_done, is_password_attempt in agent.stream_message(message.text, chat_history):
            yield f"data: {json.dumps({'message': chunk, 'is_done': is_done, 'is_password_attempt': is_password_attempt})}\n\n"
    
    return StreamingResponse(generate(), media_type="text/event-stream")

@app.get("/api/reset-game")
async def reset_game():
    agent.reset_game()
    return {"message": "Game reset successfully"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 