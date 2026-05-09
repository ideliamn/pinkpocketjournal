"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import SessionExpiredModal from "@/components/layout/session-expired-modal";

export default function SessionChecker() {
  const router = useRouter();

  const [expired, setExpired] = useState(false);

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/user/me");

        if (!res.ok) {
          setExpired(true);

          setTimeout(() => {
            router.replace("/login");
          }, 1800);
        }
      } catch {
        setExpired(true);

        setTimeout(() => {
          router.replace("/login");
        }, 1800);
      }
    }

    checkSession();

    const interval = setInterval(() => {
      checkSession();
    }, 60000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <SessionExpiredModal
      open={expired}
    />
  );
}