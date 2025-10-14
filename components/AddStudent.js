"use client";

import { useState } from "react";

export default function AddStudent() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    firstNameFurigana: "",
    lastNameFurigana: "",
    birthday: "",
    address: "",
    school: "",
    schoolType: "ELEMENTARY",
    grade: "",
    gender: "UNSPECIFIED",
    color: "#000000",
  });

  const [status, setStatus] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/allStudents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to create student");

      setStatus("success");
      setFormData({
        firstName: "",
        lastName: "",
        firstNameFurigana: "",
        lastNameFurigana: "",
        birthday: "",
        address: "",
        school: "",
        schoolType: "ELEMENTARY",
        grade: "",
        gender: "UNSPECIFIED",
        color: "#000000",
      });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 p-4 bg-white rounded-lg shadow-md max-w-md"
    >
      <h2 className="text-lg font-semibold">新しい生徒を追加</h2>

      <div className="grid grid-cols-2 gap-2">
        <input
          name="firstName"
          placeholder="名"
          value={formData.firstName}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          name="lastName"
          placeholder="姓"
          value={formData.lastName}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          name="firstNameFurigana"
          placeholder="名（ふりがな）"
          value={formData.firstNameFurigana}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="lastNameFurigana"
          placeholder="姓（ふりがな）"
          value={formData.lastNameFurigana}
          onChange={handleChange}
          className="border p-2 rounded"
        />
      </div>

      <label className="block text-sm">生年月日</label>
      <input
        type="date"
        name="birthday"
        value={formData.birthday}
        onChange={handleChange}
        className="border p-2 rounded w-full"
        required
      />

      <input
        name="address"
        placeholder="住所"
        value={formData.address}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />

      <input
        name="school"
        placeholder="学校名"
        value={formData.school}
        onChange={handleChange}
        className="border p-2 rounded w-full"
        required
      />

      <div className="grid grid-cols-2 gap-2">
        <select
          name="schoolType"
          value={formData.schoolType}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="ELEMENTARY">小学校</option>
          <option value="MIDDLE">中学校</option>
          <option value="HIGH">高校</option>
          <option value="OTHER">その他</option>
        </select>

        <input
          name="grade"
          placeholder="学年"
          value={formData.grade}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
      </div>

      <select
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      >
        <option value="MALE">男</option>
        <option value="FEMALE">女</option>
        <option value="UNSPECIFIED">未指定</option>
      </select>

      <div>
        <label className="block text-sm mb-1">色タグ</label>
        <input
          type="color"
          name="color"
          value={formData.color}
          onChange={handleChange}
          className="w-16 h-8 cursor-pointer"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {status === "loading" ? "保存中…" : "生徒を追加"}
      </button>

      {status === "success" && (
        <p className="text-green-600 text-sm">生徒が正常に追加されました！</p>
      )}
      {status === "error" && (
        <p className="text-red-600 text-sm">生徒の追加に失敗しました。</p>
      )}
    </form>
  );
}
