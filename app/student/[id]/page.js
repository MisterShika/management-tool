'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loading from '@/components/Loading';

export default function StudentPage() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const genderMap = {
    MALE: "男",
    FEMALE: "女",
    UNSPECIFIED: "未設定",
  };

  // const schoolTypeMap = {
  //   ELEMENTARY: "小学校",
  //   MIDDLE: "中学校",
  //   HIGH: "高校",
  //   OTHER: "その他",
  // };

  useEffect(() => {
    async function fetchStudent() {
      try {
        const res = await fetch(`/api/allStudents/${id}`);
        if (!res.ok) throw new Error("Failed to fetch student");
        const data = await res.json();
        setStudent(data);
        setFormData({
          ...data,
          birthday: data.birthday ? new Date(data.birthday).toISOString().substring(0, 10) : '',
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchStudent();
  }, [id]);

  if (loading) return <Loading />;
  if (!student) return <p>Student not found.</p>;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/allStudents/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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

  const handleDelete = async () => {
    if (!confirm("本当にこの生徒を削除しますか？")) return;
    try {
      const res = await fetch(`/api/allStudents/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete student");
      alert("生徒を削除しました。");
      window.location.href = "/students"; // Redirect after deletion
    } catch (err) {
      console.error(err);
      alert("削除に失敗しました。");
    }
  };

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
            // { label: "学校", name: "school" },
            // { label: "学校種別", name: "schoolType", options: schoolTypeMap },
            { label: "学年", name: "grade" },
            { label: "性別", name: "gender", options: genderMap },
            { label: "アクティブ", name: "isActive", type: "checkbox" },
            { label: "色", name: "color", type: "color" },
          ].map((field) => (
            <tr key={field.name}>
              <th className="px-4 py-2 border text-left bg-gray-50">{field.label}</th>
              <td className="px-4 py-2 border">
                {editing ? (
                  field.options ? (
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
                  ) : field.type === "checkbox" ? (
                    <input
                      type="checkbox"
                      name={field.name}
                      checked={formData[field.name]}
                      onChange={handleChange}
                    />
                  ) : (
                    <input
                      type={field.type || "text"}
                      name={field.name}
                      value={formData[field.name] ?? ""}
                      onChange={handleChange}
                      className="border px-2 py-1 rounded w-full"
                    />
                  )
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
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
