"use client";

import { useState, useCallback } from "react";
import Sidebar from "./Sidebar";
import ChatArea, { type Message } from "./ChatArea";
import MessageInput from "./MessageInput";
import { prepareAttachments, sendChat } from "../lib/chat-api";

const MOCK_CHATS = [
  { id: "1", title: "Understanding machine learning", date: "Today" },
  { id: "2", title: "React best practices", date: "Yesterday" },
  { id: "3", title: "Travel itinerary for Japan", date: "Mar 10" },
  { id: "4", title: "Python data analysis", date: "Mar 9" },
  { id: "5", title: "Recipe for pasta carbonara", date: "Mar 8" },
];

export default function ChatPage() {
  const [chats, setChats] = useState(MOCK_CHATS);
  const [activeChatId, setActiveChatId] = useState<string | null>("1");
  const [messages, setMessages] = useState<Message[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNewChat = useCallback(() => {
    setActiveChatId(null);
    setMessages([]);
    setSidebarOpen(false);
    setError(null);
  }, []);

  const handleSelectChat = useCallback((id: string) => {
    setActiveChatId(id);
    setSidebarOpen(false);
  }, []);

  const handleSendMessage = useCallback(
    async (content: string, files?: File[]) => {
      const attachments = files?.map((f) => ({ name: f.name, size: f.size }));
      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
        attachments,
      };
      setMessages((prev) => [...prev, userMsg]);
      setError(null);
      setIsLoading(true);

      const placeholderId = crypto.randomUUID();
      const assistantMsg: Message = {
        id: placeholderId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isLoading: true,
      };
      setMessages((prev) => [...prev, assistantMsg]);

      try {
        const chatHistory = [
          ...messages.map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
          { role: "user" as const, content: content.trim() },
        ];
        const preparedFiles = files?.length
          ? await prepareAttachments(files)
          : undefined;
        const response = await sendChat(chatHistory, preparedFiles);

        setMessages((prev) =>
          prev.map((m) =>
            m.id === placeholderId ? { ...m, content: response, isLoading: false } : m
          )
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to get response";
        setError(message);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === placeholderId
              ? { ...m, content: `[Error: ${message}]`, isLoading: false }
              : m
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [messages]
  );

  return (
    <div className="flex h-screen bg-[#0f1117] text-white overflow-hidden">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
      />

      <div
        className={`flex flex-col flex-1 min-w-0 transition-[margin] duration-300 ${
          sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[280px]"
        }`}
      >
        <header className="h-14 shrink-0 flex items-center gap-3 px-4 border-b border-white/[0.06] bg-[#0f1117]/80 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Open menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-sm font-medium text-white/80 truncate">
            {activeChatId
              ? chats.find((c) => c.id === activeChatId)?.title ?? "Chat"
              : "New chat"}
          </h1>
          {error && (
            <span className="text-xs text-amber-400/90 truncate ml-auto">
              {error}
            </span>
          )}
        </header>

        <ChatArea
          messages={messages}
          isEmpty={messages.length === 0}
          onSendMessage={handleSendMessage}
        />

        <div className="shrink-0 py-4 px-4 border-t border-white/[0.06] bg-[#0f1117]">
          <MessageInput
            onSend={handleSendMessage}
            disabled={isLoading}
            placeholder={isLoading ? "Waiting for response…" : "Message…"}
          />
        </div>
      </div>
    </div>
  );
}
