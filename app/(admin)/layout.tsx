"use client";
import React from "react";
import AppHeader from "../layout/AppHeader";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative">
            <div className="absolute w-full">
                <AppHeader />
            </div>
            <div className="h-screen">
                {children}
            </div>
        </div>
    );
}
