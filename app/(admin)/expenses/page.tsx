"use client"
import { Geist_Mono, Pixelify_Sans } from "next/font/google";
import Card from "../../components/card/Card";
import { useEffect, useState } from "react";
import { useProfile } from "../../context/ProfileContext";
import Loading from "../../components/common/Loading";
import moment from "moment";
import Button from "../../components/ui/button/Button";
import { formatRupiah } from "../../../lib/helpers/format";

const geistMono = Geist_Mono({
    variable: "--font-geist-sono",
    subsets: ["latin"],
    weight: ["400"]
})

const pixelify = Pixelify_Sans({
    subsets: ["latin"],
    weight: ["400"],
});

export default function Expenses() {
    interface Expense {
        id: number;
        description: string;
        amount: number;
        date: string;
        Expenses: {
            periods: {
                name: string;
            }
        },
        categories: {
            name: string;
        },
        sources: {
            name: string;
        }
    }

    const { profile } = useProfile()
    const [loading, setLoading] = useState(false);
    const [expense, setExpense] = useState<Expense[]>([])
    const [openModalAdd, setOpenModalAdd] = useState(false);

    const getExpenses = async () => {
        try {
            if (!profile?.id) return;
            const getExpense = await fetch(`/api/expense?userId=${profile?.id}`, {
                method: "GET"
            });
            const res = await getExpense.json();
            if (res.data) {
                console.log("res.data: ", JSON.stringify(res.data))
                setExpense(res.data)
            }
            setLoading(false)
        } catch (err) {
            console.error(err);
        } finally {
        }
    }

    useEffect(() => {
        setLoading(true)
        if (profile?.id) {
            getExpenses()
        }
    }, [profile])

    const closeModalAdd = () => {
        setOpenModalAdd(false);
        getExpenses();
    }

    return (
        <main className="flex flex-col items-center min-h-screen pt-20 gap-10">
            {loading && <Loading />}
            <h1 className={`${pixelify.className} text-xl`}>
                expenses
            </h1>
            <div className="mt-2 items-center justify-center">
                <Button size="md" variant="outline" className={`${geistMono.className} min-w-[400px] cursor-pointer mt-6`} onClick={() => setOpenModalAdd(true)}>
                    <div className="flex flex-col">
                        <div className="flex flex-row items-center justify-center mb-1">
                            <svg id="plus-solid" width="20" height="20" fill="#FF6F91" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="23 11 23 13 22 13 22 14 14 14 14 22 13 22 13 23 11 23 11 22 10 22 10 14 2 14 2 13 1 13 1 11 2 11 2 10 10 10 10 2 11 2 11 1 13 1 13 2 14 2 14 10 22 10 22 11 23 11" /></svg>
                        </div>
                        add
                    </div>
                </Button>
                {expense.length > 0 ? (
                    expense.map((e) => {
                        return (
                            <Card
                                key={e.id}
                                title={e.description}
                                desc={moment(new Date(e.date)).format("DD MMMM YYYY")}
                                className="min-w-[400px] outline-gray-400 hover:bg-pink-400 cursor-pointer mt-6"
                            >
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs">
                                        {e.description}
                                    </span>
                                    <span className="text-xs">
                                        amount: {formatRupiah(e.amount)}
                                    </span>
                                    <span className="text-xs">
                                        category: {e.categories.name}
                                    </span>
                                    <span className="text-xs">
                                        source: {e.sources.name}
                                    </span>
                                </div>
                            </Card>
                        );
                    })
                ) : (
                    <div className={`flex flex-col items-center justify-center min-h-[100px] text-gray-500 ${geistMono.className}`}>
                        no expenses found!
                    </div>
                )}
            </div>
        </main>
    );
}