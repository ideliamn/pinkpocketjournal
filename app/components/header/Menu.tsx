"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Pixelify_Sans } from "next/font/google";

const pixelify = Pixelify_Sans({
    subsets: ["latin"],
    weight: ["400"],
});
export default function Menu() {
    interface Menu {
        name: string;
        url: string;
    }

    const [menu, setMenu] = useState<Menu[]>([])

    useEffect(() => {
        getMenu()
    }, [])

    const getMenu = async () => {
        try {
            const res = await fetch("/api/menu", {
                method: "GET"
            });
            const data = await res.json();
            if (res.ok) {
                setMenu(data.data)
            }
        } catch (err) {
            console.error(err);
        } finally {
        }
    }

    return (
        <div className={`${pixelify.className} flex gap-4`}>
            {menu.map((m) => (
                <Link href={`${m.url}`} key={m.url} className="cursor-pointer hover:text-pink-600 hover:underline whitespace-nowrap">{m.name}</Link>
            ))}
        </div >
    );
}

