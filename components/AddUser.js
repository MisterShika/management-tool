"use client";

import { useState } from "react";

export default function AddUser() {
  const [form, setForm] = useState({
    userCode: "",
    firstName: "",
    lastName: "",
    firstNameFurigana: "",
    lastNameFurigana: "",
    pin: "",
    access: "STAFF",
  });

  const [status, setStatus] = useState({ loading: false, message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Force uppercase for userCode and pin
    let newValue = value;
    if (name === "userCode") {
      // Only allow alphanumeric characters and uppercase
      newValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    } else if (name === "pin") {
      newValue = value.toUpperCase();
    }

    setForm((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: "" });

    try {
      const res = await fetch("/api/allUsers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to create user");

      setStatus({ loading: false, message: "✅ User added successfully!" });
      setForm({
        userCode: "",
        firstName: "",
        lastName: "",
        firstNameFurigana: "",
        lastNameFurigana: "",
        pin: "",
        access: "STAFF",
      });
    } catch (err) {
      setStatus({ loading: false, message: `❌ ${err.message}` });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md mx-auto space-y-4"
    >
      <h2 className="text-lg font-semibold mb-2">新しいユーザーを追加</h2>

      <div className="grid grid-cols-2 gap-3">
        <input
          name="userCode"
          value={form.userCode}
          onChange={handleChange}
          placeholder="コード (英数字4文字)"
          className="border p-2 rounded-md uppercase"
          maxLength={4}
          required
        />
        <input
          name="pin"
          value={form.pin}
          onChange={handleChange}
          placeholder="4桁の暗証番号"
          className="border p-2 rounded-md uppercase"
          maxLength={4}
          required
        />
        <input
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder="姓"
          className="border p-2 rounded-md col-span-1"
          required
        />
        <input
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder="名"
          className="border p-2 rounded-md col-span-1"
          required
        />
        <input
          name="lastNameFurigana"
          value={form.lastNameFurigana}
          onChange={handleChange}
          placeholder="ふりがな（姓）"
          className="border p-2 rounded-md col-span-1"
          required
        />
        <input
          name="firstNameFurigana"
          value={form.firstNameFurigana}
          onChange={handleChange}
          placeholder="ふりがな（名）"
          className="border p-2 rounded-md col-span-1"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">アクセス権限</label>
        <select
          name="access"
          value={form.access}
          onChange={handleChange}
          className="border p-2 rounded-md w-full"
        >
          <option value="STAFF">Staff</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={status.loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {status.loading ? "追加中..." : "ユーザー追加"}
      </button>

      {status.message && (
        <p
          className={`text-sm text-center ${
            status.message.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {status.message}
        </p>
      )}
    </form>
  );
}
