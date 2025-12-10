"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Loading from '@/components/Loading';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mapping backend values to Japanese
  const genderMap = {
    MALE: "男",
    FEMALE: "女",
    UNSPECIFIED: "未設定",
  };

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch("/api/allStudents"); // your API route
        const data = await res.json();
        console.log("STUDENT DATA:", data);
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
    <div className="flex flex-col w-full justify-center items-center">
      {/* Title and Button */}
      <div className="w-full max-w-lg flex mb-5 justify-around">
          <h2 className="text-2xl font-semibold">在生徒</h2>
          <Link
            href="/students/addStudent"
            className="flex bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded items-center"
          >
            生徒追加
          </Link>
      </div>
      {/* Main Container */}
      <div className="flex w-full flex-col items-center">
        <div className="w-full max-w-lg border">
          {students.map((student) => (
            <div key={student.id} className="flex odd:bg-green-100 px-1 py-3 border-b border-gray-300 last:border-b-0">
              {/* Name Container */}
              <div className="flex w-[40%]">
                <div className="flex flex-col px-1 w-1/2">
                  <span className="text-gray-400 text-xs">姓</span><span><ruby>{student.lastName}<rt>{student.lastNameFurigana}</rt></ruby></span>
                </div>
                <div className="flex flex-col px-1 w-1/2">
                  <span className="text-gray-400 text-xs">名</span><span><ruby>{student.firstName}<rt>{student.firstNameFurigana}</rt></ruby></span>
                </div>
              </div>
              {/* Middle Container */}
              <div className="flex w-[45%]">
                <div className="flex flex-col px-1 w-2/5 w-[40%]">
                  <span className="text-gray-400 text-xs">性別</span><span>{genderMap[student.gender] ?? "未設定"}</span>
                </div>
                <div className="flex flex-col px-1 w-3/5 w-[60%]">
                  <span className="text-gray-400 text-xs">学校</span><span>{student.school?.schoolName ?? "未設定"}</span>
                </div>
              </div>
              {/* Button Container */}
              <div className="flex w-[15%] justify-center items-center">
                <Link
                  href={`/student/${student.id}`}
                  className="flex bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded items-center"
                >
                  詳細
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
