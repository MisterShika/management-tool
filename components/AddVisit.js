"use client";
import { useState, useEffect } from "react";

export default function AddVisit({ defaultDate, onClose }) {
  const [studentId, setStudentId] = useState("");
  const [date, setDate] = useState(defaultDate || "");
  const [students, setStudents] = useState([]);

  // Fetch active students
  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch("/api/allStudents");
        const data = await res.json();
        setStudents(data.filter(s => s.isActive));
      } catch (err) {
        console.error(err);
      }
    }
    fetchStudents();
  }, []);

  // Update date if defaultDate changes
  useEffect(() => {
    if (defaultDate) setDate(defaultDate);
  }, [defaultDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!studentId || !date) return alert("Select a student and a date");

    console.log("Visit data:", { studentId, date });
    alert(`Visit for student ID ${studentId} on ${date} saved (state only)`);
    onClose(); // close modal after submit
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">Student</label>
        <select
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
          className="border p-2 w-full"
        >
          <option value="">Select a student</option>
          {students.map(s => (
            <option key={s.id} value={s.id}>
              {s.lastName} {s.firstName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="border p-2 w-full"
        />
      </div>

      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Save Visit
      </button>
    </form>
  );
}
