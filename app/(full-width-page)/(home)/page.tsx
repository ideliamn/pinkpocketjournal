"use client"
import { Pixelify_Sans } from "next/font/google";
import Link from "next/link";
import { useEffect } from "react";
import { useProfile } from "../../context/ProfileContext";
import { useAuth } from "../../context/AuthContext";
import Loading from "../../components/common/Loading";
import { useRouter } from "next/navigation";

const pixelify = Pixelify_Sans({
    subsets: ["latin"],
    weight: ["400"],
});

export default function Home() {
    const router = useRouter();
    const { user, loading } = useAuth()
    const { profile } = useProfile();
    useEffect(() => {
        if (user && profile && !loading) {
            router.push("/dashboard")
        }
    }, [loading, user, profile, router])

    if (loading) {
        return <Loading />;
    }

    return (
        <main className="flex flex-col h-screen items-center justify-center">
            <h1 className={`flex items-center justify-center ${pixelify.className} text-xl`}>
                pink pocket journal
            </h1>
            <h1 className={`flex items-center justify-center ${pixelify.className} text-xl`}>
                🎀
            </h1>
            <div className="flex gap-6">
                <h1 className={`flex items-center justify-center ${pixelify.className} text-xl underline cursor-pointer hover:text-pink-600 transition`}>
                    <Link href="/login">login</Link>
                </h1>
                <h1 className={`flex items-center justify-center ${pixelify.className} text-xl underline cursor-pointer hover:text-pink-600 transition`}>
                    <Link href="/register">register</Link>
                </h1>
            </div>
        </main >
    );
}