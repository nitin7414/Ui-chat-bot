// Use relative URL so Next.js rewrites proxy to backend (avoids CORS)
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface Attachment {
  name: string;
  content: string;
  mime_type: string;
  type: "text" | "image";
}

export interface ChatResponse {
  content: string;
}

const IMAGE_TYPES = /^image\//;

async function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.includes(",") ? result.split(",")[1]! : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const TEXT_TYPES = /\.(txt|md|json|csv|py|js|ts|tsx|jsx|html|css)$/i;
const TEXT_MIMES = /^(text\/|application\/json|application\/javascript)/;

async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file, "utf-8");
  });
}

export async function prepareAttachments(files: File[]): Promise<Attachment[]> {
  const attachments: Attachment[] = [];
  for (const file of files) {
    const isImage = IMAGE_TYPES.test(file.type);
    const isLikelyText =
      TEXT_MIMES.test(file.type) || TEXT_TYPES.test(file.name);
    const content =
      isImage || !isLikelyText
        ? await readFileAsBase64(file)
        : await readFileAsText(file);
    const type: "text" | "image" = isImage ? "image" : "text";
    attachments.push({
      name: file.name,
      content,
      mime_type: file.type || "application/octet-stream",
      type,
    });
  }
  return attachments;
}

export async function sendChat(
  messages: ChatMessage[],
  attachments?: Attachment[]
): Promise<string> {
  const url = `${BACKEND_URL}/api/chat`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        attachments: attachments ?? undefined,
      }),
    });
  } catch (e) {
    throw new Error(
      "Cannot reach backend. Is it running? Start it with: cd backend && uvicorn main:app --reload --port 8000"
    );
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Failed to get response");
  }
  const data: ChatResponse = await res.json();
  return data.content;
}
