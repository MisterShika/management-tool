"use client";

export default function ConnectReport({ onClose }) {
  return (
    // Clicking the semi-transparent background closes the modal
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={onClose} // handle background click
    >
      <div
        className="bg-white pt-0 pb-6 px-2 rounded-lg shadow-lg text-center max-w-md w-full"
        onClick={(e) => e.stopPropagation()} // prevent modal content clicks from closing
      >
        <div className="flex flex-row-reverse">
          <button
            className="mt-2 p-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose} // also close with button
          >
          ✖
          </button>
        </div>
        <h2 className="text-xl font-bold mb-4">レポートを追加</h2>
        <p>モーダルが表示されています。</p>
      </div>
    </div>
  );
}
