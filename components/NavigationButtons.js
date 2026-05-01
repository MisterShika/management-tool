'use client';

import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  const canGoBack = typeof window !== "undefined" && window.history.length > 1;

  return (
    <>
      {canGoBack && (
        <button 
        className="px-3 py-1 bg-gray-400 text-white rounded mb-4 cursor-pointer"
        onClick={() => router.back()}>
          戻す
        </button>
      )}
    </>
  );
}