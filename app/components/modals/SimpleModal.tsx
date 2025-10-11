"use client";

import { Geist_Mono, Pixelify_Sans } from "next/font/google";
import { Modal } from ".";

interface ModalSuccessProps {
    type: "success" | "failed" | "info" | "warning"; // success / failed / info / warning
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

const svgIconTitle = {
    success: "m22,9v-2h-1v-2h-1v-1h-1v-1h-2v-1h-2v-1h-6v1h-2v1h-2v1h-1v1h-1v2h-1v2h-1v6h1v2h1v2h1v1h1v1h2v1h2v1h6v-1h2v-1h2v-1h1v-1h1v-2h1v-2h1v-6h-1Zm-4,3h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-2v-1h-1v-1h-1v-1h-1v-1h-1v-2h1v-1h2v1h1v1h2v-1h1v-1h1v-1h1v-1h1v-1h2v1h1v2h-1v1Z",
    failed: "m22,9v-2h-1v-2h-1v-1h-1v-1h-2v-1h-2v-1h-6v1h-2v1h-2v1h-1v1h-1v2h-1v2h-1v6h1v2h1v2h1v1h1v1h2v1h2v1h6v-1h2v-1h2v-1h1v-1h1v-2h1v-2h1v-6h-1Zm-8,7v-1h-1v-1h-2v1h-1v1h-1v1h-1v-1h-1v-1h1v-1h1v-1h1v-2h-1v-1h-1v-1h-1v-1h1v-1h1v1h1v1h1v1h2v-1h1v-1h1v-1h1v1h1v1h-1v1h-1v1h-1v2h1v1h1v1h1v1h-1v1h-1v-1h-1Z",
    info: "m22,9v-2h-1v-2h-1v-1h-1v-1h-2v-1h-2v-1h-6v1h-2v1h-2v1h-1v1h-1v2h-1v2h-1v6h1v2h1v2h1v1h1v1h2v1h2v1h6v-1h2v-1h2v-1h1v-1h1v-2h1v-2h1v-6h-1Zm-11-3h2v2h-2v-2Zm-1,9h1v-5h-1v-1h3v6h1v2h-4v-2Z",
    warning: "m22,20v-2h-1v-2h-1v-2h-1v-2h-1v-2h-1v-2h-1v-2h-1v-2h-1v-2h-1v-1h-2v1h-1v2h-1v2h-1v2h-1v2h-1v2h-1v2h-1v2h-1v2h-1v2h-1v2h1v1h20v-1h1v-2h-1Zm-19,1v-1h1v-2h1v-2h1v-2h1v-2h1v-2h1v-2h1v-2h1v-2h2v2h1v2h1v2h1v2h1v2h1v2h1v2h1v2h1v1H3Z"
}

export default function SimpleModal({
    type,
    isOpen,
    onClose,
    title = type == "info" ? type : type + "!",
    message,
}: ModalSuccessProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[400px] p-10">
            <div className="text-center">
                <h4 className={`mb-2 text-2xl font-semibold ${pixelify.className} py-2`} >
                    {title}
                </h4>
                <div className="relative flex items-center justify-center z-1 mb-3">
                    <svg width="60" height="60" fill="#FF6F91" id="times-circle-solid" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d={`${svgIconTitle[type]}`} />
                    </svg>
                </div>
                <p className={`text-gray-600 dark:text-gray-400 ${geistMono.className}`}>{message}</p>
            </div>
        </Modal >
    )
}