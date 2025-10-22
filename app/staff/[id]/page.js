'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Loading from '@/components/Loading';
import MenuButton from '@/components/MenuButton';

export default function StaffDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/allUsers/${id}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setUser(data);
        setEditUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Validate PIN
      if (!/^\d{4}$/.test(editUser.pin)) {
        alert('PINコードは4桁の数字で入力してください。');
        setIsSaving(false);
        return;
      }

      const res = await fetch(`/api/allUsers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editUser),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const updatedUser = await res.json();

      setUser(updatedUser);
      setEditUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      alert(`更新に失敗しました: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading />
      </div>
    );
  }

  if (error) return <div className="text-red-500 text-center">Error: {error}</div>;
  if (!user) return <div className="text-center text-gray-500">ユーザーが見つかりません。</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">スタッフ詳細（ID: {user.id}）</h1>
        <div className="flex gap-2">
          <MenuButton link="/staff" buttonTitle="一覧に戻る" />
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              編集
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50"
              >
                {isSaving ? '保存中...' : '保存'}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditUser(user);
                }}
                className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
              >
                キャンセル
              </button>
              <button
                onClick={async () => {
                  if (!confirm('本当にこのスタッフを削除しますか？')) return;
                  try {
                    const res = await fetch(`/api/allUsers/${id}`, {
                      method: 'DELETE',
                    });
                    if (!res.ok) throw new Error('削除に失敗しました');
                    alert('スタッフを削除しました');
                    router.push('/staff');
                  } catch (err) {
                    alert(err.message);
                  }
                }}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                削除
              </button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* ユーザーコード */}
        <div>
          <label className="block text-sm font-medium mb-1">ユーザーコード</label>
          {isEditing ? (
            <input
              type="text"
              name="userCode"
              value={editUser.userCode}
              onChange={handleChange}
              maxLength={4}
              className="border rounded px-3 py-1 w-full"
            />
          ) : (
            <p className="px-1">{user.userCode}</p>
          )}
        </div>

        {/* 氏名 */}
        <div>
          <label className="block text-sm font-medium mb-1">氏名（姓・名）</label>
          {isEditing ? (
            <div className="flex gap-2">
              <input
                type="text"
                name="lastName"
                value={editUser.lastName}
                onChange={handleChange}
                className="border rounded px-3 py-1 w-1/2"
              />
              <input
                type="text"
                name="firstName"
                value={editUser.firstName}
                onChange={handleChange}
                className="border rounded px-3 py-1 w-1/2"
              />
            </div>
          ) : (
            <p className="px-1">
              {user.lastName} {user.firstName}
            </p>
          )}
        </div>

        {/* ふりがな */}
        <div>
          <label className="block text-sm font-medium mb-1">ふりがな</label>
          {isEditing ? (
            <div className="flex gap-2">
              <input
                type="text"
                name="lastNameFurigana"
                value={editUser.lastNameFurigana}
                onChange={handleChange}
                className="border rounded px-3 py-1 w-1/2"
              />
              <input
                type="text"
                name="firstNameFurigana"
                value={editUser.firstNameFurigana}
                onChange={handleChange}
                className="border rounded px-3 py-1 w-1/2"
              />
            </div>
          ) : (
            <p className="px-1">
              {user.lastNameFurigana} {user.firstNameFurigana}
            </p>
          )}
        </div>

        {/* PINコード */}
        <div>
          <label className="block text-sm font-medium mb-1">PINコード</label>
          {isEditing ? (
            <input
              type="text"
              name="pin"
              value={editUser.pin}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                setEditUser((prev) => ({ ...prev, pin: value }));
              }}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              className="border rounded px-3 py-1 w-full"
            />
          ) : (
            <p className="px-1">{user.pin}</p>
          )}
        </div>

        {/* アクセス権限 */}
        <div>
          <label className="block text-sm font-medium mb-1">アクセス権限</label>
          {isEditing ? (
            <select
              className="border rounded px-3 py-1 w-full"
              value={editUser.access}
              onChange={(e) => setEditUser({ ...editUser, access: e.target.value })}
            >
              <option value="ADMIN">管理者（ADMIN）</option>
              <option value="STAFF">スタッフ（STAFF）</option>
            </select>
          ) : (
            <p className="px-1">
              {user.access === 'ADMIN' ? '管理者（ADMIN）' : 'スタッフ（STAFF）'}
            </p>
          )}
        </div>

        {/* 作成日 */}
        <div>
          <label className="block text-sm font-medium mb-1">作成日</label>
          <p className="px-1">{new Date(user.createdAt).toLocaleDateString('ja-JP')}</p>
        </div>
      </div>
    </div>
  );
}
