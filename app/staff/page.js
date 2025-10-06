"use client";
import { useState, useEffect } from "react";

export default function Staff() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/allUsers");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;

  return (
    <div>
    <h2>All Users</h2>
    <table className="min-w-full border border-gray-300">
        <thead>
        <tr className="bg-gray-100">
            <th className="px-4 py-2 border">姓</th>
            <th className="px-4 py-2 border">名</th>
            <th className="px-4 py-2 border">ユーザーコード</th>
            <th className="px-4 py-2 border">権限</th>
        </tr>
        </thead>
        <tbody>
        {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
            <td className="px-4 py-2 border"><ruby>{user.lastName}<rt>{user.lastNameFurigana}</rt></ruby></td>
            <td className="px-4 py-2 border"><ruby>{user.firstName}<rt>{user.firstNameFurigana}</rt></ruby></td>
            <td className="px-4 py-2 border">{user.userCode}</td>
            <td className="px-4 py-2 border">{user.access}</td>
            </tr>
        ))}
        </tbody>
    </table>
    </div>
  );
}
