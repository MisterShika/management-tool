"use client";

import { useState } from "react";

export default function AssistantPage() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!message) return;

    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
        }),
      });

      const data = await response.json();

      setReply(data.reply);
    } catch (error) {
      console.error(error);
      setReply("Error talking to AI.");
    }

    setLoading(false);
  }

  return (
    <div className="p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">
        ローカルAIアシスタント
      </h1>

      <textarea
        className="border p-2 w-full rounded mb-4"
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="AIと話す..."
      />

      <button
        onClick={sendMessage}
        className="bg-black text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "考え中..." : "送信"}
      </button>

      <div className="mt-6">
        <h2 className="font-bold mb-2">応答:</h2>

        <div className="border rounded p-4 whitespace-pre-wrap">
          {reply}
        </div>
      </div>
    </div>
  );
}