import os
import json
from typing import List

import dotenv
import uvicorn
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

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

def get_real_ip(request: Request) -> str:
    x_forwarded_for = request.headers.get("X-Forwarded-For")
    if x_forwarded_for:
        # May contain multiple IPs, first is the original client
        return x_forwarded_for.split(",")[0].strip()
    return request.client.host  # fallback if no header

limiter = Limiter(key_func=get_real_ip)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.get("/")
async def read_root():
    return {"message": "Welcome to the AI Chat API"}

@app.get("/api/rules", response_model=List[Rule])
async def get_rules():
    llm_rules = agent.get_initial_rules()
    return [Rule(id=i, title=rule, description=rule) for i, rule in enumerate(llm_rules)]

@app.post("/api/new-rule", response_model=Rule)
@limiter.limit("42/minute")
async def get_new_rule(rule_request: NewRuleRequest, request: Request):
    rules = [rule.title for rule in rule_request.rules_list]
    new_rule = agent.get_new_rule(rule_request.session_id, rule_request.chat_history, rules)
    return Rule(id=0, title=new_rule, description=new_rule)

@app.post("/api/chat", response_model=ChatResponse)
@limiter.limit("42/minute")
async def chat(chat_request: ChatRequest, request: Request):
    rules = [rule.title for rule in chat_request.rules_list]
    response, is_done, is_password_attempt = agent.process_message(chat_request.message.text, chat_request.chat_history, rules, chat_request.session_id)
    return ChatResponse(message=response, is_done=is_done, is_password_attempt=is_password_attempt)

@app.post("/api/chat-stream")
@limiter.limit("42/minute")
async def stream(chat_request: ChatRequest, request: Request):
    rules = [rule.title for rule in chat_request.rules_list]
    def generate():
        for chunk, is_done, is_password_attempt in agent.stream_message(chat_request.message.text, chat_request.chat_history, rules, chat_request.session_id):
            yield f"data: {json.dumps({'message': chunk, 'is_done': is_done, 'is_password_attempt': is_password_attempt})}\n\n"
    
    return StreamingResponse(generate(), media_type="text/event-stream")

@app.get("/api/reset-game")
async def reset_game():
    agent.reset_game()
    return {"message": "Game reset successfully"}


@app.get("/limit-test")
@limiter.limit("10/minute")
def test(request: Request):
    return {"message": "Hello"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 