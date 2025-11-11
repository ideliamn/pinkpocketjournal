"use client"
import { Geist_Mono, Pixelify_Sans } from "next/font/google";
import Card from "../../components/card/Card";
import { useEffect, useState } from "react";
import { useProfile } from "../../context/ProfileContext";
import Loading from "../../components/common/Loading";
import moment from "moment";
import Button from "../../components/ui/button/Button";
import FormModal from "../../components/modals/FormModal";
import Input from "../../components/form/input/InputField";
import SimpleModal from "../../components/modals/SimpleModal";
import { formatRupiah } from "../../../lib/helpers/format";
import Select from "../../components/ui/select/Select";

const geistMono = Geist_Mono({
    variable: "--font-geist-sono",
    subsets: ["latin"],
    weight: ["400"]
})

const pixelify = Pixelify_Sans({
    subsets: ["latin"],
    weight: ["400"],
});

export default function BudgetCategories() {
    interface BudgetCategories {
        id: number;
        budget_id: number;
        budgets: {
            id: number;
            periods: {
                id: number;
                name: string;
                start_date: string;
                end_date: string;
            }
        },
        category_id: number;
        categories: {
            id: number;
            name: string;
            user_id: number;
        },
        amount: number;
    }

    interface Budget {
        id: number,
        periods: {
            name: string;
            start_date: string;
            end_date: string;
        }
    }

    interface Select {
        id: number,
        name: string;
    }

    const { profile } = useProfile()
    const [loading, setLoading] = useState(false);
    const [openModalForm, setOpenModalForm] = useState(false);
    const [budgetCategories, setBudgetCategories] = useState<BudgetCategories[]>([])
    const [budgetOptions, setBudgetOptions] = useState<{ value: string; label: string }[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);
    const [selectedBC, setSelectedBC] = useState<BudgetCategories | null>(null);
    const [openModalSuccess, setOpenModalSuccess] = useState(false);
    const closeModalSuccess = () => { setOpenModalSuccess(false) };
    const [successMessage, setSuccessMessage] = useState("");
    const [openModalFailed, setOpenModalFailed] = useState(false);
    const closeModalFailed = () => { setOpenModalFailed(false) };
    const [failedMessage, setFailedMessage] = useState("");
    const [openModalConfirm, setOpenModalConfirm] = useState(false);
    const [pendingAction, setPendingAction] = useState<"edit" | "delete" | "create" | null>(null);
    const [confirmMessage, setConfirmMessage] = useState("");
    const [isCreateMode, setIsCreateMode] = useState(false);
    const [selectedIdEditBC, setSelectedIdEditBC] = useState<number | null>(null);

    const handleClickEditBC = async (idBC: number) => {
        console.log("id: ", idBC)
        setLoading(true)
        setSelectedIdEditBC(idBC)
        const foundBC = budgetCategories.find((bc) => bc.id === idBC);
        console.log("foundBC: ", JSON.stringify(foundBC))
        if (foundBC) {
            setSelectedBC({
                id: foundBC.id,
                budget_id: foundBC.budget_id,
                budgets: {
                    id: foundBC.budgets.id,
                    periods: {
                        id: foundBC.budgets.periods.id,
                        name: foundBC.budgets.periods.name,
                        start_date: foundBC.budgets.periods.start_date,
                        end_date: foundBC.budgets.periods.end_date,
                    }
                },
                category_id: foundBC.category_id,
                categories: {
                    id: foundBC.categories.id,
                    name: foundBC.categories.name,
                    user_id: foundBC.categories.user_id,
                },
                amount: foundBC.amount,
            });
        }
        setOpenModalForm(true)
        setLoading(false)
        setSelectedIdEditBC(idBC);
    }

    const getBudgetCategories = async () => {
        try {
            if (!profile?.id) return;
            const getBudgetCategories = await fetch(`/api/budget-category?userId=${profile?.id}`, {
                method: "GET"
            });
            const res = await getBudgetCategories.json();
            if (res.data) {
                setBudgetCategories(res.data)
            }
            setLoading(false)
        } catch (err) {
            console.error(err);
        } finally {
        }
    }

    const fetchBudget = async () => {
        const getBudget = await fetch(`/api/budget?userId=${profile?.id}`);
        const res = await getBudget.json();
        if (res.data) {
            const dataBudget: Budget[] = res.data
            const today = new Date();
            const formattedOptions = dataBudget.map((b) => (
                {
                    value: String(b.id),
                    label: b?.periods?.name + " (" +
                        `${(today >= (new Date(b?.periods?.start_date)) && today <= (new Date(b?.periods?.end_date))) ? "active" : "inactive"}`
                        + ")",
                })).sort((a, b) => a.label.localeCompare(b.label));
            setBudgetOptions(formattedOptions);
        }
    }

    const fetchCategory = async () => {
        const getCategory = await fetch(`/api/category?userId=${profile?.id}`);
        const res = await getCategory.json();
        if (res.data) {
            const dataCategory: Select[] = res.data
            const formattedOptions = dataCategory.map((k) => ({
                value: String(k.id),
                label: k.name,
            })).sort((a, b) => a.label.localeCompare(b.label));
            setCategoryOptions(formattedOptions);
        }
    }

    const openModalCreate = () => {
        const firstBudget = budgetOptions.length > 0 ? budgetOptions[0] : null;
        const firstCategory = categoryOptions.length > 0 ? categoryOptions[0] : null;
        setSelectedBC({
            id: 0,
            budget_id: firstBudget ? Number(firstBudget.value) : -1,
            budgets: {
                id: firstBudget ? Number(firstBudget.value) : -1,
                periods: {
                    id: -1,
                    name: "",
                    start_date: "",
                    end_date: "",
                }
            },
            category_id: firstCategory ? Number(firstCategory.value) : -1,
            categories: {
                id: firstCategory ? Number(firstCategory.value) : -1,
                name: "",
                user_id: -1,
            },
            amount: 0,
        });
        setIsCreateMode(true);
        setOpenModalForm(true);
    }

    const closeModalForm = () => {
        getBudgetCategories();
        setOpenModalForm(false);
        setSelectedIdEditBC(null)
        setIsCreateMode(false);
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
            await handleSubmitEditBC();
        } else if (pendingAction === "delete") {
            await handleDeleteBC(selectedBC?.id ?? 0);
        } else if (pendingAction === "create") {
            await handleSubmitCreateBC();
        }
        setOpenModalConfirm(false);
        setPendingAction(null);
    };

    const handleSubmitEditBC = async (e?: React.FormEvent) => {
        setLoading(true);
        e?.preventDefault();
        console.log("selectedBC: " + JSON.stringify(selectedBC))
        try {
            if (!selectedBC || selectedBC?.id < 1 || selectedBC.budget_id < 1 || selectedBC.category_id < 1 || selectedBC.amount < 0) {
                setFailedMessage("fill all the required fields!");
                setOpenModalFailed(true);
                setLoading(false);
                return;
            }
            console.log(JSON.stringify({
                id: selectedBC.id,
                budget_id: selectedBC.budget_id,
                category_id: selectedBC.category_id,
                amount: selectedBC.amount
            }))
            const res = await fetch("/api/budget-category", {
                method: "PUT",
                body: JSON.stringify({
                    id: selectedBC.id,
                    budget_id: selectedBC.budget_id,
                    category_id: selectedBC.category_id,
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
            closeModalForm();
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
            closeModalForm();
            setLoading(false)
        }
    };

    const handleOpenConfirmCreate = () => {
        setConfirmMessage("are you sure you want to create this category?");
        setPendingAction("create");
        setOpenModalConfirm(true);
    };

    const handleSubmitCreateBC = async () => {
        setLoading(true);
        try {
            if (!selectedBC?.category_id || !selectedBC.amount) {
                setFailedMessage("fill all the required fields!");
                setOpenModalFailed(true);
                setLoading(false);
                return;
            }
            const res = await fetch("/api/budget-category", {
                method: "POST",
                body: JSON.stringify({
                    budget_id: selectedBC.budget_id,
                    category_id: selectedBC.category_id,
                    amount: selectedBC.amount,
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
            closeModalForm();
            setLoading(false);
            setIsCreateMode(false);
        }
    };

    useEffect(() => {
        setLoading(true)
        if (profile?.id) {
            getBudgetCategories()
            fetchCategory();
            fetchBudget();
        }
    }, [profile])

    return (
        <main className="flex flex-col items-center min-h-screen pt-20">
            {loading && <Loading />}
            <h1 className={`${pixelify.className} text-xl`}>
                budget categories
            </h1>
            <Button size="md" variant="outline" className={`${geistMono.className} min-w-[400px] cursor-pointer mt-6`} onClick={() => openModalCreate()}>
                <div className="flex flex-col">
                    <div className="flex flex-row items-center justify-center mb-1">
                        <svg id="plus-solid" width="20" height="20" fill="#FF6F91" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="23 11 23 13 22 13 22 14 14 14 14 22 13 22 13 23 11 23 11 22 10 22 10 14 2 14 2 13 1 13 1 11 2 11 2 10 10 10 10 2 11 2 11 1 13 1 13 2 14 2 14 10 22 10 22 11 23 11" /></svg>
                    </div>
                    add
                </div>
            </Button>
            {budgetCategories.length > 0 ? (
                budgetCategories.map((b) => {
                    const today = new Date();
                    const start = new Date(b.budgets.periods.start_date);
                    const end = new Date(b.budgets.periods.end_date);
                    const isActive = today >= start && today <= end;
                    return (
                        <Card
                            key={b.id}
                            title={b.categories.name}
                            className="min-w-[400px] outline-gray-400 hover:bg-pink-400 cursor-pointer mt-6"
                            onClick={() => handleClickEditBC(b.id)}
                        >
                            <div className="flex flex-col gap-1">
                                <span className="text-xs">period: {b.budgets.periods.name} ({isActive ? "active" : "inactive"})</span>
                                <span className="text-xs">
                                    amount: {formatRupiah(b.amount)}
                                </span>
                            </div>
                        </Card>
                    );
                })
            ) : (
                <div className={`flex flex-col items-center justify-center min-h-[100px] text-gray-500 ${geistMono.className}`}>
                    no budget categories found!
                </div>
            )}
            {openModalForm &&
                <FormModal
                    isOpen={openModalForm}
                    onClose={closeModalForm}
                    title={`${isCreateMode ? "create new" : "update"} budget category`}
                >
                    <form>
                        <div className="flex gap-4 items-center space-y-4">
                            <div className={`flex items-center ${geistMono.className} text-s w-[200px] text-start justify-start`}>
                                budget
                            </div>
                            <div className="flex-1">
                                <Select
                                    options={budgetOptions}
                                    placeholder="select budget..."
                                    defaultValue={selectedBC ? String(selectedBC?.budget_id) : ""}
                                    onChange={(val: string) =>
                                        setSelectedBC((prev) =>
                                            prev ? { ...prev, budget_id: Number(val), budgets: { ...prev.budgets, id: Number(val) } } : prev
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 items-center space-y-4">
                            <div className={`flex items-center ${geistMono.className} text-s w-[200px] text-start justify-start`}>
                                category
                            </div>
                            <div className="flex-1">
                                <Select
                                    options={categoryOptions}
                                    placeholder="select category..."
                                    defaultValue={selectedBC ? String(selectedBC?.category_id) : ""}
                                    onChange={(val: string) =>
                                        setSelectedBC((prev) =>
                                            prev ? { ...prev, category_id: Number(val), categories: { ...prev.categories, id: Number(val) } } : prev
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 items-center space-y-4">
                            <div className={`flex items-center ${geistMono.className} text-s w-[200px] text-start justify-start`}>
                                amount
                            </div>
                            <div className="flex-1">
                                <Input
                                    type="number"
                                    formatNumber={true}
                                    defaultValue={selectedBC?.amount}
                                    onChange={(e) => setSelectedBC((prev) =>
                                        prev ? { ...prev, amount: Number(e.target.value) } : prev
                                    )}>
                                </Input>
                            </div>
                        </div>
                        <div className="flex items-center justify-center py-6">
                            {isCreateMode ? (<>
                                <Button onClick={() => handleOpenConfirmCreate()} type="button" size="sm" variant="outline" className={`${geistMono.className} text-s cursor-pointer hover:underline hover:text-pink-600 mx-2`}>
                                    create
                                </Button>
                                <Button onClick={() => closeModalForm()} type="button" size="sm" variant="outline" className={`${geistMono.className} text-s cursor-pointer hover:underline hover:text-pink-600`}>
                                    cancel
                                </Button>
                            </>) : (<>
                                <Button onClick={() => handleOpenConfirmEdit()} type="button" size="sm" variant="outline" className={`${geistMono.className} text-s cursor-pointer hover:underline hover:text-pink-600 mx-2`}>
                                    update
                                </Button>
                                <Button type="button" onClick={() => handleOpenConfirmDelete()} size="sm" variant="outline" className={`${geistMono.className} text-s cursor-pointer hover:underline hover:text-pink-600`}>
                                    delete
                                </Button>
                            </>)}
                        </div>
                    </form>
                </FormModal>
            }
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
        </main>
    )
}