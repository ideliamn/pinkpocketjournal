"use client";
import React, { useRef, useEffect } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
    children: React.ReactNode;
    showCloseButton?: boolean; // New prop to control close button visibility
    isFullscreen?: boolean; // Default to false for backwards compatibility
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    children,
    className,
    isFullscreen = false,
}) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const contentClasses = isFullscreen
        ? "w-full h-full"
        : "relative w-full bg-white ";

    return (
        <div className="fixed inset-0 flex items-center justify-center overflow-y-auto modal z-99999">
            {!isFullscreen && (
                <div
                    // className="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[32px]"
                    className="absolute inset-0 backdrop-blur-[3px]"
                    onClick={onClose}
                ></div>
            )}
            <div
                ref={modalRef}
                className={`${contentClasses}  ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-full bg-pink-400 flex justify-end items-center absolute top-0 left-0">
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
                <div>{children}</div>
            </div>
        </div >
    );
};
