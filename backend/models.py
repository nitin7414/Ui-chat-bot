from typing import Optional
from pydantic import BaseModel, Field


class Attachment(BaseModel):
    name: str
    content: str  # Base64 for images, plain text for text files
    mime_type: str
    type: str = "text"  # "text" or "image"


class ChatMessage(BaseModel):
    role: str = Field(..., pattern="^(user|assistant|system)$")
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    attachments: Optional[list[Attachment]] = None
