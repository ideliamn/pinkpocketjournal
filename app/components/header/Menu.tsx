"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Pixelify_Sans } from "next/font/google";
import Loading from "../common/Loading";
import { usePathname } from "next/navigation";

const pixelify = Pixelify_Sans({
    subsets: ["latin"],
    weight: ["400"],
});

export default function Menu() {
    interface Menu {
        name: string;
        url: string;
    }

    const [menu, setMenu] = useState<Menu[]>([]);
    const [loading, setLoading] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        getMenu();
    }, []);

    useEffect(() => {
        setLoading(false);
    }, [pathname]);

    const getMenu = async () => {
        try {
            const res = await fetch("/api/menu");
            const data = await res.json();
            if (res.ok) setMenu(data.data);
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error(err.message);
            } else {
                console.error("Something went wrong");
            }
        }
    };

    return (
        <div className={`${pixelify.className} flex gap-4`}>
            {loading && <Loading />}
            {menu.map((m) => (
                <Link
                    href={m.url}
                    key={m.url}
                    onClick={() => setLoading(true)}
                    className="cursor-pointer hover:text-pink-600 hover:underline whitespace-nowrap"
                >
                    {m.name}
                </Link>
            ))}
        </div>
    );
}
