"use client";

import { Geist_Mono, Pixelify_Sans } from "next/font/google";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/modals";
import { useEffect, useState } from "react";
import Loading from "../../../components/common/Loading";
import moment from "moment";
import { formatRupiah } from "../../../../lib/helpers/format";

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
    const [budget, setBudget] = useState<Budget | null>(null)

    const getBudgetDetail = async () => {
        try {
            if (!id) return;
            setLoading(true)
            const getBudget = await fetch(`/api/budget?id=${id}`, {
                method: "GET"
            });
            const res = await getBudget.json();
            if (res.data) {
                setBudget(res.data[0])
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) getBudgetDetail()
    }, [id])

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[800px] p-10">
            {loading ? (<Loading />) : budget ? (
                <div className={`${geistMono.className} text-left space-y-2 pt-3`}>
                    <h2 className="text-sm">
                        {budget?.periods?.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                        {moment(budget?.periods.start_date).format("DD MMMM YYYY")} - {moment(budget?.periods.end_date).format("DD MMMM YYYY")}
                    </p>

                    <div className="flex flex-col border-t border-gray-300 pt-4 gap-1">
                        <p className="text-sm">income: <span className="">{formatRupiah(budget?.income ?? 0)}</span></p>
                        <p className="text-sm">max Expense: <span className="">{formatRupiah(budget?.max_expense ?? 0)}</span></p>
                    </div>

                    <div className="mt-4">
                        <p className=" mb-2 text-gray-600">categories:</p>
                        {budget?.budget_categories.map((cat, i) => (
                            <div key={i} className="flex justify-between text-sm py-1">
                                <span>{cat.categories.name}</span>
                                {/* <span>{formatRupiah(cat.amount)}</span> */}
                                <div className="flex flex-row gap-2 items-center justify-center">
                                    <span>{formatRupiah(cat.amount)}</span>
                                    <Button size="xs" variant="primary" className={`${geistMono.className} text-xs cursor-pointer hover:underline hover:text-pink-600`}>adjust</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div>nga ada budget</div>
            )
            }
        </Modal >
    )
}