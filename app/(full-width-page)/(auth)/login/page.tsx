"use client"
import { Geist_Mono, Pixelify_Sans } from "next/font/google";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "../../../components/common/Loading";
import ModalFailed from "../../../components/modals/ModalFailed";

const pixelify = Pixelify_Sans({
    subsets: ["latin"],
    weight: ["400"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-sono",
    subsets: ["latin"],
});

export default function Login() {
    const router = useRouter();
    const { signIn } = useAuth()
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [openModalFailed, setOpenModalFailed] = useState(false);
    const closeModalFailed = () => { setOpenModalFailed(false) };
    const [failedMessage, setFailedMessage] = useState<string>("");

    const handleLogin = async (e: React.FormEvent) => {
        console.log("login")
        setLoading(true);
        e.preventDefault();

        const { error } = await signIn(email, password)

        if (error) {
            setLoading(false);
            setFailedMessage(error.message ?? "Gagal login, silakan coba lagi");
            setOpenModalFailed(true);
        } else {
            router.push("/dashboard")
        }
    };

    return (
        <main className="flex flex-col h-screen items-center justify-center bg-pink-100 space-y-6">
            {loading && <Loading />}
            <div>
                <h1 className={`flex items-center justify-center ${pixelify.className} text-xl`}>
                    login
                </h1>
                <h1 className={`flex items-center justify-center ${pixelify.className} text-xl`}>
                    🎀
                </h1>
            </div>
            <div>
                <form onSubmit={handleLogin}>
                    <div className="gap-6 space-y-6">
                        <div className="space-y-2">
                            <div className="flex gap-4 items-center">
                                <div className={` ${geistMono.className} text-s w-[80px]`}>
                                    e-mail
                                </div>
                                <div className="flex-1">
                                    <Input name="email" type="text" placeholder="enter your e-mail..." className={`flex ${geistMono.className} text-s w-full`} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                            </div>
                            <div className="flex gap-4 items-center">
                                <div className={`flex ${geistMono.className} text-s w-[80px]`}>
                                    password
                                </div>
                                <div className="flex-1">
                                    <Input name="email" type={showPassword ? "text" : "password"} placeholder="enter your password..." className={`flex ${geistMono.className} text-s`} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                            </div>
                            <div className="flex gap-4 items-end justify-end">
                                <span
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute z-30 -translate-y-1/2 cursor-pointer top-1/2"
                                >
                                    {showPassword ? (
                                        // <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                                        <span className={`flex ${geistMono.className} text-xs hover:underline`}>hide password</span>
                                    ) : (
                                        // <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                                        <span className={`flex ${geistMono.className} text-xs hover:underline`}>show password</span>
                                    )}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <Button size="sm" variant="outline" className={`${geistMono.className} text-s cursor-pointer hover:underline hover:text-pink-600`}>
                                login
                            </Button>
                        </div>
                        <div className="flex gap-6 items-center justify-center">
                            <h1 className={`flex items-center justify-center ${pixelify.className} text-s underline cursor-pointer hover:text-pink-300 transition`}>
                                <Link href="/register">register</Link>
                            </h1>
                            <h1 className={`flex items-center justify-center ${pixelify.className} text-s underline cursor-pointer hover:text-pink-300 transition`}>
                                <Link href="/">back to home</Link>
                            </h1>
                        </div>
                    </div>
                </form>
            </div>
            {
                openModalFailed && (
                    <ModalFailed
                        isOpen={openModalFailed}
                        onClose={closeModalFailed}
                        message={failedMessage}
                        title="Gagal Login"
                    />
                )
            }
        </main >
    );
}