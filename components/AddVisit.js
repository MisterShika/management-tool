"use client";
import { useState, useEffect } from "react";

export default function AddVisit({ defaultDate, onClose, onSubmitSuccess }) {
  const [studentId, setStudentId] = useState("");
  const [date, setDate] = useState(defaultDate || "");
  const [students, setStudents] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch("/api/allStudents");
        const data = await res.json();
        setStudents(data.filter((s) => s.isActive));
      } catch (err) {
        console.error(err);
      }
    }
    fetchStudents();
  }, []);

  useEffect(() => {
    if (defaultDate) setDate(defaultDate);
  }, [defaultDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId || !date) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/allVisits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: Number(studentId),
          date: new Date(date).toISOString(),
          status: "PLANNED",
        }),
      });

      if (!res.ok) throw new Error("Failed to add visit");

      // 🔑 Call parent callback to refresh calendar
      if (onSubmitSuccess) onSubmitSuccess();

      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">生徒</label>
        <select
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
          className="border p-2 w-full"
          disabled={isSubmitting}
        >
          <option value="">- 学生を選択 -</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.lastName} {s.firstName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">日付</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="border p-2 w-full"
          disabled={isSubmitting}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 text-white p-2 rounded w-full disabled:opacity-50"
      >
        {isSubmitting ? "追加中..." : "追加"}
      </button>
    </form>
  );
}
