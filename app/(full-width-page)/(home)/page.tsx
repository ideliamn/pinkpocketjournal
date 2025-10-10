import { Pixelify_Sans } from "next/font/google";
import Link from "next/link";

const pixelify = Pixelify_Sans({
    subsets: ["latin"],
    weight: ["400"],
});

export default function Home() {
    return (
        <main className="flex flex-col h-screen items-center justify-center bg-pink-100">
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