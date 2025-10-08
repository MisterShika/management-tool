"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    setLoading(true); // start spinner
    await fetch("/api/logout", { method: "POST" });

    // reload the page so AuthWrapper re-fetches user
    window.location.reload();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading} // prevent multiple clicks
      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded flex items-center justify-center focus:outline-none focus:shadow-outline"
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5 text-white mr-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3 3 3h-4z"
          ></path>
        </svg>
      )}
      {loading ? "ログアウト中..." : "ログアウト"}
    </button>
  );
}
