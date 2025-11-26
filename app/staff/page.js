"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Loading from '@/components/Loading';
import { useUser } from "@/components/UserContext";
import MenuButton from '@/components/MenuButton';

export default function Staff() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useUser();

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

  if (loading) return <Loading />;
  if (user?.access !== "ADMIN") return <div><h2>アクセスが拒否されました</h2></div>;

  return (
    <div className="w-full justify-center">
      {/* Title and Button */}
      <div className="flex justify-center items-center mb-4">
        <h2 className="text-xl font-semibold">スタッフ一覧</h2>
        <MenuButton link="/staff/addStaff" buttonTitle="スタッフ追加" />
      </div>

      {/* Main Container */}
      <div className="flex w-full flex-col items-center">
        <div className="w-full max-w-lg">
        {users.map((user) => (
            <div key={user.id} className="flex odd:bg-blue-100 px-1 py-3">
              {/* Name Container */}
              <div className="flex w-[50%]">
                <div className="flex flex-col px-1 w-1/2">
                  <span className="text-gray-400 text-xs">姓</span><span><ruby>{user.lastName}<rt>{user.lastNameFurigana}</rt></ruby></span>
                </div>
                <div className="flex flex-col px-1 w-1/2">
                  <span className="text-gray-400 text-xs">名</span><span><ruby>{user.firstName}<rt>{user.firstNameFurigana}</rt></ruby></span>
                </div>
              </div>
              {/* Data Container */}
              <div className="flex w-[30%]">
                <div className="flex flex-col px-1 w-1/2"><span className="text-gray-400 text-xs">コード</span><span>{user.userCode}</span></div>
                <div className="flex flex-col px-1 w-1/2"><span className="text-gray-400 text-xs">レベル</span><span>{user.access}</span></div>
              </div>
              {/* Edit Container */}
              <div className="flex w-[20%] justify-center items-center">
                <Link
                  href={`/staff/${user.id}`}
                  className="flex bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded items-center"
                >
                  詳細
                </Link>
              </div>
            </div>
          ))}
          </div>
      </div>




      {/* <table className="min-w-full border border-gray-300 bg-white rounded-lg shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">姓</th>
            <th className="px-4 py-2 border">名</th>
            <th className="px-4 py-2 border">ユーザーコード</th>
            <th className="px-4 py-2 border">権限</th>
            <th className="px-4 py-2 border text-center">操作</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">
                <ruby>{user.lastName}<rt>{user.lastNameFurigana}</rt></ruby>
              </td>
              <td className="px-4 py-2 border">
                <ruby>{user.firstName}<rt>{user.firstNameFurigana}</rt></ruby>
              </td>
              <td className="px-4 py-2 border">{user.userCode}</td>
              <td className="px-4 py-2 border">{user.access}</td>
              <td className="px-4 py-2 border text-center">
                <Link
                  href={`/staff/${user.id}`}
                  className="inline-block bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded"
                >
                  詳細
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  );
}
