"use client";

import { Geist_Mono, Pixelify_Sans } from "next/font/google";
import { Modal } from ".";
import Button from "../ui/button/Button";

interface ModalSuccessProps {
    type: "success" | "failed" | "info" | "warning" | "confirm"; // success / failed / info / warning
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
    yesButton?: boolean;
    yesButtonText?: string;
    handleYes?: () => void;
    noButton?: boolean;
    noButtonText?: string;
    handleNo?: () => void;
    onConfirm?: () => void;
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

const polygon = {
    success: "",
    failed: "",
    info: "",
    warning: "14 11 14 14 13 14 13 17 11 17 11 14 10 14 10 11 14 11",
    confirm: "17 5 17 11 16 11 16 12 15 12 15 13 13 13 13 15 10 15 10 12 11 12 11 11 13 11 13 10 14 10 14 6 10 6 10 7 9 7 9 8 7 8 7 5 8 5 8 4 9 4 9 3 15 3 15 4 16 4 16 5 17 5"
}

const path = {
    success: "m22,9v-2h-1v-2h-1v-1h-1v-1h-2v-1h-2v-1h-6v1h-2v1h-2v1h-1v1h-1v2h-1v2h-1v6h1v2h1v2h1v1h1v1h2v1h2v1h6v-1h2v-1h2v-1h1v-1h1v-2h1v-2h1v-6h-1Zm-4,3h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-2v-1h-1v-1h-1v-1h-1v-1h-1v-2h1v-1h2v1h1v1h2v-1h1v-1h1v-1h1v-1h1v-1h2v1h1v2h-1v1Z",
    failed: "m22,9v-2h-1v-2h-1v-1h-1v-1h-2v-1h-2v-1h-6v1h-2v1h-2v1h-1v1h-1v2h-1v2h-1v6h1v2h1v2h1v1h1v1h2v1h2v1h6v-1h2v-1h2v-1h1v-1h1v-2h1v-2h1v-6h-1Zm-8,7v-1h-1v-1h-2v1h-1v1h-1v1h-1v-1h-1v-1h1v-1h1v-1h1v-2h-1v-1h-1v-1h-1v-1h1v-1h1v1h1v1h1v1h2v-1h1v-1h1v-1h1v1h1v1h-1v1h-1v1h-1v2h1v1h1v1h1v1h-1v1h-1v-1h-1Z",
    info: "m22,9v-2h-1v-2h-1v-1h-1v-1h-2v-1h-2v-1h-6v1h-2v1h-2v1h-1v1h-1v2h-1v2h-1v6h1v2h1v2h1v1h1v1h2v1h2v1h6v-1h2v-1h2v-1h1v-1h1v-2h1v-2h1v-6h-1Zm-11-3h2v2h-2v-2Zm-1,9h1v-5h-1v-1h3v6h1v2h-4v-2Z",
    warning: "m22,20v-2h-1v-2h-1v-2h-1v-2h-1v-2h-1v-2h-1v-2h-1v-2h-1v-2h-1v-1h-2v1h-1v2h-1v2h-1v2h-1v2h-1v2h-1v2h-1v2h-1v2h-1v2h-1v2h1v1h20v-1h1v-2h-1Zm-19,1v-1h1v-2h1v-2h1v-2h1v-2h1v-2h1v-2h1v-2h1v-2h2v2h1v2h1v2h1v2h1v2h1v2h1v2h1v2h1v1H3Z",
    confirm: ""
}

export default function SimpleModal({
    type,
    isOpen,
    onClose,
    title = type == "info" || type == "confirm" ? type : type + "!",
    message,
    yesButton = false,
    yesButtonText = "",
    handleYes = () => { },
    noButton = false,
    noButtonText = "",
    handleNo = () => { },
}: ModalSuccessProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[400px] p-10">
            <div className="text-center">
                <h4 className={`mb-2 text-2xl font-semibold ${pixelify.className} py-2`} >
                    {title}
                </h4>
                <div className="relative flex items-center justify-center z-1 mb-3">
                    <svg width="60" height="60" fill="#FF6F91" id="times-circle-solid" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <polygon points={`${polygon[type]}`} />
                        <rect x="11" y="18" width="2" height="2" />
                        <path d={`${path[type]}`} />
                    </svg>
                </div>
                <p className={`text-gray-600 dark:text-gray-400 ${geistMono.className}`}>{message}</p>
                <div className={`${pixelify.className} mt-4 flex gap-6 items-center justify-center`}>
                    {yesButton && <Button size="sm" variant="outline" className={`${geistMono.className} text-s cursor-pointer hover:underline hover:text-pink-600`} onClick={handleYes}>
                        {yesButtonText}
                    </Button>}
                    {noButton && <Button size="sm" variant="outline" className={`${geistMono.className} text-s cursor-pointer hover:underline hover:text-pink-600`} onClick={handleNo}>
                        {noButtonText}
                    </Button>}
                </div>
            </div>
        </Modal >
    )
}