"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditStudentPage() {
  const params = useParams();
  const studentId = params.id;
  const router = useRouter();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});

  const genderOptions = ["MALE", "FEMALE", "UNSPECIFIED"];
  const schoolTypeOptions = ["ELEMENTARY", "MIDDLE", "HIGH", "OTHER"];

  const genderMap = { MALE: "男", FEMALE: "女", UNSPECIFIED: "未設定" };
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
        setFormData({
          firstName: data.firstName,
          lastName: data.lastName,
          firstNameFurigana: data.firstNameFurigana,
          lastNameFurigana: data.lastNameFurigana,
          birthday: data.birthday.split("T")[0], // yyyy-mm-dd for input
          address: data.address,
          school: data.school,
          grade: data.grade,
          gender: data.gender ?? "UNSPECIFIED",
          schoolType: data.schoolType ?? "OTHER",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchStudent();
  }, [studentId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/updateStudent", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: studentId, ...formData }),
      });
      if (!res.ok) throw new Error("Failed to save");
      const updated = await res.json();
      alert("保存しました！");
      router.push(`/student/${studentId}`); // go back to detail page
    } catch (err) {
      console.error(err);
      alert("更新に失敗しました。");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading student...</p>;
  if (!student) return <p>Student not found.</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">生徒情報編集</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">姓</label>
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full border px-2 py-1"
          />
        </div>
        <div>
          <label className="block mb-1">名</label>
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full border px-2 py-1"
          />
        </div>
        <div>
          <label className="block mb-1">姓（ふりがな）</label>
          <input
            name="lastNameFurigana"
            value={formData.lastNameFurigana}
            onChange={handleChange}
            className="w-full border px-2 py-1"
          />
        </div>
        <div>
          <label className="block mb-1">名（ふりがな）</label>
          <input
            name="firstNameFurigana"
            value={formData.firstNameFurigana}
            onChange={handleChange}
            className="w-full border px-2 py-1"
          />
        </div>
        <div>
          <label className="block mb-1">生年月日</label>
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            className="w-full border px-2 py-1"
          />
        </div>
        <div>
          <label className="block mb-1">住所</label>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border px-2 py-1"
          />
        </div>
        <div>
          <label className="block mb-1">学校</label>
          <input
            name="school"
            value={formData.school}
            onChange={handleChange}
            className="w-full border px-2 py-1"
          />
        </div>
        <div>
          <label className="block mb-1">学校種別</label>
          <select
            name="schoolType"
            value={formData.schoolType}
            onChange={handleChange}
            className="w-full border px-2 py-1"
          >
            {schoolTypeOptions.map((type) => (
              <option key={type} value={type}>
                {schoolTypeMap[type]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">学年</label>
          <input
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            className="w-full border px-2 py-1"
          />
        </div>
        <div>
          <label className="block mb-1">性別</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border px-2 py-1"
          >
            {genderOptions.map((g) => (
              <option key={g} value={g}>
                {genderMap[g]}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          disabled={saving}
        >
          {saving ? "保存中..." : "保存"}
        </button>
      </form>
    </div>
  );
}
