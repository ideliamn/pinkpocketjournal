"use client";
import React from "react";
import AppHeader from "../layout/AppHeader";
import AppFooter from "../layout/AppFooter";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // <div className="relative bg-pink-100">
        //     < div className="absolute w-full" >
        //         <AppHeader />
        //     </div >
        //     <div className="h-screen">
        //         {children}
        //     </div>
        // </div >
        <div className="flex flex-col min-h-screen bg-pink-100">
            <header className="w-full">
                <AppHeader />
            </header>
            <main className="flex-1 pb-10">
                {children}
            </main>
            <footer className="w-full">
                <AppFooter />
            </footer>
        </div>
    );
}
