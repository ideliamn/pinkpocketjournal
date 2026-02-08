'use client'
import React from "react";
import AppHeader from "../layout/AppHeader";
import AppFooter from "../layout/AppFooter";
import { Geist_Mono } from "next/font/google";
const geistMono = Geist_Mono({
    variable: "--font-geist-sono",
    subsets: ["latin"],
    weight: ["200", "400"]
})
export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (

        <div className={`${geistMono.className} flex flex-col min-h-screen !bg-pink-100`} >
            <header className="w-full ">
                <AppHeader />
            </header>
            <main className="flex-1 pb-10">
                {children}
            </main>
            <footer className="w-full">
                <AppFooter />
            </footer>
        </div >
    );
}
