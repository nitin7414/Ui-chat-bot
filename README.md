# AI Chatbot Web App

A full-stack AI chatbot application built using **Next.js (frontend)** and **FastAPI (backend)** that integrates with the **OpenRouter API** to access powerful large language models like **Mistral 7B**.

This chatbot allows users to interact with an AI assistant, upload PDF files, and receive responses based on both user queries and document content.

---

# Features

### AI Chat Interface
- Interactive chat UI built with Next.js
- Multi-turn conversation support
- Real-time responses from AI model

### OpenRouter Integration
- Connects to OpenRouter API
- Supports models like:
  - mistralai/mistral-7b-instruct
  - openai/gpt-4o-mini
  - anthropic/claude-3-haiku

### File Attachment Support
- Upload PDF files
- Extract text from PDFs
- Include document content in AI responses

### FastAPI Backend
- Handles chat requests
- Processes attachments
- Sends requests to OpenRouter
- Manages errors and responses

### CORS Support
Allows frontend and backend communication during development.

---

# Tech Stack

## Frontend
- Next.js
- React
- JavaScript / TypeScript
- Fetch API
- Tailwind CSS (optional)

## Backend
- Python
- FastAPI
- httpx
- pypdf
- python-dotenv

## AI Provider
- OpenRouter API
- Mistral 7B Instruct Model

---

# Project Structure

A ChatGPT-style chat interface with a FastAPI backend and OpenRouter AI.

## Quick Start

### 1. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add: OPENROUTER_API_KEY=sk-or-v1-your-key
uvicorn main:app --reload --port 8000
```

### 2. Frontend

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 3. API Key

Add your OpenRouter API key to `backend/.env`:
```
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxx
```
Get keys at [openrouter.ai/keys](https://openrouter.ai/keys).
