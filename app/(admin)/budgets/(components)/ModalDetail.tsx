"use client";

import { Geist_Mono, Pixelify_Sans } from "next/font/google";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/modals";
import { useState } from "react";
import Loading from "../../../components/common/Loading";

interface ModalDetailProps {
    id: number;
    isOpen: boolean;
    onClose: () => void;
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

export default function ModalDetail({
    id,
    isOpen,
    onClose,
}: ModalDetailProps) {
    interface Budget {
        id: number;
        income: number;
        max_expense: number;
        periods: {
            name: string;
            end_date: string;
            start_date: string;
        },
        budget_categories: [
            {
                amount: number,
                categories: {
                    name: string;
                }
            }
        ]
    }

    const [loading, setLoading] = useState(false);
    const [Budget, setBudget] = useState<Budget[]>([])

    const getMenuDetail = async () => {
        try {
            if (!id) return;
            const getBudget = await fetch(`/api/budget?id=${id}`, {
                method: "GET"
            });
            const res = await getBudget.json();
            if (res.data) {
                setBudget(res.data)
            }
            // setLoading(false)
        } catch (err) {
            console.error(err);
        } finally {
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[800px] p-10">
            {loading && <Loading />}
            <div className="text-center">
                <h4 className={`mb-2 text-2xl font-semibold ${pixelify.className} py-2`} >
                    detail
                </h4>
                <div className="relative flex items-center justify-center z-1 mb-3">
                </div>
                <p className={`text-gray-600 dark:text-gray-400 ${geistMono.className}`}>
                    message
                </p>
                <div className={`${pixelify.className} mt-4 flex gap-6 items-center justify-center`}>
                    <Button size="sm" variant="outline" className={`${geistMono.className} text-s cursor-pointer hover:underline hover:text-pink-600`}>
                        ok
                    </Button>
                </div>
            </div>
        </Modal >
    )
}