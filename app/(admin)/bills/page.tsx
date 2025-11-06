"use client"
import { Geist_Mono, Pixelify_Sans } from "next/font/google";
import Card from "../../components/card/Card";
import { useEffect, useState } from "react";
import { useProfile } from "../../context/ProfileContext";
import Loading from "../../components/common/Loading";
import moment from "moment";
import Button from "../../components/ui/button/Button";
import { formatRupiah } from "../../../lib/helpers/format";
import FormModal from "../../components/modals/FormModal";
import Input from "../../components/form/input/InputField";
import Select from "../../components/ui/select/Select";
import SimpleModal from "../../components/modals/SimpleModal";
import { checkExistingPeriod } from "../../../lib/helpers/period";
import { checkCurrentPeriod, checkExpense } from "../../../lib/helpers/expense";

const geistMono = Geist_Mono({
    variable: "--font-geist-sono",
    subsets: ["latin"],
    weight: ["200", "400"]
})

const pixelify = Pixelify_Sans({
    subsets: ["latin"],
    weight: ["400"],
});

export default function Bills() {
    // TYPES //
    type billStatus = "pending" | "overdue" | "done";

    // INTERFACES //
    interface Bill {
        id: number;
        budget_id: number;
        budgets: {
            id: number;
            periods: {
                id: number;
                name: string;
            }
        },
        category_id: number;
        categories: {
            id: number;
            name: string;
        },
        source_id: number;
        sources: {
            id: number;
            name: string;
        },
        description: string;
        amount: number;
        due_date: string;
        paid_date: string;
        recurrence_interval: string;
        status: billStatus;
    }
    interface Select {
        id: number,
        name: string;
    }
    interface Budget {
        id: number,
        periods: {
            name: string;
        }
    }

    // CONSTS //
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const recurrenceOptions = [
        { label: "daily", value: "daily" },
        { label: "weekly", value: "weekly" },
        { label: "monthly", value: "monthly" },
    ]
    const statusColors = {
        pending: "hover:bg-pink-300",
        overdue: "hover:bg-red-300",
        done: "hover:bg-green-300"
    };
    const { profile } = useProfile()
    const [loading, setLoading] = useState(false);
    const [bill, setBill] = useState<Bill[]>([])
    const [openModalForm, setOpenModalForm] = useState(false);
    const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);
    const [budgetOptions, setBudgetOptions] = useState<{ value: string; label: string }[]>([]);
    const [sourceOptions, setSourceOptions] = useState<{ value: string; label: string }[]>([]);
    const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
    const [openModalSuccess, setOpenModalSuccess] = useState(false);
    const closeModalSuccess = () => { setOpenModalSuccess(false) };
    const [successMessage, setSuccessMessage] = useState("");
    const [openModalFailed, setOpenModalFailed] = useState(false);
    const closeModalFailed = () => { setOpenModalFailed(false) };
    const [failedMessage, setFailedMessage] = useState("");
    const [openModalConfirm, setOpenModalConfirm] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState("");
    const [openModalWarning, setOpenModalWarning] = useState(false);
    const [warningMessage, setWarningMessage] = useState("");
    const [confirmExceedingBudget, setConfirmExceedingBudget] = useState(false);
    const [pendingAction, setPendingAction] = useState<"edit" | "delete" | "create" | null>(null);
    const [isCreateMode, setIsCreateMode] = useState(false);
    const [selectedIdEditBill, setSelectedIdEditBill] = useState<number | null>(null);

    // HANDLE CLICK CONFIRM
    const handleConfirmAction = async () => {
        if (pendingAction === "edit") {
            await handleSubmitEditBill();
        } else if (pendingAction === "delete") {
            await handleDeleteBill(selectedBill?.id ?? 0);
        } else if (pendingAction === "create") {
            await handleSubmitCreateBill();
        }
        setOpenModalConfirm(false);
        setPendingAction(null);
    };

    // HANDLE CLOSE MODAL FORM
    const closeModalForm = () => {
        getBills();
        setOpenModalForm(false);
        setSelectedIdEditBill(null);
        setIsCreateMode(false);
    }

    // HANDLE OPEN MODAL CREATE / EDIT
    const openModalCreate = () => {
        setSelectedBill({
            id: 0,
            budget_id: -1,
            budgets: { id: -1, periods: { id: -1, name: "" } },
            category_id: -1,
            categories: { id: -1, name: "" },
            source_id: -1,
            sources: { id: -1, name: "" },
            description: "",
            amount: 0,
            due_date: "",
            paid_date: "",
            recurrence_interval: "",
            status: "pending",
        });
        setIsCreateMode(true);
        setOpenModalForm(true);
    }
    const handleClickEditBill = async (id: number) => {
        console.log("id edit: ", id)
        setLoading(true)
        setSelectedIdEditBill(id)
        const foundBill = bill.find((b) => b.id === id);
        console.log("foundBill: ", JSON.stringify(foundBill))
        if (foundBill) {
            setSelectedBill({
                id: id,
                budget_id: foundBill?.budget_id,
                budgets: {
                    id: foundBill?.budgets?.id,
                    periods: {
                        id: foundBill?.budgets?.periods?.id,
                        name: foundBill?.budgets?.periods?.name,
                    }
                },
                category_id: foundBill?.category_id,
                categories: {
                    id: foundBill?.categories?.id,
                    name: foundBill?.categories?.name,
                },
                source_id: foundBill?.source_id,
                sources: {
                    id: foundBill?.sources?.id,
                    name: foundBill?.sources?.name,
                },
                description: foundBill?.description,
                amount: foundBill?.amount,
                due_date: foundBill?.due_date,
                paid_date: foundBill?.paid_date,
                recurrence_interval: foundBill?.recurrence_interval,
                status: foundBill?.status,
            })
        }
        setOpenModalForm(true);
        setLoading(false);
        setSelectedIdEditBill(id);
    }

    // FETCH INITIAL DATA //
    const getBills = async () => {
        try {
            if (!profile?.id) return;
            const getBill = await fetch(`/api/bills?userId=${profile?.id}`, {
                method: "GET"
            });
            const res = await getBill.json();
            if (res.data) {
                console.log("res.data: ", JSON.stringify(res.data))
                setBill(res.data)
            }
            setLoading(false)
        } catch (err) {
            console.error(err);
        } finally {
            console.log("bill setelah setbill: ", bill)
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
    const fetchBudget = async () => {
        const getBudget = await fetch(`/api/budget?userId=${profile?.id}`);
        const res = await getBudget.json();
        if (res.data) {
            const dataBudget: Budget[] = res.data
            let formattedOptions = dataBudget.map((k) => ({
                value: String(k.id),
                label: k?.periods?.name,
            })).sort((a, b) => a.label.localeCompare(b.label));
            formattedOptions.unshift({
                value: "",
                label: "no budget"
            })
            setBudgetOptions(formattedOptions);
        }
    }
    const fetchSource = async () => {
        const getSource = await fetch(`/api/source?userId=${profile?.id}`);
        const res = await getSource.json();
        if (res.data) {
            const dataSource: Select[] = res.data
            const formattedOptions = dataSource.map((k) => ({
                value: String(k.id),
                label: k.name,
            })).sort((a, b) => a.label.localeCompare(b.label));
            setSourceOptions(formattedOptions);
        }
    }

    // HANDLE CONFIRM FOR EACH ACTION //
    const handleOpenConfirmCreate = () => {
        if (!selectedBill?.description
            || selectedBill?.amount < 0
            || !selectedBill?.due_date
            || selectedBill?.category_id <= 0
            || selectedBill?.source_id <= 0
            || !selectedBill?.recurrence_interval
        ) {
            setFailedMessage("fill all the required fields!");
            setOpenModalFailed(true);
            setLoading(false);
            return;
        }
        setConfirmMessage("are you sure you want to create this bill?");
        setOpenModalConfirm(true);
    };
    const handleOpenConfirmEdit = () => {
        setConfirmMessage("are you sure you want to update this bill?");
        setPendingAction("edit");
        setOpenModalConfirm(true);
    };
    const handleOpenConfirmDelete = () => {
        setConfirmMessage("are you sure you want to delete this bill?");
        setPendingAction("delete");
        setOpenModalConfirm(true);
    };

    // HANDLE SUBMIT FUNCTIONS //
    const handleSubmitCreateBill = async () => {
        setLoading(true);
        try {
            if (!selectedBill?.description
                || selectedBill?.amount < 0
                || !selectedBill?.due_date
                || selectedBill?.category_id <= 0
                || selectedBill?.source_id <= 0
                || !selectedBill?.recurrence_interval
            ) {
                setFailedMessage("fill all the required fields!");
                setOpenModalFailed(true);
                setLoading(false);
                return;
            }
            if (!confirmExceedingBudget && selectedBill?.budget_id) {
                const checkExpenseBudget = await checkExpense(Number(profile?.id), selectedBill?.budget_id, selectedBill?.amount, selectedBill?.category_id)
                if (checkExpenseBudget.isExceeding) {
                    setWarningMessage(checkExpenseBudget?.message);
                    setOpenModalWarning(true);
                }
            }
            const res = await fetch("/api/bills", {
                method: "POST",
                body: JSON.stringify({
                    user_id: profile?.id,
                    budget_id: selectedBill?.budget_id ?? null,
                    category_id: selectedBill?.category_id,
                    description: selectedBill?.description,
                    amount: selectedBill?.amount,
                    due_date: selectedBill?.due_date,
                    source_id: selectedBill?.source_id
                })
            })
            const data = await res.json();
            if (res.ok) {
                setSuccessMessage("success");
                setOpenModalSuccess(true);
            } else {
                setFailedMessage(data.message);
                setOpenModalFailed(true);
            }
        } catch (err) {
            console.error(err)
        } finally {
            setConfirmExceedingBudget(false);
            closeModalForm();
            setLoading(false);
        }
    }
    const handleSubmitEditBill = async (e?: React.FormEvent) => {
        setLoading(true);
        e?.preventDefault();
        console.log("selectedBill: " + JSON.stringify(selectedBill))
        try {
            if (!selectedBill
                || selectedBill?.id < 1
                || !selectedBill?.description
                || selectedBill?.amount < 0
                || !selectedBill?.due_date
                || selectedBill?.category_id <= 0
                || selectedBill?.source_id <= 0
                || !selectedBill?.recurrence_interval
            ) {
                setFailedMessage("fill all the required fields!");
                setOpenModalFailed(true);
                setLoading(false);
                return;
            }
            if (!confirmExceedingBudget && selectedBill?.budget_id) {
                const checkExpenseBudget = await checkExpense(Number(profile?.id), selectedBill?.budget_id, selectedBill?.amount, selectedBill?.category_id)
                if (checkExpenseBudget.isExceeding) {
                    setWarningMessage(checkExpenseBudget?.message);
                    setOpenModalWarning(true);
                }
            }
            const res = await fetch("/api/bills", {
                method: "POST",
                body: JSON.stringify({
                    user_id: profile?.id,
                    budget_id: selectedBill?.budget_id ?? null,
                    category_id: selectedBill?.category_id,
                    description: selectedBill?.description,
                    amount: selectedBill?.amount,
                    due_date: selectedBill?.due_date,
                    source_id: selectedBill?.source_id
                })
            })
            const data = await res.json();
            if (res.ok) {
                setSuccessMessage("success");
                setOpenModalSuccess(true);
            } else {
                setFailedMessage(data.message);
                setOpenModalFailed(true);
            }
        } catch (err) {
            console.error(err)
        } finally {
            setConfirmExceedingBudget(false);
            closeModalForm();
            setLoading(false);
        }
    }
    const handleDeleteBill = async (id: number) => {
        setLoading(true);
        console.log("selectedBill: " + JSON.stringify(selectedBill))
        try {
            if (!id || id === 0) {
                setFailedMessage("fill all the required fields!");
                setOpenModalFailed(true);
                setLoading(false);
                return;
            }
            const res = await fetch(`/api/bills?id=${id}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (res.ok) {
                setSuccessMessage("success delete bill!");
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

    // USE EFFECTS //
    useEffect(() => {
        setLoading(true)
        if (profile?.id) {
            getBills();
            fetchCategory();
            fetchBudget();
            fetchSource();
        }
    }, [profile])

    return (
        <main className="flex flex-col items-center min-h-screen pt-20 gap-10">
            {loading && <Loading />}
            <div className="mt-2 items-center justify-center">
                <Button size="md" variant="outline" className={`${geistMono.className} min-w-[400px] cursor-pointer mt-6`} onClick={() => openModalCreate()}>
                    <div className="flex flex-col">
                        <div className="flex flex-row items-center justify-center mb-1">
                            <svg id="plus-solid" width="20" height="20" fill="#FF6F91" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="23 11 23 13 22 13 22 14 14 14 14 22 13 22 13 23 11 23 11 22 10 22 10 14 2 14 2 13 1 13 1 11 2 11 2 10 10 10 10 2 11 2 11 1 13 1 13 2 14 2 14 10 22 10 22 11 23 11" /></svg>
                        </div>
                        add
                    </div>
                </Button>
                {bill.length > 0 ? (
                    bill.map((b) => {
                        return (
                            <Card
                                key={b.id}
                                title={b.description}
                                desc={formatRupiah(b.amount)}
                                className={`min-w-[400px] outline-gray-400 cursor-pointer mt-6 ${statusColors[b?.status] || ""}`}
                                onClick={() => handleClickEditBill(b.id)}
                            >
                                <div className="flex flex-col">
                                    {b.status === "done" && (
                                        <span className="text-xs">
                                            paid: {moment(new Date(b.paid_date)).format("D MMMM YYYY")}
                                        </span>
                                    )}
                                    <span className="text-xs">
                                        due: {moment(new Date(b.due_date)).format("D MMMM YYYY")} ({b.status})
                                    </span>
                                </div>
                                <div className="flex flex-row justify-between text-xs mt-2">
                                    <div className="w-1/2">
                                        <div className="flex flex-col">
                                            <span className="text-gray-500">category:</span>
                                            <span>{b.categories?.name}</span>
                                        </div>
                                    </div>
                                    <div className="w-1/2">
                                        <div className="flex flex-col">
                                            <span className="text-gray-500">source:</span>
                                            <span>{b.sources?.name}</span>
                                        </div>
                                    </div>
                                    <div className="w-1/3">
                                        <div className="flex flex-col">
                                            <span className="text-gray-500">recurrence:</span>
                                            <span>{recurrenceOptions.find((r) => r.value === b.recurrence_interval)?.label}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row justify-between text-xs mt-2">
                                    <div className="w-1/2">
                                        {b?.budgets?.periods && (
                                            <div className="flex flex-col">
                                                <span className="text-gray-500">budget:</span>
                                                <span>{b.budgets?.periods?.name}</span>
                                            </div>)}
                                    </div>
                                </div>
                            </Card>
                        );
                    })
                ) : (
                    <div className={`flex flex-col items-center justify-center min-h-[100px] text-gray-500 ${geistMono.className}`}>
                        no bills found!
                    </div>
                )}
                {openModalForm &&
                    <FormModal
                        isOpen={openModalForm}
                        onClose={closeModalForm}
                        title={`${isCreateMode ? "create new" : "update"} bill`}
                    >
                        <form>
                            <div className="flex gap-4 items-center space-y-4">
                                <div className={`flex items-center ${geistMono.className} text-s w-[200px] text-start justify-start`}>
                                    budget (optional)
                                </div>
                                <div className="flex-1">
                                    <Select
                                        options={budgetOptions}
                                        placeholder="select budget..."
                                        defaultValue={selectedBill && selectedBill?.budget_id >= 0 ? String(selectedBill?.budget_id) : ""}
                                        onChange={(val: string) => {
                                            const selectedLabel = budgetOptions.find((opt) => opt.value === val)?.label || "";
                                            setSelectedBill((prev) =>
                                                prev ? { ...prev, budget_id: Number(val), budgets: { ...prev.budgets, id: Number(val) } } : prev
                                            );
                                        }}
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
                                        defaultValue={selectedBill && selectedBill?.category_id >= 0 ? String(selectedBill.category_id) : ""}
                                        onChange={(val: string) =>
                                            setSelectedBill((prev) =>
                                                prev
                                                    ? {
                                                        ...prev,
                                                        category_id: Number(val),
                                                        categories: {
                                                            ...prev.categories,
                                                            name: categoryOptions.find((opt) => opt.value === val)?.label || "",
                                                        },
                                                    }
                                                    : prev
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 items-center space-y-4">
                                <div className={`flex items-center ${geistMono.className} text-s w-[200px] text-start justify-start`}>
                                    source
                                </div>
                                <div className="flex-1">
                                    <Select
                                        options={sourceOptions}
                                        placeholder="select source..."
                                        defaultValue={selectedBill && selectedBill?.source_id >= 0 ? String(selectedBill.source_id) : ""}
                                        onChange={(val: string) =>
                                            setSelectedBill((prev) =>
                                                prev
                                                    ? {
                                                        ...prev,
                                                        source_id: Number(val),
                                                        sources: {
                                                            ...prev.sources,
                                                            name: sourceOptions.find((opt) => opt.value === val)?.label || "",
                                                        },
                                                    }
                                                    : prev
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 items-center space-y-4">
                                <div className={`flex items-center ${geistMono.className} text-s w-[200px] text-start justify-start`}>
                                    description
                                </div>
                                <div className="flex-1">
                                    <Input
                                        type="text"
                                        placeholder="enter bill's description..."
                                        defaultValue={selectedBill?.description}
                                        onChange={(e) => setSelectedBill((prev) =>
                                            prev ? { ...prev, description: e.target.value } : prev
                                        )}>
                                    </Input>
                                </div>
                            </div>
                            <div className="flex gap-4 items-center space-y-4">
                                <div className={`flex items-center ${geistMono.className} text-s w-[200px] text-start justify-start`}>
                                    amount
                                </div>
                                <div className="flex-1">
                                    <Input
                                        type="number"
                                        placeholder="enter bill's amount..."
                                        defaultValue={selectedBill && selectedBill?.amount >= 0 ? selectedBill?.amount : ""}
                                        onChange={(e) => setSelectedBill((prev) =>
                                            prev ? { ...prev, amount: Number(e.target.value) } : prev
                                        )}
                                        formatNumber={true}
                                    ></Input>
                                </div>
                            </div>
                            <div className="flex gap-4 items-center space-y-4">
                                <div className={`flex items-center ${geistMono.className} text-s w-[200px] text-start justify-start`}>
                                    due date
                                </div>
                                <div className="flex-1">
                                    <Input
                                        type="date"
                                        placeholder="enter the due date of bills..."
                                        defaultValue={selectedBill?.due_date ?? today}
                                        onChange={(e) => setSelectedBill((prev) =>
                                            prev ? { ...prev, bills_date: e.target.value } : prev
                                        )}>
                                    </Input>
                                </div>
                            </div>
                            <div className="flex gap-4 items-center space-y-4">
                                <div className={`flex items-center ${geistMono.className} text-s w-[200px] text-start justify-start`}>
                                    recurrence
                                </div>
                                <div className="flex-1">
                                    <Select
                                        options={recurrenceOptions}
                                        placeholder="select recurrence..."
                                        defaultValue={selectedBill?.recurrence_interval ?? ""}
                                        onChange={(val: string) =>
                                            setSelectedBill((prev) => prev ? { ...prev, recurrence_interval: val } : prev)
                                        }
                                    />
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
            </div>
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
            {openModalWarning && (
                <SimpleModal
                    type={"warning"}
                    isOpen={openModalWarning}
                    onClose={() => setOpenModalWarning(false)}
                    message={warningMessage}
                    yesButton
                    yesButtonText="yes"
                    handleYes={() => { setConfirmExceedingBudget(true); handleConfirmAction(); }}
                    noButton
                    noButtonText="cancel"
                    handleNo={() => setOpenModalWarning(false)}
                />
            )}
        </main>
    );
}