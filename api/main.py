import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from openai import AzureOpenAI

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = AzureOpenAI(
    api_key=os.environ["OPENAI_KEY"],
    azure_endpoint=os.environ["OPENAI_ENDPOINT"],
    api_version="2024-08-01-preview",
)

class ChatRequest(BaseModel):
    message: str

@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.post("/api/chat")
def chat(req: ChatRequest):
    def token_stream():
        stream = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": req.message}],
            stream=True,
        )
        for chunk in stream:
            if chunk.choices and chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content
    return StreamingResponse(token_stream(), media_type="text/plain")
