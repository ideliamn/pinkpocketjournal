"use client";

export function Modal({ open, onClose, children }: any) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
        <button
          className="absolute right-4 top-4 text-gray-400"
          onClick={onClose}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}