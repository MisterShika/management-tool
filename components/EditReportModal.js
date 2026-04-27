"use client";
import { useState } from "react";

export default function EditReportModal({ report, onClose, onUpdated }) {
  const [editedNote, setEditedNote] = useState(report.note);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const res = await fetch("/api/dailyReports", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: report.id,
                note: editedNote,
            }),
        });

        if (!res.ok) throw new Error("Failed to update");

        onUpdated();
    } catch (err) {
        console.error(err);
        alert("更新に失敗しました");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-4 rounded w-full max-w-md">
        <h2 className="text-lg font-bold mb-2">レポート編集</h2>

        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full border p-2"
            value={editedNote}
            onChange={(e) => setEditedNote(e.target.value)}
          />

          <div className="flex justify-end mt-3 gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 bg-gray-400 text-white rounded"
            >
              キャンセル
            </button>

            <button
              type="submit"
              className="px-3 py-1 bg-blue-500 text-white rounded"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}