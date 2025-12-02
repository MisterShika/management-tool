"use client";
import { useEffect, useState } from "react";

export default function ConnectLesson({ visitId, onClose }) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [selectedLessonId, setSelectedLessonId] = useState("");

  const handleAddCompletion = async () => {
    try {
    const res = await fetch(`/api/lessonCompletions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitId: Number(visitId),
        lessonId: Number(selectedLessonId),
      }),
    });

      if (!res.ok) throw new Error("Failed to add");

      // Refresh the visit page so the updated completions load
      onClose();
    } catch (err) {
      console.error(err);
      alert("追加に失敗しました。");
    }
  };

  // Fetch lessons when type changes
useEffect(() => {
  if (!selectedType) {
    setLessons([]);
    setSelectedLessonId(""); // no type clear selection
    return;
  }

  const fetchLessons = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/allLessons/byType/${selectedType}`);
      if (!res.ok) throw new Error("Failed to fetch lessons");
      const data = await res.json();
      setLessons(data);

      // If there are no lessons for this type, clear selection
      if (data.length === 0) setSelectedLessonId("");
      // If the current selection is not in the new list, clear it
      else if (!data.some((lesson) => lesson.id === Number(selectedLessonId))) {
        setSelectedLessonId("");
      }
    } catch (err) {
      console.error("Error fetching lessons:", err);
      setLessons([]);
      setSelectedLessonId(""); // clear selection on error
    } finally {
      setLoading(false);
    }
  };

  fetchLessons();
}, [selectedType]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white pt-4 pb-6 px-4 rounded-lg shadow-lg text-center max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-row-reverse">
          <button
            className="p-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            ✖
          </button>
        </div>

        <h2 className="text-xl font-bold mb-4">授業を追加</h2>

        {/* Lesson Type Selector */}
        <div className="mb-4">
          <select
            className="border px-2 py-1 rounded w-full"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">種類を選択</option>
            <option value="FREE">Free</option>
            <option value="MINECRAFT">Minecraft</option>
            <option value="SCRATCH">Scratch</option>
            <option value="INDEPENDENT">Independent</option>
            <option value="OTHER">その他</option>
          </select>
        </div>

        {/* Lesson Dropdown */}
        <div>
          {loading ? (
            <p className="text-gray-500">読み込み中…</p>
          ) : (
            <select
              className="border px-2 py-1 rounded w-full"
              value={selectedLessonId}
              onChange={(e) => setSelectedLessonId(e.target.value)}
              disabled={!selectedType || lessons.length === 0}
            >
              <option value="">授業を選択してください</option>
              {lessons.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.name} ({lesson.type})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Show selected lesson */}
        {selectedLessonId && (
<button
  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
  onClick={handleAddCompletion}
  disabled={!selectedLessonId}
>
  完了として追加
</button>
        )}
      </div>
    </div>
  );
}
