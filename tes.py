import requests

key = "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"

headers = {
    "Authorization": f"Bearer {key}"
}

r = requests.get(
    "https://openrouter.ai/api/v1/models",
    headers=headers
)

print(r.status_code)
print(r.text)