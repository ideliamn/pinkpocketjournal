import { Pixelify_Sans } from "next/font/google";
import React from "react";

const pixelify = Pixelify_Sans({
    subsets: ["latin"],
    weight: ["600"],
});

const AppFooter: React.FC = () => {
    return (
        <div className={`w-full text-center py-4 text-gray-500 text-sm ${pixelify.className}`}>
            © {new Date().getFullYear()} pinkpocketjournal — all rights reserved.
        </div >
    );
};

export default AppFooter;
