"use client"
import { Geist_Mono, Pixelify_Sans } from "next/font/google";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "../../../components/common/Loading";
import SimpleModal from "../../../components/modals/SimpleModal";

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
        <main className="flex flex-col h-screen items-center justify-center space-y-6">
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
                                <div className="flex-1 relative">
                                    <Input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="enter your password..."
                                        className={`flex ${geistMono.className} text-s pr-10`}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <span
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#FFC0CB]"
                                    >
                                        {showPassword ? (
                                            <svg width={20} height={20} id="user-solid" className="flex h-full w-full px-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="16" y="11" width="1" height="2" /><polygon points="16 13 16 15 15 15 15 16 13 16 13 15 14 15 14 14 15 14 15 13 16 13" /><polygon points="16 9 16 11 15 11 15 10 14 10 14 9 13 9 13 8 15 8 15 9 16 9" /><rect x="11" y="16" width="2" height="1" /><polygon points="11 15 11 16 9 16 9 15 8 15 8 13 9 13 9 14 10 14 10 15 11 15" /><polygon points="13 7 13 8 12 8 12 11 11 11 11 12 8 12 8 13 7 13 7 11 8 11 8 9 9 9 9 8 11 8 11 7 13 7" /><path d="m22,11v-2h-1v-1h-1v-1h-1v-1h-2v-1H7v1h-2v1h-1v1h-1v1h-1v2h-1v2h1v2h1v1h1v1h1v1h2v1h10v-1h2v-1h1v-1h1v-1h1v-2h1v-2h-1Zm-1,3h-1v1h-1v1h-1v1h-2v1h-8v-1h-1v-1h-2v-1h-1v-1h-1v-4h1v-1h1v-1h1v-1h2v-1h8v1h2v1h1v1h1v1h1v4Z" /></svg>
                                        ) : (
                                            <svg width={20} height={20} id="eye-cross" className="flex h-full w-full px-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="15 13 16 13 16 15 15 15 15 16 13 16 13 15 14 15 14 14 15 14 15 13" /><rect x="16" y="11" width="1" height="2" /><polygon points="23 11 23 13 22 13 22 15 21 15 21 16 20 16 20 17 19 17 19 18 17 18 17 19 9 19 9 18 16 18 16 17 18 17 18 16 19 16 19 15 20 15 20 14 21 14 21 10 20 10 20 9 19 9 19 8 21 8 21 9 22 9 22 11 23 11" /><polygon points="2 13 1 13 1 11 2 11 2 9 3 9 3 8 4 8 4 7 5 7 5 6 7 6 7 5 15 5 15 6 8 6 8 7 6 7 6 8 5 8 5 9 4 9 4 10 3 10 3 14 4 14 4 15 5 15 5 16 3 16 3 15 2 15 2 13" /><polygon points="13 7 13 8 12 8 12 9 11 9 11 10 10 10 10 11 9 11 9 12 8 12 8 13 7 13 7 11 8 11 8 9 9 9 9 8 11 8 11 7 13 7" /><polygon points="9 17 8 17 8 18 7 18 7 19 6 19 6 20 5 20 5 21 4 21 4 22 3 22 3 21 2 21 2 20 3 20 3 19 4 19 4 18 5 18 5 17 6 17 6 16 7 16 7 15 8 15 8 14 9 14 9 13 10 13 10 12 11 12 11 11 12 11 12 10 13 10 13 9 14 9 14 8 15 8 15 7 16 7 16 6 17 6 17 5 18 5 18 4 19 4 19 3 20 3 20 2 21 2 21 3 22 3 22 4 21 4 21 5 20 5 20 6 19 6 19 7 18 7 18 8 17 8 17 9 16 9 16 10 15 10 15 11 14 11 14 12 13 12 13 13 12 13 12 14 11 14 11 15 10 15 10 16 9 16 9 17" /><rect x="11" y="16" width="2" height="1" /></svg>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <Button type="submit" size="sm" variant="outline" className={`${geistMono.className} text-s cursor-pointer hover:underline hover:text-pink-600`}>
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
            </div >
            {
                openModalFailed && (
                    <SimpleModal
                        type={"failed"}
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