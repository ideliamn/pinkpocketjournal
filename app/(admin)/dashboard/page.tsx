import { Pixelify_Sans } from "next/font/google";
import Link from "next/link";

const pixelify = Pixelify_Sans({
    subsets: ["latin"],
    weight: ["400"],
});

export default function Dashboard() {
    return (
        <main className="flex flex-col h-screen items-center justify-center bg-pink-100">
            <h1 className={`flex items-center justify-center ${pixelify.className} text-xl`}>
                dashboard
            </h1>
            <h1 className={`flex items-center justify-center ${pixelify.className} text-xl`}>
                🎀
            </h1>
        </main >
    );
}