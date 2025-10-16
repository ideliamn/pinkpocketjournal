import { Geist_Mono } from "next/font/google";
import React from "react";

const geistMono = Geist_Mono({
    variable: "--font-geist-sono",
    subsets: ["latin"],
})

interface CardProps {
    title: string;
    children: React.ReactNode;
    className?: string; // Additional custom classes for styling
    desc?: string; // Description text
    onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
    title,
    children,
    className = "",
    desc = "",
    onClick
}) => {
    return (
        <div
            onClick={onClick}
            className={`border-gray-400 border-1 bg-pink-100 ${geistMono.className} ${className}`}
        >
            {/* Card Header */}
            <div className="px-6 py-2">
                <h3 className={`text-base ${geistMono.className}`}>
                    {title}
                </h3>
                {desc && (
                    <p className={`py-1 text-xs ${geistMono.className}`}>
                        {desc}
                    </p>
                )}
            </div>

            {/* Card Body */}
            <div className="px-6 pb-3 text-sm">
                <div className="">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Card;
