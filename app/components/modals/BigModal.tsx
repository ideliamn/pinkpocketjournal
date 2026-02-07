"use client";
import React, { useEffect } from "react";
import { Pixelify_Sans } from "next/font/google";

interface BigModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

const pixelify = Pixelify_Sans({
    subsets: ["latin"],
    weight: ["400"],
});

export default function BigModal({
    isOpen,
    onClose,
    title,
    children,
}: BigModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm overflow-y-auto">
            {/* wrapper scroll */}
            <div className="flex justify-center py-10 px-4">
                {/* modal */}
                <div
                    className="relative w-full max-w-[800px] h-[90vh] bg-white shadow-xl flex flex-col overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className={`w-full bg-pink-400 flex justify-end items-center absolute top-0 left-0 ${pixelify.className}`}>
                        <button
                            onClick={onClose}
                            className="z-999 flex h-9 w-9 items-center justify-center cursor-pointer hover:bg-pink-600 hover:text-pink-600"
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                // fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="m22,2v-1H2v1h-1v20h1v1h20v-1h1V2h-1Zm-1,19H3V3h18v18Z" /><polygon points="15 13 16 13 16 14 17 14 17 15 18 15 18 16 17 16 17 17 16 17 16 18 15 18 15 17 14 17 14 16 13 16 13 15 11 15 11 16 10 16 10 17 9 17 9 18 8 18 8 17 7 17 7 16 6 16 6 15 7 15 7 14 8 14 8 13 9 13 9 11 8 11 8 10 7 10 7 9 6 9 6 8 7 8 7 7 8 7 8 6 9 6 9 7 10 7 10 8 11 8 11 9 13 9 13 8 14 8 14 7 15 7 15 6 16 6 16 7 17 7 17 8 18 8 18 9 17 9 17 10 16 10 16 11 15 11 15 13" />
                            </svg>
                        </button>
                    </div>

                    {/* CONTENT */}
                    <div className="pt-12 px-6 pb-6 h-full">
                        {title && (
                            <h4 className={`text-2xl font-semibold text-center mb-4 ${pixelify.className}`}>
                                {title}
                            </h4>
                        )}

                        {/* 🔥 FIX: height dikunci */}
                        <div
                            className="overflow-y-auto pr-2"
                            style={{ height: "calc(100% - 48px)" }} // 48px = header + title space
                        >
                            {children}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
