"use client";

import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    window.location.href = "/login";
  };

  return (
    <header className="bg-white border-b px-4 md:px-6 py-3 flex items-center justify-between">
      {/* LEFT */}
      <h1 className="font-semibold text-gray-700">
        Dashboard
      </h1>

      {/* RIGHT */}
      <div className="flex items-center gap-4 relative">
        {/* NOTIFICATION */}
        <button className="relative cursor-pointer">
          🔔
          <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] px-1 rounded-full">
            3
          </span>
        </button>

        {/* PROFILE */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="cursor-pointer flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-full bg-pink-300 flex items-center justify-center text-white">
              I
            </div>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-pink-50 cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}