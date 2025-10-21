"use client";

import { Geist_Mono, Pixelify_Sans } from "next/font/google";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/modals";
import { useEffect, useState } from "react";
import Loading from "../../../components/common/Loading";
import moment from "moment";
import { formatRupiah } from "../../../../lib/helpers/format";
import FormModal from "../../../components/modals/FormModal";
import Input from "../../../components/form/input/InputField";
import Select from "../../../components/ui/select/Select";
import SimpleModal from "../../../components/modals/SimpleModal";

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
    weight: ["400", "500", "600"]
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
                id: number,
                amount: number,
                categories: {
                    id: number,
                    name: string;
                }
            }
        ]
    }

    const [loading, setLoading] = useState(false);
    const [budget, setBudget] = useState<Budget | null>(null);

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

    const getRemainingDays = (endDate: string) => {
        const today = new Date();
        const end = new Date(endDate);
        const diff = end.getTime() - today.getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? `${days} days left until period ends` : "period has ended";
    };

    let totalAllocated = budget?.budget_categories.reduce((sum, cat) => sum + cat.amount, 0) ?? 0;
    let remaining = budget?.max_expense ? budget?.max_expense - totalAllocated : 0

    interface BudgetCategories {
        id: number,
        amount: number,
        categories: Categories
    }

    interface Categories {
        id: number,
        name: string;
    }

    const [selectedIdEditBC, setSelectedIdEditBC] = useState<number | null>(null);
    const [openModalEditBC, setOpenModalEditBC] = useState(false);
    const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);
    const [selectedBC, setSelectedBC] = useState<BudgetCategories | null>(null);
    const [openModalSuccess, setOpenModalSuccess] = useState(false);
    const closeModalSuccess = () => { setOpenModalSuccess(false) };
    const [successMessage, setSuccessMessage] = useState("");
    const [openModalFailed, setOpenModalFailed] = useState(false);
    const closeModalFailed = () => { setOpenModalFailed(false) };
    const [failedMessage, setFailedMessage] = useState("");

    const handleClickEditBC = async (idBC: number) => {
        console.log("id: ", idBC)
        setLoading(true)
        setSelectedIdEditBC(idBC)
        const foundBC = budget?.budget_categories.find((bc) => bc.id === idBC);
        if (foundBC) {
            setSelectedBC({
                id: foundBC.id,
                amount: foundBC.amount,
                categories: {
                    id: foundBC.categories.id,
                    name: foundBC.categories.name
                }
            });
        }
        const getCategory = await fetch(`/api/category?userId=${id}`);
        console.log("getCategory: ", JSON.stringify(getCategory))
        const res = await getCategory.json();
        if (res.data) {
            const dataCategory: Categories[] = res.data
            const formattedOptions = dataCategory.map((k) => ({
                value: String(k.id),
                label: k.name,
            })).sort((a, b) => a.label.localeCompare(b.label));
            setCategoryOptions(formattedOptions);
        }
        setOpenModalEditBC(true)
        setLoading(false)
        setSelectedIdEditBC(idBC);
    }

    const closeModalEditBC = () => {
        getBudgetDetail()
        setOpenModalEditBC(false);
        setSelectedIdEditBC(null)
    }

    const handleSubmitEditBC = async (e: React.FormEvent) => {
        setLoading(true);
        e.preventDefault();
        console.log("selectedBC: " + JSON.stringify(selectedBC))
        try {
            if (!selectedBC?.id || !selectedBC.categories.id || !selectedBC.amount) {
                setFailedMessage("fill all the required fields!");
                setOpenModalFailed(true);
                setLoading(false);
                return;
            }

            const res = await fetch("/api/budget-category", {
                method: "PUT",
                body: JSON.stringify({
                    id: selectedBC.id,
                    category_id: selectedBC.categories.id,
                    amount: selectedBC.amount
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccessMessage("success update budget for this category!");
                setLoading(false);
                setOpenModalSuccess(true);
            } else {
                setFailedMessage(data.message);
                setLoading(false);
                setOpenModalFailed(true);
            }
        } catch (err: any) {
            console.error(err)
        } finally {
            closeModalEditBC();
            setLoading(false)
        }
    };

    const handleDeleteBC = async (id: number) => {
        setLoading(true);
        console.log("selectedBC: " + JSON.stringify(selectedBC))
        try {
            if (!id || id === 0) {
                setFailedMessage("fill all the required fields!");
                setOpenModalFailed(true);
                setLoading(false);
                return;
            }
            const res = await fetch(`/api/budget-category?id=${id}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (res.ok) {
                setSuccessMessage("success delete budget for this category!");
                setLoading(false);
                setOpenModalSuccess(true);
            } else {
                setFailedMessage(data.message);
                setLoading(false);
                setOpenModalFailed(true);
            }
        } catch (err: any) {
            console.error(err)
        } finally {
            closeModalEditBC();
            setLoading(false)
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] p-10">
            {loading ? (<Loading />) : budget ? (
                <div className={`${geistMono.className} text-left space-y-2 pt-3`}>
                    <h2 className="text-md">
                        {budget?.periods?.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                        {moment(budget?.periods.start_date).format("D MMMM YYYY")} - {moment(budget?.periods.end_date).format("D MMMM YYYY")}
                    </p>
                    <p className="text-sm text-gray-400">
                        {getRemainingDays(budget.periods.end_date)}
                    </p>
                    <div className="flex flex-col border-t border-gray-300 pt-4 gap-1">
                        <p className="text-sm">income: <span>{formatRupiah(budget?.income ?? 0)}</span></p>
                        <p className="text-sm">max expense: <span>{formatRupiah(budget?.max_expense ?? 0)}</span></p>
                        <p className="text-sm">total allocated: <span>{formatRupiah(totalAllocated ?? 0)}</span></p>
                        <p className="text-sm">remaining: <span>{formatRupiah(remaining)}</span></p>
                    </div>
                    <div className="mt-4">
                        <p className=" mb-2 text-gray-600">categories:</p>
                        {budget?.budget_categories.map((cat, i) => (
                            <div key={i} className="flex justify-between text-sm py-1">
                                <span>{cat.categories.name}</span>
                                <div className="flex flex-row items-center justify-center">
                                    <span>{formatRupiah(cat.amount)}</span>
                                    <Button size="xs" variant="primary" className={`${geistMono.className} text-xs cursor-pointer hover:underline hover:bg-pink-200 ml-1`} onClick={() => handleClickEditBC(cat.id)}>
                                        <svg id="pencil-solid" width="15" height="15" fill="#FF6F91" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="8 20 9 20 9 21 8 21 8 22 7 22 7 23 1 23 1 17 2 17 2 16 3 16 3 15 4 15 4 16 5 16 5 17 6 17 6 18 7 18 7 19 8 19 8 20" /><polygon points="17 10 18 10 18 12 17 12 17 13 16 13 16 14 15 14 15 15 14 15 14 16 13 16 13 17 12 17 12 18 11 18 11 19 10 19 10 18 9 18 9 17 8 17 8 16 7 16 7 15 6 15 6 14 5 14 5 13 6 13 6 12 7 12 7 11 8 11 8 10 9 10 9 9 10 9 10 8 11 8 11 7 12 7 12 6 14 6 14 7 15 7 15 8 16 8 16 9 17 9 17 10" /><polygon points="23 4 23 7 22 7 22 8 21 8 21 9 19 9 19 8 18 8 18 7 17 7 17 6 16 6 16 5 15 5 15 3 16 3 16 2 17 2 17 1 20 1 20 2 21 2 21 3 22 3 22 4 23 4" /></svg>
                                    </Button>
                                    <Button size="xs" variant="primary" className={`${geistMono.className} text-xs cursor-pointer hover:underline hover:bg-pink-200`} onClick={() => { handleDeleteBC(cat.id) }}><svg id="trash-alt-solid" width="15" height="15" fill="#FF6F91" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="22 3 22 5 2 5 2 3 8 3 8 2 9 2 9 1 15 1 15 2 16 2 16 3 22 3" /><path d="m4,7v15h1v1h14v-2h1V7H4Zm12,12h-2v-10h2v10Zm-6,0h-2v-10h2v10Z" /></svg></Button>
                                </div>
                            </div>
                        ))}
                        <Button size="sm" variant="primary" className={`${geistMono.className} text-sm text-gray-500 cursor-pointer hover:underline hover:text-pink-600`}>add new category for this period...</Button>
                    </div>
                </div>
            ) : (
                <div className={`flex justify-center text-center ${geistMono.className} text-left space-y-2 pt-6`}>no budget information found!</div>
            )}
            {openModalEditBC && (
                <FormModal
                    isOpen={openModalEditBC}
                    onClose={closeModalEditBC}
                >
                    <h2 className={`${geistMono.className} font-semibold text-md text-left space-y-2 pt-3 py-3`}>
                        edit budget for category
                    </h2>
                    <form onSubmit={handleSubmitEditBC}>
                        <div className="flex gap-4 items-center space-y-4">
                            <div className={`flex items-center ${geistMono.className} text-s w-[200px] text-start justify-start`}>
                                category
                            </div>
                            <div className="flex-1">
                                <Select
                                    options={categoryOptions}
                                    placeholder="categories"
                                    defaultValue={selectedBC ? String(selectedBC?.categories?.id) : ""}
                                    onChange={(val: string) =>
                                        setSelectedBC((prev) =>
                                            prev ? { ...prev, categories: { ...prev.categories, id: Number(val) } } : prev
                                        )
                                    } />
                            </div>
                        </div>
                        <div className="flex gap-4 items-center space-y-4">
                            <div className={`flex items-center ${geistMono.className} text-s w-[200px] text-start justify-start`}>
                                amount
                            </div>
                            <div className="flex-1">
                                <Input
                                    type="number"
                                    defaultValue={selectedBC?.amount}
                                    onChange={(e) => setSelectedBC((prev) =>
                                        prev ? { ...prev, amount: Number(e.target.value) } : prev
                                    )}>
                                </Input>
                            </div>
                        </div>
                        <div className="flex items-center justify-center py-6 gap-3">
                            <Button type="submit" size="sm" variant="outline" className={`${geistMono.className} text-s cursor-pointer hover:underline hover:text-pink-600`}>
                                update
                            </Button>
                            <Button type="button" onClick={() => { handleDeleteBC(selectedBC?.id ?? 0) }} size="sm" variant="outline" className={`${geistMono.className} text-s cursor-pointer hover:underline hover:text-pink-600`}>
                                delete
                            </Button>
                        </div>
                    </form>
                </FormModal>
            )}
            {openModalSuccess && (
                <SimpleModal
                    type={"success"}
                    isOpen={openModalSuccess}
                    onClose={closeModalSuccess}
                    message={successMessage}
                />
            )}
            {openModalFailed && (
                <SimpleModal
                    type={"failed"}
                    isOpen={openModalFailed}
                    onClose={closeModalFailed}
                    message={failedMessage}
                />
            )}
        </Modal >
    )
}