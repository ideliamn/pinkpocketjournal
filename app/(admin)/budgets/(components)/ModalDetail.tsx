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
    interface Plan {
        id: number;
        max_expense: number;
        name: string;
        end_date: string;
        start_date: string;
        category_plans: [
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
    const [plan, setPlan] = useState<Plan | null>(null);

    const getPlanDetail = async () => {
        try {
            if (!id) return;
            setLoading(true)
            const getPlan = await fetch(`/api/plan?id=${id}`, {
                method: "GET"
            });
            const res = await getPlan.json();
            if (res.data) {
                setPlan(res.data[0])
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const fetchCategory = async () => {
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
        }
        fetchCategory();
    }, [])

    useEffect(() => {
        if (id) getPlanDetail()
    }, [id])

    const getRemainingDays = (endDate: string) => {
        const today = new Date();
        const end = new Date(endDate);
        const diff = end.getTime() - today.getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? `${days} days left until plan's period ends` : "plan's period has ended";
    };

    let totalAllocated = plan?.category_plans.reduce((sum, cat) => sum + cat.amount, 0) ?? 0;
    let remaining = plan?.max_expense ? plan?.max_expense - totalAllocated : 0

    interface PlanCategories {
        id: number,
        amount: number,
        categories: Categories
    }

    interface Categories {
        id: number,
        name: string;
    }

    const [selectedIdEditCP, setSelectedIdEditCP] = useState<number | null>(null);
    const [openModalEditCP, setOpenModalEditCP] = useState(false);
    const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);
    const [selectedCP, setSelectedCP] = useState<PlanCategories | null>(null);
    const [openModalSuccess, setOpenModalSuccess] = useState(false);
    const closeModalSuccess = () => { setOpenModalSuccess(false) };
    const [successMessage, setSuccessMessage] = useState("");
    const [openModalFailed, setOpenModalFailed] = useState(false);
    const closeModalFailed = () => { setOpenModalFailed(false) };
    const [failedMessage, setFailedMessage] = useState("");
    const [openModalConfirm, setOpenModalConfirm] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState("");
    const [pendingAction, setPendingAction] = useState<"edit" | "delete" | "create" | null>(null);
    const [isCreateMode, setIsCreateMode] = useState(false);


    const handleClickEditCP = async (idCP: number) => {
        console.log("id: ", idCP)
        setLoading(true)
        setSelectedIdEditCP(idCP)
        const foundCP = plan?.category_plans.find((cp) => cp.id === idCP);
        if (foundCP) {
            setSelectedCP({
                id: foundCP.id,
                amount: foundCP.amount,
                categories: {
                    id: foundCP.categories.id,
                    name: foundCP.categories.name
                }
            });
        }
        setOpenModalEditCP(true)
        setLoading(false)
        setSelectedIdEditCP(idCP);
    }

    const handleOpenConfirmEdit = () => {
        setConfirmMessage("are you sure you want to update this category?");
        setPendingAction("edit");
        setOpenModalConfirm(true);
    };

    const handleOpenConfirmDelete = () => {
        setConfirmMessage("are you sure you want to delete this category?");
        setPendingAction("delete");
        setOpenModalConfirm(true);
    };

    const handleConfirmAction = async () => {
        if (pendingAction === "edit") {
            await handleSubmitEditCP();
        } else if (pendingAction === "delete") {
            await handleDeleteCP(selectedCP?.id ?? 0);
        } else if (pendingAction === "create") {
            await handleSubmitCreateCP();
        }
        setOpenModalConfirm(false);
        setPendingAction(null);
    };

    const openModalCreateCP = () => {
        setSelectedCP({ id: 0, amount: 0, categories: { id: 0, name: "" } });
        setIsCreateMode(true);
        setOpenModalEditCP(true);
    }

    const closeModalEditCP = () => {
        getPlanDetail()
        setOpenModalEditCP(false);
        setSelectedIdEditCP(null)
        setIsCreateMode(false);
    }

    const handleSubmitEditCP = async (e?: React.FormEvent) => {
        setLoading(true);
        e?.preventDefault();
        console.log("selectedCP: " + JSON.stringify(selectedCP))
        try {
            if (!selectedCP?.id || !selectedCP.categories.id || !selectedCP.amount) {
                setFailedMessage("fill all the required fields!");
                setOpenModalFailed(true);
                setLoading(false);
                return;
            }
            const res = await fetch("/api/Plan-category", {
                method: "PUT",
                body: JSON.stringify({
                    id: selectedCP.id,
                    category_id: selectedCP.categories.id,
                    amount: selectedCP.amount
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setSuccessMessage("success update Plan for this category!");
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
            closeModalEditCP();
            setLoading(false)
        }
    };

    const handleDeleteCP = async (id: number) => {
        setLoading(true);
        console.log("selectedCP: " + JSON.stringify(selectedCP))
        try {
            if (!id || id === 0) {
                setFailedMessage("fill all the required fields!");
                setOpenModalFailed(true);
                setLoading(false);
                return;
            }
            const res = await fetch(`/api/Plan-category?id=${id}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (res.ok) {
                setSuccessMessage("success delete Plan for this category!");
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
            closeModalEditCP();
            setLoading(false)
        }
    };

    const handleOpenConfirmCreate = () => {
        setConfirmMessage("are you sure you want to create this category?");
        setPendingAction("create");
        setOpenModalConfirm(true);
    };

    const handleSubmitCreateCP = async () => {
        setLoading(true);
        try {
            if (!selectedCP?.categories.id || !selectedCP.amount) {
                setFailedMessage("fill all the required fields!");
                setOpenModalFailed(true);
                setLoading(false);
                return;
            }
            const res = await fetch("/api/category-plans", {
                method: "POST",
                body: JSON.stringify({
                    plan_id: id,
                    category_id: selectedCP.categories.id,
                    amount: selectedCP.amount,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setSuccessMessage("success");
                setOpenModalSuccess(true);
            } else {
                setFailedMessage(data.message);
                setOpenModalFailed(true);
            }
        } catch (err) {
            console.error(err);
        } finally {
            closeModalEditCP();
            setLoading(false);
            setIsCreateMode(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] p-10">
            {loading ? (<Loading />) : plan ? (
                <div className={`${geistMono.className} text-left space-y-2 pt-3`}>
                    <h2 className="text-md">
                        {plan?.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                        {moment(plan.start_date).format("D MMMM YYYY")} - {moment(plan.end_date).format("D MMMM YYYY")}
                    </p>
                    <p className="text-sm text-gray-400">
                        {getRemainingDays(plan.end_date)}
                    </p>
                    <div className="flex flex-col border-t border-gray-300 pt-4 gap-1">
                        <p className="text-sm">max expense: <span>{formatRupiah(plan?.max_expense ?? 0)}</span></p>
                        <p className="text-sm">total allocated: <span>{formatRupiah(totalAllocated ?? 0)}</span></p>
                        <p className="text-sm">remaining: <span>{formatRupiah(remaining)}</span></p>
                    </div>
                    <div className="mt-4">
                        <p className=" mb-2 text-gray-600">categories:</p>
                        {plan?.category_plans.map((cat, i) => (
                            <div key={i} className="flex justify-between text-sm py-1">
                                <span>{cat.categories.name}</span>
                                <div className="flex flex-row items-center justify-center">
                                    <span>{formatRupiah(cat.amount)}</span>
                                    <Button size="xs" variant="primary" className={`${geistMono.className} text-xs cursor-pointer hover:underline hover:bg-pink-200 ml-1`} onClick={() => handleClickEditCP(cat.id)}>
                                        <svg id="pencil-solid" width="15" height="15" fill="#FF6F91" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="8 20 9 20 9 21 8 21 8 22 7 22 7 23 1 23 1 17 2 17 2 16 3 16 3 15 4 15 4 16 5 16 5 17 6 17 6 18 7 18 7 19 8 19 8 20" /><polygon points="17 10 18 10 18 12 17 12 17 13 16 13 16 14 15 14 15 15 14 15 14 16 13 16 13 17 12 17 12 18 11 18 11 19 10 19 10 18 9 18 9 17 8 17 8 16 7 16 7 15 6 15 6 14 5 14 5 13 6 13 6 12 7 12 7 11 8 11 8 10 9 10 9 9 10 9 10 8 11 8 11 7 12 7 12 6 14 6 14 7 15 7 15 8 16 8 16 9 17 9 17 10" /><polygon points="23 4 23 7 22 7 22 8 21 8 21 9 19 9 19 8 18 8 18 7 17 7 17 6 16 6 16 5 15 5 15 3 16 3 16 2 17 2 17 1 20 1 20 2 21 2 21 3 22 3 22 4 23 4" /></svg>
                                    </Button>
                                    <Button size="xs" variant="primary" className={`${geistMono.className} text-xs cursor-pointer hover:underline hover:bg-pink-200`} onClick={() => { handleDeleteCP(cat.id) }}><svg id="trash-alt-solid" width="15" height="15" fill="#FF6F91" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="22 3 22 5 2 5 2 3 8 3 8 2 9 2 9 1 15 1 15 2 16 2 16 3 22 3" /><path d="m4,7v15h1v1h14v-2h1V7H4Zm12,12h-2v-10h2v10Zm-6,0h-2v-10h2v10Z" /></svg></Button>
                                </div>
                            </div>
                        ))}
                        <Button size="sm" variant="primary" className={`${geistMono.className} text-sm text-gray-500 cursor-pointer hover:underline hover:text-pink-600`} onClick={() => openModalCreateCP()}>plan new categories...</Button>
                    </div>
                </div>
            ) : (
                <div className={`flex justify-center text-center ${geistMono.className} text-left space-y-2 pt-6`}>no plan information found!</div>
            )}
            {openModalEditCP && (
                <FormModal
                    isOpen={openModalEditCP}
                    onClose={closeModalEditCP}
                >
                    <h2 className={`${geistMono.className} font-semibold text-md text-left space-y-2 pt-3 py-3`}>
                        edit plan for category
                    </h2>
                    <form>
                        <div className="flex gap-4 items-center space-y-4">
                            <div className={`flex items-center ${geistMono.className} text-s w-[200px] text-start justify-start`}>
                                category
                            </div>
                            <div className="flex-1">
                                <Select
                                    options={categoryOptions}
                                    placeholder="categories"
                                    defaultValue={selectedCP ? String(selectedCP?.categories?.id) : ""}
                                    onChange={(val: string) =>
                                        setSelectedCP((prev) =>
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
                                    defaultValue={selectedCP?.amount}
                                    onChange={(e) => setSelectedCP((prev) =>
                                        prev ? { ...prev, amount: Number(e.target.value) } : prev
                                    )}>
                                </Input>
                            </div>
                        </div>
                        <div className="flex items-center justify-center py-6 gap-3">
                            {isCreateMode ? (<>
                                <Button onClick={() => handleOpenConfirmCreate()} type="button" size="sm" variant="outline" className={`${geistMono.className} text-s cursor-pointer hover:underline hover:text-pink-600`}>
                                    create
                                </Button>
                                <Button onClick={() => closeModalEditCP()} type="button" size="sm" variant="outline" className={`${geistMono.className} text-s cursor-pointer hover:underline hover:text-pink-600`}>
                                    cancel
                                </Button>
                            </>) : (<>
                                <Button onClick={() => handleOpenConfirmEdit()} type="button" size="sm" variant="outline" className={`${geistMono.className} text-s cursor-pointer hover:underline hover:text-pink-600`}>
                                    update
                                </Button>
                                <Button type="button" onClick={() => handleOpenConfirmDelete()} size="sm" variant="outline" className={`${geistMono.className} text-s cursor-pointer hover:underline hover:text-pink-600`}>
                                    delete
                                </Button>
                            </>)}
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
                    yesButton
                    yesButtonText="ok"
                    handleYes={closeModalSuccess}
                />
            )}
            {openModalFailed && (
                <SimpleModal
                    type={"failed"}
                    isOpen={openModalFailed}
                    onClose={closeModalFailed}
                    message={failedMessage}
                    yesButton
                    yesButtonText="ok"
                    handleYes={closeModalFailed}
                />
            )}
            {openModalConfirm && (
                <SimpleModal
                    type="confirm"
                    isOpen={openModalConfirm}
                    onClose={() => setOpenModalConfirm(false)}
                    message={confirmMessage}
                    yesButton
                    yesButtonText="yes"
                    handleYes={handleConfirmAction}
                    noButton
                    noButtonText="cancel"
                    handleNo={() => setOpenModalConfirm(false)}
                />
            )}
        </Modal >
    )
}