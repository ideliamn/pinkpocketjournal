"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { swalError, swalSuccess } from "@/lib/swal";
import { swalConfirm } from "@/lib/swal";
import { apiFetch } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      swalError("Email dan password wajib diisi 😠");
      return;
    }

    setLoading(true);

    const result = await apiFetch("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });

    if (!result) {
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center px-4">

      {/* CONTAINER */}
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-6 items-center">

        {/* LEFT SIDE (DESKTOP ONLY) */}
        <div className="hidden md:flex flex-col justify-center px-10">
          <h1 className="text-4xl font-bold text-pink-500 mb-2">
            pinkpocket 💖
          </h1>
          <p className="text-gray-500 mb-6">
            Kelola keuanganmu <br />
            dengan lebih mudah & lembut ✨
          </p>

          {/* FAKE ILLUSTRATION */}
          <div className="bg-pink-100 rounded-2xl h-64 flex items-center justify-center text-pink-300">
            (illustration here 🎀)
          </div>
        </div>

        {/* RIGHT SIDE (FORM) */}
        <div className="w-full max-w-md mx-auto">

          {/* MOBILE HEADER */}
          <div className="text-center mb-6 md:hidden">
            <h1 className="text-2xl font-bold text-pink-500">
              pinkpocket 💖
            </h1>
          </div>

          <Card>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              className="space-y-4"
            >
              <h2 className="text-center font-semibold text-gray-700">
                Login ke akun kamu
              </h2>

              {/* EMAIL */}
              <div>
                <label className="text-sm text-gray-600 block mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="contoh@gmail.com"
                  value={email}
                  onChange={(e: any) => setEmail(e.target.value)}
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-sm text-gray-600 block mb-1">
                  Password
                </label>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e: any) => setPassword(e.target.value)}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* REMEMBER + FORGOT */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-500">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={() => setRemember(!remember)}
                  />
                  Ingat saya
                </label>

                <span className="text-pink-500 cursor-pointer">
                  Lupa password?
                </span>
              </div>

              {/* ERROR */}
              {error && (
                <p className="text-red-500 text-sm">
                  {error}
                </p>
              )}

              {/* BUTTON */}
              <Button type="submit">
                {loading ? "Loading..." : "Login"}
              </Button>
            </form>

            {/* FOOTER */}
            <p className="text-center text-sm text-gray-500 mt-4">
              Belum punya akun?{" "}
              <span
                onClick={() => router.push("/register")}
                className="text-pink-500 cursor-pointer"
              >
                Daftar di sini
              </span>
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}