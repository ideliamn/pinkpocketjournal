"use client"
import { Geist_Mono, Pixelify_Sans } from "next/font/google";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";

const pixelify = Pixelify_Sans({
    subsets: ["latin"],
    weight: ["400"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-sono",
    subsets: ["latin"],
});

export default function Login() {
    return (
        <main className="flex flex-col h-screen items-center justify-center bg-pink-100 space-y-6">
            <div>
                <h1 className={`flex items-center justify-center ${pixelify.className} text-xl`}>
                    login
                </h1>
                <h1 className={`flex items-center justify-center ${pixelify.className} text-xl`}>
                    🎀
                </h1>
            </div>
            <div>
                <div className="gap-6 space-y-6">
                    <div className="space-y-2">
                        <div className="flex gap-4 items-center">
                            <div className={` ${geistMono.className} text-s w-[80px]`}>
                                e-mail
                            </div>
                            <div className="flex-1">
                                <Input name="email" type="text" placeholder="enter your e-mail..." className={`flex ${geistMono.className} text-s w-full`} onChange={() => { console.log("email") }} />
                            </div>
                        </div>
                        <div className="flex gap-4 items-center">
                            <div className={`flex ${geistMono.className} text-s w-[80px]`}>
                                password
                            </div>
                            <div className="flex-1">
                                <Input name="email" type="text" placeholder="enter your password..." className={`flex ${geistMono.className} text-s`} onChange={() => { console.log("password") }} />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                        <Button size="sm" variant="outline" className={`${geistMono.className} text-s`} onClick={() => { console.log("login") }}>
                            login
                        </Button>
                    </div>
                    <div className="flex gap-6 items-center justify-center">
                        <h1 className={`flex items-center justify-center ${pixelify.className} text-s underline cursor-pointer hover:text-pink-300 transition`}>
                            register
                        </h1>
                        <h1 className={`flex items-center justify-center ${pixelify.className} text-s underline cursor-pointer hover:text-pink-300 transition`}>
                            back to home
                        </h1>
                    </div>
                </div>
            </div>
        </main >
    );
}