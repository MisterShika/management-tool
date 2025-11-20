"use client";
import { useState } from "react";
import { useUser } from "@/components/UserContext";

export default function ConnectReport({ visitId, onClose, onSubmitted }) {
  const user = useUser();
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!note.trim()) {
      alert("レポート内容を入力してください。");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/dailyReports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitId,
          userId: user.id,
          note,
        }),
      });

      if (res.status === 409) {
        alert("この訪問には既にレポートがあります。");
        return;
      }

      if (!res.ok) throw new Error("Failed to submit report");

      // Notify parent to refresh visit
      if (onSubmitted) onSubmitted();

      onClose();
    } catch (err) {
      console.error(err);
      alert("レポートの追加に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white pt-0 pb-6 px-4 rounded-lg shadow-lg text-center max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-row-reverse">
          <button
            className="mt-2 p-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            ✖
          </button>
        </div>

        <h2 className="text-xl font-bold mb-4">レポートを追加</h2>

        <textarea
          className="border p-2 rounded w-full h-32"
          placeholder="レポート内容を入力してください"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "送信中…" : "送信"}
        </button>
      </div>
    </div>
  );
}
