"use client";

import { Geist_Mono, Pixelify_Sans } from "next/font/google";
import { Modal } from ".";

interface FormModalProps {
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
}

const pixelify = Pixelify_Sans({
    subsets: ["latin"],
    weight: ["400"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-sono",
    subsets: ["latin"],
    weight: ["600"]
});

export default function FormModal({
    children,
    isOpen,
    onClose,
    title,
    message,
}: FormModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] p-10">
            <div className="text-center">
                <h4 className={`mb-2 text-2xl font-semibold ${pixelify.className} py-2`} >
                    {title}
                </h4>
                {children}
                <p className={`text-gray-600 dark:text-gray-400 ${geistMono.className}`}>{message}</p>
            </div>
        </Modal >
    )
}