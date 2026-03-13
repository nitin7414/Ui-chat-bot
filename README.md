# Chat App

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
