"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Loading from '@/components/Loading';
import { useUser } from "@/components/UserContext";

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
    <div className="flex flex-col w-full justify-center items-center">
      {/* Title and Button */}
      <div className="w-full max-w-lg flex mb-5 justify-around">
          <h2 className="text-2xl font-semibold">在スタッフ</h2>
          <Link
            href="/staff/addStaff"
            className="flex bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded items-center"
          >
            スタッフ追加
          </Link>
      </div>

      {/* Main Container */}
      <div className="flex w-full flex-col items-center">
        <div className="w-full max-w-lg border">
        {users.map((user) => (
            /* Single User */
            <div key={user.id} className="flex odd:bg-blue-100 px-1 py-3 border-b border-gray-300 last:border-b-0">
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
                <div className="flex flex-col px-1 w-1/2"><span className="text-gray-400 text-xs pb-[.5rem]">コード</span><span>{user.userCode}</span></div>
                <div className="flex flex-col px-1 w-1/2"><span className="text-gray-400 text-xs pb-[.5rem]">レベル</span><span>{user.access}</span></div>
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
    </div>
  );
}
