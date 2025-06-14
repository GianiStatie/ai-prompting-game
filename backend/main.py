import os
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List

import dotenv
import uvicorn
from fastapi.responses import StreamingResponse

from src.agent import Agent
from src.schemas import ChatResponse, Rule, ChatRequest, NewRuleRequest

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

@app.get("/")
async def read_root():
    return {"message": "Welcome to the AI Chat API"}

@app.get("/api/rules", response_model=List[Rule])
async def get_rules():
    llm_rules = agent.get_llm_rules()
    return [Rule(id=i, title=rule, description=rule) for i, rule in enumerate(llm_rules)]

@app.post("/api/new-rule", response_model=Rule)
async def get_new_rule(request: NewRuleRequest):
    rules = [rule.title for rule in request.rules_list]
    new_rule = agent.get_new_rule(request.session_id, request.chat_history, rules)
    return Rule(id=0, title=new_rule, description=new_rule)

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    rules = [rule.title for rule in request.rules_list]
    response, is_done, is_password_attempt = agent.process_message(request.message.text, request.chat_history, rules, request.session_id)
    return ChatResponse(message=response, is_done=is_done, is_password_attempt=is_password_attempt)

@app.post("/api/chat-stream")
async def stream(request: ChatRequest):
    rules = [rule.title for rule in request.rules_list]
    def generate():
        for chunk, is_done, is_password_attempt in agent.stream_message(request.message.text, request.chat_history, rules, request.session_id):
            yield f"data: {json.dumps({'message': chunk, 'is_done': is_done, 'is_password_attempt': is_password_attempt})}\n\n"
    
    return StreamingResponse(generate(), media_type="text/event-stream")

@app.get("/api/reset-game")
async def reset_game():
    agent.reset_game()
    return {"message": "Game reset successfully"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 