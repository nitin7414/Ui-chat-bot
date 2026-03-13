import httpx

OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
OPENROUTER_URL = f"{OPENROUTER_BASE_URL}/chat/completions"


async def chat_completion(
    messages: list[dict],
    model: str = "mistralai/mistral-7b-instruct",
    api_key: str = "",
) -> str:

    if not api_key:
        raise ValueError("OpenRouter API key is missing")

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Chat App",
    }

    payload = {
        "model": model,
        "messages": messages,
    }

    async with httpx.AsyncClient(timeout=60.0) as client:

        response = await client.post(
            OPENROUTER_URL,
            headers=headers,
            json=payload
        )

        if response.status_code == 401:
            raise Exception("Unauthorized: Invalid OpenRouter API key")

        response.raise_for_status()

        data = response.json()

        return data["choices"][0]["message"]["content"]