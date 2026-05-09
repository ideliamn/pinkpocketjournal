"use client";

import { Bell, UserCircle2, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Props {
  user?: {
    name?: string;
  };
}

export default function Header({
  user,
}: Props) {
  const [openProfile, setOpenProfile] = useState(false);
  const desktopProfileRef = useRef<HTMLDivElement>(null);
  const mobileProfileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent
    ) {
      const target = event.target as Node;
      const clickedDesktop = desktopProfileRef.current?.contains(target);
      const clickedMobile = mobileProfileRef.current?.contains(target);

      if (!clickedDesktop && !clickedMobile) {
        setOpenProfile(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });

      window.location.href = "/login";
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* MOBILE HEADER */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-[60] h-16 bg-[#fff7fb]/85 backdrop-blur-xl border-b border-pink-100">
        <div className="h-full px-4 flex items-center justify-between">
          {/* LOGO */}
          <h1
            className="
              text-lg
              font-black
              tracking-tight
              text-pink-500
            "
          >
            PinkPocketJournal
          </h1>

          {/* ACTION */}
          <div className="flex items-center gap-3">
            {/* NOTIF */}
            <button
              className="
                w-10
                h-10

                rounded-2xl

                bg-white

                border
                border-pink-100

                flex
                items-center
                justify-center

                hover:bg-pink-50

                transition
                cursor-pointer
              "
            >
              <Bell
                size={18}
                className="text-gray-700"
              />
            </button>

            {/* PROFILE */}
            <div
              className="relative"
              ref={mobileProfileRef}
            >
              <button
                onClick={() =>
                  setOpenProfile(
                    !openProfile
                  )
                }
                className="
                  w-10
                  h-10

                  rounded-2xl

                  bg-white

                  border
                  border-pink-100

                  flex
                  items-center
                  justify-center

                  hover:bg-pink-50

                  transition
                  cursor-pointer
                "
              >
                <UserCircle2
                  size={20}
                  className="text-pink-500"
                />
              </button>

              {/* DROPDOWN */}
              <div
                className={`
                  absolute
                  right-0
                  top-12
                  z-[9999]

                  w-48

                  rounded-3xl

                  border
                  border-pink-100

                  bg-white

                  shadow-xl
                  overflow-hidden

                  transition-all
                  duration-300

                  ${openProfile
                    ? `
                        opacity-100
                        translate-y-0
                        pointer-events-auto
                      `
                    : `
                        opacity-0
                        -translate-y-2
                        pointer-events-none
                      `
                  }
                `}
              >
                <div
                  className="
                    px-4
                    py-3

                    border-b
                    border-pink-50
                  "
                >
                  <p className="font-semibold text-gray-800">
                    {user?.name ||
                      "Pink User"}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Logged in
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="
                    w-full

                    px-4
                    py-3

                    flex
                    items-center
                    gap-3

                    text-sm
                    text-red-500

                    hover:bg-red-50

                    transition
                    cursor-pointer
                  "
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* DESKTOP HEADER */}
      <header
        className="
          hidden
          lg:block

          sticky
          top-0
          z-30

          bg-[#fff7fb]/80
          backdrop-blur

          border-b
          border-pink-100
        "
      >
        <div
          className="
            h-20
            px-6

            flex
            items-center
            justify-between
          "
        >
          {/* TEXT */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {user?.name ? `Hi, ${user?.name} ✨` : ""}
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Let's track your money today 💖
            </p>
          </div>

          {/* ACTION */}
          <div className="flex items-center gap-3">
            {/* NOTIF */}
            <button
              className="
                w-11
                h-11

                rounded-2xl

                bg-white

                border
                border-pink-100

                flex
                items-center
                justify-center

                hover:bg-pink-50

                transition
                cursor-pointer
              "
            >
              <Bell
                size={20}
                className="text-gray-700"
              />
            </button>

            {/* PROFILE */}
            <div
              className="relative"
              ref={desktopProfileRef}
            >
              <button
                onClick={() =>
                  setOpenProfile(
                    !openProfile
                  )
                }
                className="
                  w-11
                  h-11

                  rounded-2xl

                  bg-white

                  border
                  border-pink-100

                  flex
                  items-center
                  justify-center

                  hover:bg-pink-50

                  transition
                  cursor-pointer
                "
              >
                <UserCircle2
                  size={22}
                  className="text-pink-500"
                />
              </button>

              {/* DROPDOWN */}
              <div
                className={`
                  absolute
                  right-0
                  top-14
                  z-[9999]

                  w-52

                  rounded-3xl

                  border
                  border-pink-100

                  bg-white

                  shadow-xl
                  overflow-hidden

                  transition-all
                  duration-300

                  ${openProfile
                    ? `
                        opacity-100
                        translate-y-0
                        pointer-events-auto
                      `
                    : `
                        opacity-0
                        -translate-y-2
                        pointer-events-none
                      `
                  }
                `}
              >
                <div
                  className="
                    px-4
                    py-3

                    border-b
                    border-pink-50
                  "
                >
                  <p className="font-semibold text-gray-800">
                    {user?.name ||
                      "Pink User"}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Logged in
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="
                    w-full

                    px-4
                    py-3

                    flex
                    items-center
                    gap-3

                    text-sm
                    text-red-500

                    hover:bg-red-50

                    transition
                    cursor-pointer
                  "
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}