"use client";

interface Props {
  open: boolean;
}

export default function SessionExpiredModal({
  open,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-[999]
        bg-black/40
        backdrop-blur-sm
        flex
        items-center
        justify-center
        px-5
      "
    >
      <div
        className="
          w-full
          max-w-sm
          rounded-3xl
          bg-white
          p-6
          shadow-2xl
          animate-in
          fade-in
          zoom-in-95
          duration-300
        "
      >
        <h2 className="text-xl font-bold text-gray-800">
          Session Expired
        </h2>

        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
          Your login session has ended.
          Please login again to continue.
        </p>

        <div className="mt-5">
          <div
            className="
              w-full
              h-11
              rounded-2xl
              bg-pink-500
              text-white
              flex
              items-center
              justify-center
              font-semibold
            "
          >
            Redirecting to login...
          </div>
        </div>
      </div>
    </div>
  );
}