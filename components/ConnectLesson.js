"use client";

export default function ConnectLesson({ onClose }) {
  return (
    // Clicking the semi-transparent background closes the modal
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={onClose} // handle background click
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full"
        onClick={(e) => e.stopPropagation()} // prevent modal content clicks from closing
      >
        <h2 className="text-xl font-bold mb-4">授業を追加</h2>
        <p>モーダルが表示されています。</p>
        <button
          className="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          onClick={onClose} // also close with button
        >
          閉じる
        </button>
      </div>
    </div>
  );
}
