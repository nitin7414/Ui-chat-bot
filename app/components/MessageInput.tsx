"use client";

import { useState, useRef, useEffect } from "react";

export interface AttachedFile {
  file: File;
  id: string;
}

interface MessageInputProps {
  onSend?: (message: string, files?: File[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function MessageInput({
  onSend,
  placeholder = "Start typing...",
  disabled = false,
}: MessageInputProps) {
  const [value, setValue] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    const maxHeight = 200;
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if ((!trimmed && attachedFiles.length === 0) || disabled) return;
    const files = attachedFiles.map((a) => a.file);
    onSend?.(trimmed || "", files.length > 0 ? files : undefined);
    setValue("");
    setAttachedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected || selected.length === 0) return;
    const newFiles = Array.from(selected).map((file) => ({
      file,
      id: crypto.randomUUID(),
    }));
    setAttachedFiles((prev) => [...prev, ...newFiles]);
    e.target.value = "";
  };

  const removeFile = (id: string) => {
    setAttachedFiles((prev) => prev.filter((a) => a.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="relative flex flex-col rounded-2xl border border-white/[0.08] bg-[#2a2d35] shadow-xl shadow-black/20 focus-within:border-amber-500/50 transition-colors overflow-hidden"
      >
        {/* Attached files preview */}
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3 pb-0">
            {attachedFiles.map(({ file, id }) => (
              <div
                key={id}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.06] border border-white/[0.08] text-sm"
              >
                <svg
                  className="w-4 h-4 text-amber-500/80 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="text-white/90 truncate max-w-[180px]">
                  {file.name}
                </span>
                <span className="text-white/40 text-xs shrink-0">
                  {formatFileSize(file.size)}
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(id)}
                  className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Remove file"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-end gap-2 p-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,.pdf,.txt,.doc,.docx,.csv,.json,.md,.py"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            disabled={disabled}
            className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Upload file"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="flex-1 min-h-[24px] max-h-[200px] resize-none bg-transparent px-4 py-3 text-[15px] text-white placeholder:text-white/40 outline-none disabled:opacity-50"
            style={{ height: "24px" }}
          />
          <button
            type="submit"
            disabled={(!value.trim() && attachedFiles.length === 0) || disabled}
            className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
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
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </form>
      <p className="text-center text-xs text-white/40 mt-3">
        AI can make mistakes. Verify important information.
      </p>
    </div>
  );
}
