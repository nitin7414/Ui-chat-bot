# Chat Backend (FastAPI + OpenRouter)

## Setup

1. Create a virtual environment and install dependencies:

   ```bash
   cd backend
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate

   pip install -r requirements.txt
   ```

2. Copy `.env.example` to `.env` and add your OpenRouter API key:

   ```bash
   cp .env.example .env
   ```

   Edit `.env`:
   ```
   OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxx
   ```

   Get your key at [OpenRouter Keys](https://openrouter.ai/keys).

3. (Optional) Set a different model:
   ```
   OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
   ```
   Default is `openai/gpt-4o-mini`. See [OpenRouter Models](https://openrouter.ai/models).

## Run

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API runs at `http://localhost:8000`. The frontend expects this URL by default.

## API

- `GET /health` — Health check
- `POST /api/chat` — Chat completion

Request body:
```json
{
  "messages": [
    { "role": "user", "content": "Hello" }
  ],
  "attachments": [
    {
      "name": "file.txt",
      "content": "file content or base64 for images",
      "mime_type": "text/plain",
      "type": "text"
    }
  ]
}
```
