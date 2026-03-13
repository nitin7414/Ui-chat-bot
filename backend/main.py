import base64
import os
import io
from pathlib import Path
from typing import List, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader
from models import ChatRequest, Attachment
from openrouter_client import chat_completion

# Load environment variables
env_path = Path(__file__).parent / ".env"
load_dotenv(env_path)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

if not OPENROUTER_API_KEY:
    raise RuntimeError("OPENROUTER_API_KEY is missing in backend/.env")

app = FastAPI(
    title="Chat API",
    description="Chat backend with OpenRouter",
    version="1.1.0"
)

# CORS (update domain when deploying)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------
# Helper Functions
# --------------------------------

def extract_pdf_text(content_b64: str) -> str:
    """Extract text from base64 encoded PDF."""
    try:
        data = base64.b64decode(content_b64)
        reader = PdfReader(io.BytesIO(data))

        text = "\n".join(page.extract_text() or "" for page in reader.pages)

        # Limit text length to avoid token overflow
        return text[:15000]

    except Exception:
        return "[Unable to extract PDF text]"


def build_openrouter_messages(
    messages: List[dict],
    attachments: Optional[List[Attachment]]
):
    """
    Convert frontend messages to OpenRouter format.
    Includes attachment content inside the last user message.
    """

    if not messages:
        raise HTTPException(status_code=400, detail="Messages cannot be empty")

    openrouter_messages = []

    for i, msg in enumerate(messages):

        role = msg.get("role")
        content = msg.get("content", "")

        if not role:
            raise HTTPException(status_code=400, detail="Invalid message format")

        is_last_user = role == "user" and i == len(messages) - 1

        if is_last_user and attachments:

            text_parts = [content] if content.strip() else []

            for att in attachments:

                # Block images for Mistral
                if att.type == "image":
                    raise HTTPException(
                        status_code=400,
                        detail="Image attachments are not supported by this model"
                    )

                # Handle PDFs
                if att.mime_type == "application/pdf":
                    text_content = extract_pdf_text(att.content)

                else:
                    text_content = att.content

                text_parts.append(
                    f"\n\n[File: {att.name}]\n```\n{text_content}\n```"
                )

            combined = "\n".join(text_parts).strip()

            openrouter_messages.append({
                "role": role,
                "content": combined if combined else " "
            })

        else:

            openrouter_messages.append({
                "role": role,
                "content": content if content else " "
            })

    return openrouter_messages


# --------------------------------
# API Routes
# --------------------------------

@app.get("/health")
def health():
    """Health check endpoint."""
    return {
        "status": "ok",
        "openrouter_configured": bool(OPENROUTER_API_KEY)
    }


@app.post("/api/chat")
async def chat(request: ChatRequest):
    """
    Main chat endpoint.
    Sends conversation to OpenRouter and returns response.
    """

    try:

        # Convert pydantic models safely
        messages = [
            m.model_dump() if hasattr(m, "model_dump") else m
            for m in request.messages
        ]

        openrouter_messages = build_openrouter_messages(
            messages,
            request.attachments
        )

        response_text = await chat_completion(
            messages=openrouter_messages,
            model="mistralai/mistral-7b-instruct",
            api_key=OPENROUTER_API_KEY
        )

        return {"content": response_text}

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=502,
            detail=f"Chat provider error: {str(e)}"
        )