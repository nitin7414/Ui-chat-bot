"use client";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  attachments?: { name: string; size: number }[];
  isLoading?: boolean;
}

interface ChatAreaProps {
  messages: Message[];
  isEmpty: boolean;
  onSendMessage?: (message: string, files?: File[]) => void;
}

export default function ChatArea({
  messages,
  isEmpty,
  onSendMessage,
}: ChatAreaProps) {
  return (
    <main className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center px-6 pb-32">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center mb-6 ring-1 ring-amber-500/20">
              <svg
                className="w-8 h-8 text-amber-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-white mb-2">
              How can I help you today?
            </h1>
            <p className="text-white/50 text-center max-w-md mb-10">
              Start a conversation by typing a message below. Your chat history
              will appear here.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
              {[
                "Explain quantum computing in simple terms",
                "Write a creative short story",
                "Help me plan a weekend trip",
                "Draft an email to my team",
              ].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => onSendMessage?.(suggestion)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.03] text-left text-sm text-white/80 hover:bg-white/[0.06] hover:border-white/[0.12] transition-colors"
                >
                  <span className="text-amber-500/80">✦</span>
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto py-8 px-4 pb-32">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-4 mb-8 ${msg.role === "user" ? "justify-end" : ""}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 shrink-0 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                  </div>
                )}
                <div
                  className={`flex-1 min-w-0 ${
                    msg.role === "user"
                      ? "flex justify-end"
                      : "max-w-[85%] sm:max-w-[90%]"
                  }`}
                >
                  <div
                    className={`inline-block px-4 py-3 rounded-2xl text-[15px] leading-relaxed ${
                      msg.role === "user"
                        ? "bg-amber-500/20 text-white border border-amber-500/20"
                        : "bg-white/[0.06] text-white/90 border border-white/[0.06]"
                    }`}
                  >
                    {msg.isLoading ? (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500/80 animate-bounce [animation-delay:0ms]" />
                        <span className="w-2 h-2 rounded-full bg-amber-500/80 animate-bounce [animation-delay:150ms]" />
                        <span className="w-2 h-2 rounded-full bg-amber-500/80 animate-bounce [animation-delay:300ms]" />
                      </span>
                    ) : (msg.content || msg.attachments?.length) ? (
                      <>
                        {msg.content && <p>{msg.content}</p>}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className={`space-y-1 ${msg.content ? "mt-2 pt-2 border-t border-white/10" : ""}`}>
                            <span className="text-xs text-white/60">📎 Attached:</span>
                            {msg.attachments.map((a, i) => {
                              const size =
                                a.size < 1024
                                  ? `${a.size} B`
                                  : a.size < 1024 * 1024
                                    ? `${(a.size / 1024).toFixed(1)} KB`
                                    : `${(a.size / (1024 * 1024)).toFixed(1)} MB`;
                              return (
                                <p key={i} className="text-sm text-white/80">
                                  {a.name} ({size})
                                </p>
                              );
                            })}
                          </div>
                        )}
                      </>
                    ) : (
                      <span className="text-white/60">—</span>
                    )}
                  </div>
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-sm font-medium text-white">
                    U
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
