"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Loading from '@/components/Loading';

export default function StudentPage() {
  const params = useParams();
  const studentId = params.id;

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

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
    async function fetchStudent() {
      try {
        const res = await fetch(`/api/allStudents/${studentId}`);
        if (!res.ok) throw new Error("Failed to fetch student");
        const data = await res.json();
        setStudent(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchStudent();
  }, [studentId]);

  if (loading) return <Loading />;
  if (!student) return <p>Student not found.</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">生徒情報</h2>

  <p className="text-sm text-gray-500 mb-4">
    最終更新:{" "}
    {new Date(student.lastEdited).toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })}
  </p>

      <table className="min-w-full border border-gray-300">
        <tbody>
          <tr>
            <th className="px-4 py-2 border text-left">姓</th>
            <td className="px-4 py-2 border">
              <ruby>
                {student.lastName}
                <rt>{student.lastNameFurigana}</rt>
              </ruby>
            </td>
          </tr>
          <tr>
            <th className="px-4 py-2 border text-left">名</th>
            <td className="px-4 py-2 border">
              <ruby>
                {student.firstName}
                <rt>{student.firstNameFurigana}</rt>
              </ruby>
            </td>
          </tr>
          <tr>
            <th className="px-4 py-2 border text-left">生年月日</th>
            <td className="px-4 py-2 border">
              {new Date(student.birthday).toLocaleDateString("ja-JP")}
            </td>
          </tr>
          <tr>
            <th className="px-4 py-2 border text-left">学校</th>
            <td className="px-4 py-2 border">{student.school}</td>
          </tr>
          <tr>
            <th className="px-4 py-2 border text-left">学校種別</th>
            <td className="px-4 py-2 border">
              {schoolTypeMap[student.schoolType] ?? "未設定"}
            </td>
          </tr>
          <tr>
            <th className="px-4 py-2 border text-left">学年</th>
            <td className="px-4 py-2 border">{student.grade}</td>
          </tr>
          <tr>
            <th className="px-4 py-2 border text-left">性別</th>
            <td className="px-4 py-2 border">
              {genderMap[student.gender] ?? "未設定"}
            </td>
          </tr>
          <tr>
            <th className="px-4 py-2 border text-left">住所</th>
            <td className="px-4 py-2 border">{student.address}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
