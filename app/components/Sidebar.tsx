"use client";

import { useState } from "react";

interface Chat {
  id: string;
  title: string;
  date: string;
}

interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) {

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full flex flex-col bg-[#17191e] border-r border-white/[0.06] transition-all duration-300 ease-out
          ${isCollapsed ? "w-[72px]" : "w-[280px]"} 
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-14 px-4 shrink-0 border-b border-white/[0.06]">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
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
              <span className="font-semibold text-[15px] text-white tracking-tight">
                Chat
              </span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <button
              onClick={onNewChat}
              className={`p-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors ${isCollapsed ? "mx-auto" : ""}`}
              title="New chat"
            >
              {isCollapsed ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 inline-block mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span className="text-sm">New chat</span>
                </>
              )}
            </button>
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg
                className={`w-5 h-5 transition-transform ${isCollapsed ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Recent chats */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          {!isCollapsed && (
            <div className="px-2 mb-2">
              <span className="text-xs font-medium text-white/40 uppercase tracking-wider">
                Recent
              </span>
            </div>
          )}
          <ul className="space-y-0.5">
            {chats.map((chat) => (
              <li key={chat.id}>
                <button
                  onClick={() => onSelectChat(chat.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors group
                    ${activeChatId === chat.id ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"}
                    ${isCollapsed ? "justify-center px-2" : ""}`}
                >
                  <svg
                    className="w-4 h-4 shrink-0 text-white/50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  {!isCollapsed && (
                    <div className="min-w-0 flex-1">
                      <span className="block truncate text-sm">{chat.title}</span>
                      <span className="block truncate text-xs text-white/40 mt-0.5">
                        {chat.date}
                      </span>
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer - User section placeholder */}
        {!isCollapsed && (
          <div className="p-3 border-t border-white/[0.06]">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-sm font-medium text-white">
                U
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-sm text-white truncate">User</span>
                <span className="block text-xs text-white/50 truncate">
                  Free plan
                </span>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
