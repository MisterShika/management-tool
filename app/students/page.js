"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Loading from '@/components/Loading';
import MenuButton from '@/components/MenuButton';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mapping backend values to Japanese
  const genderMap = {
    MALE: "男",
    FEMALE: "女",
    UNSPECIFIED: "未設定",
  };

  const schoolTypeMap = {
    ELEMENTARY: "小学校",
    MIDDLE: "中学校",
    HIGH: "高校",
    OTHER: "その他",
  };

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch("/api/allStudents"); // your API route
        const data = await res.json();
        setStudents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <h2>All Students</h2>
      <MenuButton buttonTitle="新しい生徒を追加" link="/students/addStudent" />
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">姓</th>
            <th className="px-4 py-2 border">名</th>
            <th className="px-4 py-2 border">生年月日</th>
            <th className="px-4 py-2 border">学校</th>
            <th className="px-4 py-2 border">学校種別</th>
            <th className="px-4 py-2 border">学年</th>
            <th className="px-4 py-2 border">性別</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
<tbody>
  {students.map((student) => (
    <tr key={student.id} className="hover:bg-gray-50">
      <td className="px-4 py-2 border">
        <ruby>
          {student.lastName}
          <rt>{student.lastNameFurigana}</rt>
        </ruby>
      </td>
      <td className="px-4 py-2 border">
        <ruby>
          {student.firstName}
          <rt>{student.firstNameFurigana}</rt>
        </ruby>
      </td>
      <td className="px-4 py-2 border">
        {new Date(student.birthday).toLocaleDateString("ja-JP")}
      </td>
      <td className="px-4 py-2 border">{student.school}</td>
      <td className="px-4 py-2 border">
        {schoolTypeMap[student.schoolType] ?? "未設定"}
      </td>
      <td className="px-4 py-2 border">{student.grade}</td>
      <td className="px-4 py-2 border">
        {genderMap[student.gender] ?? "未設定"}
      </td>

      {/* New column for color circle */}
      <td className="px-4 py-2 border">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: student.color }}
        />
      </td>

      <td className="px-4 py-2 border">
        <Link
          href={`/student/${student.id}`}
          className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center"
        >
          🔍 表示
        </Link>
      </td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
}
