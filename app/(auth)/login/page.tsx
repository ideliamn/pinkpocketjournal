"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email dan password wajib diisi 😠");
      return;
    }

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email atau password salah 😢");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
      <div className="w-full max-w-md">
        <Card>
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">
              pinkpocket 💖
            </h1>
            <p className="text-sm text-gray-500">
              Catat keuanganmu dengan santai ✨
            </p>
          </div>

          <div className="space-y-3">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-3">
              {error}
            </p>
          )}

          <Button
            className="mt-6"
            onClick={handleLogin}
          >
            {loading ? "Loading..." : "Login 💖"}
          </Button>

          <p className="text-sm text-center text-gray-500 mt-4">
            Belum punya akun?{" "}
            <span
              className="text-pink-500 cursor-pointer"
              onClick={() => router.push("/register")}
            >
              Daftar
            </span>
          </p>
        </Card>
      </div>
    </div>
  );
}