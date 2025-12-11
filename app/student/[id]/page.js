'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loading from '@/components/Loading';
import Link from "next/link";

export default function StudentPage() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [schoolList, setSchoolList] = useState([]);

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

  // --------------------------------------------
  // Fetch student
  // --------------------------------------------
  useEffect(() => {
    async function fetchStudent() {
      try {
        const res = await fetch(`/api/allStudents/${id}`);
        if (!res.ok) throw new Error("Failed to fetch student");
        const data = await res.json();

        setStudent(data);

        setFormData({
          ...data,
          birthday: data.birthday
            ? new Date(data.birthday).toISOString().substring(0, 10)
            : "",
          schoolId: data.school?.id ?? "",   // IMPORTANT
        });

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchStudent();
  }, [id]);

  // --------------------------------------------
  // Fetch school list once
  // --------------------------------------------
  useEffect(() => {
    async function fetchSchools() {
      const res = await fetch("/api/allSchools/names");
      const data = await res.json();
      setSchoolList(data);
    }
    fetchSchools();
  }, []);

  if (loading) return <Loading />;
  if (!student) return <p>Student not found.</p>;

  // --------------------------------------------
  // Handle change of any form field
  // --------------------------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // --------------------------------------------
  // Save updates
  // --------------------------------------------
  const handleSave = async () => {
    try {
      const res = await fetch(`/api/allStudents/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          schoolId: formData.schoolId ? Number(formData.schoolId) : null, 
        }),
      });

      if (!res.ok) throw new Error("Failed to save student");

      const updated = await res.json();
      setStudent(updated);
      setEditing(false);

    } catch (err) {
      console.error(err);
      alert("更新に失敗しました。");
    }
  };

  // --------------------------------------------
  // Delete student
  // --------------------------------------------
  const handleDelete = async () => {
    if (!confirm("本当にこの生徒を削除しますか？")) return;
    try {
      const res = await fetch(`/api/allStudents/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete student");

      alert("生徒を削除しました。");
      window.location.href = "/students";

    } catch (err) {
      console.error(err);
      alert("削除に失敗しました。");
    }
  };

  // --------------------------------------------
  // Render UI
  // --------------------------------------------
  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">生徒情報（ID: {student.id}）</h2>
        {!editing && (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => setEditing(true)}
          >
            編集
          </button>
        )}
      </div>

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
          {[
            { label: "ふりがな（姓）", name: "lastNameFurigana" },
            { label: "姓", name: "lastName" },
            { label: "ふりがな（名）", name: "firstNameFurigana" },
            { label: "名", name: "firstName" },
            { label: "生年月日", name: "birthday", type: "date" },
            { label: "住所", name: "address" },

            { label: "学校", name: "schoolId" },

            { label: "学校種別", name: "schoolType", options: schoolTypeMap },
            { label: "学年", name: "grade" },
            { label: "性別", name: "gender", options: genderMap },
            { label: "アクティブ", name: "isActive", type: "checkbox" },
            { label: "色", name: "color", type: "color" },
          ].map((field) => {
            if (editing && field.name === "schoolType") return null;

            return (
              <tr key={field.name}>
                <th className="px-4 py-2 border text-left bg-gray-50">
                  {field.label}
                </th>
                <td className="px-4 py-2 border">

                  {/* EDIT MODE */}
                  {editing ? (
                    field.name === "schoolId" ? (
                      <select
                        name="schoolId"
                        value={formData.schoolId ?? ""}
                        onChange={handleChange}
                        className="border px-2 py-1 rounded w-full"
                      >
                        <option value="">未設定</option>
                        {schoolList.map((school) => (
                          <option key={school.id} value={school.id}>
                            {school.schoolName}
                          </option>
                        ))}
                      </select>

                    ) : field.options ? (
                      <select
                        name={field.name}
                        value={formData[field.name] ?? ""}
                        onChange={handleChange}
                        className="border px-2 py-1 rounded"
                      >
                        <option value="">未設定</option>
                        {Object.entries(field.options).map(([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </select>

                    ) : (
                      <input
                        type={field.type || "text"}
                        name={field.name}
                        value={formData[field.name] ?? ""}
                        onChange={handleChange}
                        className="border px-2 py-1 rounded w-full"
                      />
                    )
                  ) : (
                    // VIEW MODE
                    field.name === "schoolId" ? (
                      <Link 
                        href={`/school/${student.school.id}`}
                        className="text-blue-600 underline"
                      >
                      {student.school.schoolName}
                      </Link> ?? "未設定"
                    ) : field.name === "schoolType" ? (
                      schoolTypeMap[student.school?.schoolType] ?? "未設定"
                    ) : field.options ? (
                      field.options[student[field.name]] ?? "未設定"
                    ) : field.type === "checkbox" ? (
                      student[field.name] ? "はい" : "いいえ"
                    ) : field.type === "color" ? (
                      <span
                        className="inline-block w-6 h-6 rounded-full"
                        style={{ backgroundColor: student.color }}
                      />
                    ) : field.name === "birthday" ? (
                      new Date(student.birthday).toLocaleDateString("ja-JP")
                    ) : (
                      student[field.name]
                    )
                  )}

                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Buttons */}
      {editing && (
        <div className="flex gap-2 mt-4">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded"
            onClick={handleSave}
          >
            保存
          </button>
          <button
            className="px-4 py-2 bg-gray-300 text-black rounded"
            onClick={() => setEditing(false)}
          >
            キャンセル
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded ml-auto"
            onClick={handleDelete}
          >
            削除
          </button>
        </div>
      )}
    </div>
  );
}
