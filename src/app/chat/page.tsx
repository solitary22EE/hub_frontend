"use client";

/**
 * Chat page — /chat
 *
 * Redirects to the most recent session, or shows a "Start a new chat" prompt.
 *
 * TODO:
 *  1. Fetch list of sessions via GET /api/v1/chat/sessions
 *  2. If sessions exist, redirect to /chat/[most-recent-session-id]
 *  3. Otherwise render a centered "Start chatting" button that POSTs /chat/sessions
 */
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import type { ChatSession } from "@/types";

export default function ChatIndexPage() {
  const router = useRouter();

  const { data: sessions, isLoading } = useQuery({
    queryKey: ["sessions"],
    queryFn: () => api.get<ChatSession[]>("/chat/sessions").then((r) => r.data),
  });

  const createSession = useMutation({
    mutationFn: () => api.post<ChatSession>("/chat/sessions", { title: "New Chat" }),
    onSuccess: (res) => router.push(`/chat/${res.data.id}`),
  });

  useEffect(() => {
    if (sessions && sessions.length > 0) {
      router.replace(`/chat/${sessions[0].id}`);
    }
  }, [sessions, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Welcome to CixioHub</h2>
        <p className="text-gray-500 mb-4">Start a conversation with the AI assistant</p>
        <button
          onClick={() => createSession.mutate()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          New Chat
        </button>
      </div>
    </div>
  );
}
