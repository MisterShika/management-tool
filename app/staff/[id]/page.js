'use client';
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Loading from '@/components/Loading';

export default function UserPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const accessMap = {
    ADMIN: "管理者（ADMIN）",
    STAFF: "スタッフ（STAFF）",
  };

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`/api/allUsers/${id}`);
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data);
        setFormData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [id]);

  if (loading) return <Loading />;
  if (!user) return <p>ユーザーが見つかりません。</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!/^\d{4}$/.test(formData.pin)) {
      alert("PINコードは4桁の数字で入力してください。");
      return;
    }

    try {
      const res = await fetch(`/api/allUsers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to save user");
      const updated = await res.json();
      setUser(updated);
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert("更新に失敗しました。");
    }
  };

  const handleDelete = async () => {
    if (!confirm("このユーザーを削除（無効化）しますか？")) return;

    try {
      const res = await fetch(`/api/allUsers/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete user");
      alert("ユーザーを無効化しました。");
      router.push("/staff"); // ✅ redirect after delete
    } catch (err) {
      console.error(err);
      alert("削除に失敗しました。");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">スタッフ情報（ID: {user.id}）</h2>
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
        作成日: {new Date(user.createdAt).toLocaleString("ja-JP")}
      </p>

      <table className="min-w-full border border-gray-300">
        <tbody>
          {[
            { label: "ユーザーコード", name: "userCode" },
            { label: "姓", name: "lastName" },
            { label: "名", name: "firstName" },
            { label: "ふりがな（姓）", name: "lastNameFurigana" },
            { label: "ふりがな（名）", name: "firstNameFurigana" },
            { label: "PINコード", name: "pin" },
            { label: "アクセス権限", name: "access", options: accessMap },
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
                      {Object.entries(field.options).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name={field.name}
                      value={formData[field.name] ?? ""}
                      onChange={(e) => {
                        if (field.name === "pin") {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                          setFormData((prev) => ({ ...prev, pin: value }));
                        } else handleChange(e);
                      }}
                      className="border px-2 py-1 rounded w-full"
                    />
                  )
                ) : field.options ? (
                  field.options[user[field.name]] ?? "未設定"
                ) : (
                  user[field.name]
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
            onClick={() => {
              setEditing(false);
              setFormData(user);
            }}
          >
            キャンセル
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded"
            onClick={handleDelete}
          >
            削除
          </button>
        </div>
      )}
    </div>
  );
}
