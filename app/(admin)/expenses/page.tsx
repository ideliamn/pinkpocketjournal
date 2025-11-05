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

export default function Expenses() {
    // INTERFACE //
    interface Expense {
        id: number;
        description: string;
        amount: number;
        expense_date: string;
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
        }
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
    interface Summary {
        sum_amount: number,
        category_name: string,
        bc_limit: number,
        max_expense: number,
        percentage_bc_limit: number,
        percentage_max_expense: number
    }

    // CONST //
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const { profile } = useProfile()
    const [loading, setLoading] = useState(false);
    const [expense, setExpense] = useState<Expense[]>([])
    const [openModalForm, setOpenModalForm] = useState(false);
    const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);
    const [budgetOptions, setBudgetOptions] = useState<{ value: string; label: string }[]>([]);
    const [sourceOptions, setSourceOptions] = useState<{ value: string; label: string }[]>([]);
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
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
    const [selectedIdEditExpense, setSelectedIdEditExpense] = useState<number | null>(null);
    const [currentBudgetId, setCurrentBudgetId] = useState(0);
    const [summary, setSummary] = useState<Summary[]>([])

    // HANDLE CLICK CONFIRM
    const handleConfirmAction = async () => {
        if (pendingAction === "edit") {
            await handleSubmitEditExpense();
        } else if (pendingAction === "delete") {
            await handleDeleteExpense(selectedExpense?.id ?? 0);
        } else if (pendingAction === "create") {
            await handleSubmitCreateExpense();
        }
        setOpenModalConfirm(false);
        setPendingAction(null);
    };

    // HANDLE CLOSE MODAL FORM
    const closeModalForm = () => {
        getExpenses();
        fetchSummary();
        setOpenModalForm(false);
        setSelectedIdEditExpense(null);
        setIsCreateMode(false);
    }

    // GET CURRENT PERIOD
    const getCurrentPeriod = async () => {
        const cp = await checkCurrentPeriod(Number(profile?.id))
        if (cp) { setCurrentBudgetId(cp.data.budget_id) }
    }

    // HANDLE OPEN MODAL CREATE / EDIT
    const openModalCreate = () => {
        setSelectedExpense({
            id: 0,
            description: "",
            amount: 0,
            expense_date: today,
            budget_id: -1,
            budgets: { id: -1, periods: { id: -1, name: "" } },
            category_id: -1,
            categories: { id: -1, name: "" },
            source_id: -1,
            sources: { id: -1, name: "" }
        });
        setIsCreateMode(true);
        setOpenModalForm(true)
    }
    const handleClickEditExpense = async (id: number) => {
        console.log("id edit: ", id)
        setLoading(true)
        setSelectedIdEditExpense(id)
        const foundExpense = expense.find((e) => e.id === id);
        console.log("foundExpense: ", JSON.stringify(foundExpense))
        if (foundExpense) {
            setSelectedExpense({
                id: id,
                description: foundExpense.description,
                amount: foundExpense.amount,
                expense_date: foundExpense.expense_date,
                budget_id: foundExpense.budget_id,
                budgets: {
                    id: foundExpense.budgets.id,
                    periods: {
                        id: foundExpense.budgets.periods.id,
                        name: foundExpense.budgets.periods.name,
                    }
                },
                category_id: foundExpense.category_id,
                categories: {
                    id: foundExpense.categories.id,
                    name: foundExpense.categories.name,
                },
                source_id: foundExpense.source_id,
                sources: {
                    id: foundExpense.sources.id,
                    name: foundExpense.sources.name,
                }
            })
        }
        setOpenModalForm(true);
        setLoading(false);
        setSelectedIdEditExpense(id);
    }

    // FETCH INITIAL DATA //
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
            const formattedOptions = dataBudget.map((k) => ({
                value: String(k.id),
                label: k?.periods?.name,
            })).sort((a, b) => a.label.localeCompare(b.label));
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
    const fetchSummary = async () => {
        const getSummary = await fetch(`/api/expense/summary?budgetId=${currentBudgetId}`);
        const res = await getSummary.json();
        if (res.data) {
            const dataSummary: Summary[] = res.data
            setSummary(dataSummary)
        }
    }

    // HANDLE CONFIRM FOR EACH ACTION
    const handleOpenConfirmCreate = () => {
        if (!selectedExpense?.description
            || !selectedExpense?.amount
            || !selectedExpense?.expense_date
            || !selectedExpense?.budget_id
            || !selectedExpense?.category_id
            || !selectedExpense?.source_id
        ) {
            setFailedMessage("fill all the required fields!");
            setOpenModalFailed(true);
            setLoading(false);
            return;
        }
        setConfirmMessage("are you sure you want to create this expense?");
        setPendingAction("create");
        setOpenModalConfirm(true);
    };
    const handleOpenConfirmEdit = () => {
        setConfirmMessage("are you sure you want to update this expense?");
        setPendingAction("edit");
        setOpenModalConfirm(true);
    };
    const handleOpenConfirmDelete = () => {
        setConfirmMessage("are you sure you want to delete this expense?");
        setPendingAction("delete");
        setOpenModalConfirm(true);
    };

    // HANDLE SUBMIT FUNCTIONS
    const handleSubmitCreateExpense = async () => {
        console.log("submit!")
        setLoading(true);
        try {
            if (!selectedExpense?.description
                || selectedExpense?.amount < 0
                || !selectedExpense?.expense_date
                || selectedExpense?.budget_id <= 0
                || selectedExpense?.category_id <= 0
                || selectedExpense?.source_id <= 0
            ) {
                setFailedMessage("fill all the required fields!");
                setOpenModalFailed(true);
                setLoading(false);
                return;
            }
            if (!confirmExceedingBudget) {
                const checkExpenseBudget = await checkExpense(Number(profile?.id), selectedExpense?.budget_id, selectedExpense?.amount, selectedExpense?.category_id)
                if (checkExpenseBudget.isExceeding) {
                    setWarningMessage(checkExpenseBudget?.message);
                    setOpenModalWarning(true);
                }
            }
            const res = await fetch("/api/expense", {
                method: "POST",
                body: JSON.stringify({
                    user_id: profile?.id,
                    budget_id: selectedExpense?.budget_id,
                    category_id: selectedExpense?.category_id,
                    description: selectedExpense?.description,
                    amount: selectedExpense?.amount,
                    expense_date: selectedExpense?.expense_date,
                    source_id: selectedExpense?.source_id
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
    const handleSubmitEditExpense = async (e?: React.FormEvent) => {
        setLoading(true);
        e?.preventDefault();
        console.log("selectedExpense: " + JSON.stringify(selectedExpense))
        try {
            if (!selectedExpense
                || selectedExpense?.id < 1
                || !selectedExpense?.description
                || !selectedExpense?.amount
                || !selectedExpense?.expense_date
                || !selectedExpense?.budget_id
                || !selectedExpense?.category_id
                || !selectedExpense?.source_id) {
                setFailedMessage("fill all the required fields!");
                setOpenModalFailed(true);
                setLoading(false);
                return;
            }
            const res = await fetch("/api/expense", {
                method: "PUT",
                body: JSON.stringify({
                    id: selectedExpense?.id,
                    user_id: profile?.id,
                    budget_id: selectedExpense?.budget_id,
                    category_id: selectedExpense?.category_id,
                    description: selectedExpense?.description,
                    amount: selectedExpense?.amount,
                    expense_date: selectedExpense?.expense_date,
                    source_id: selectedExpense?.source_id
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setSuccessMessage("success update expense!");
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
    const handleDeleteExpense = async (id: number) => {
        setLoading(true);
        console.log("selectedExpense: " + JSON.stringify(selectedExpense))
        try {
            if (!id || id === 0) {
                setFailedMessage("fill all the required fields!");
                setOpenModalFailed(true);
                setLoading(false);
                return;
            }
            const res = await fetch(`/api/expense?id=${id}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (res.ok) {
                setSuccessMessage("success delete expense!");
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

    // USE EFFECTS
    useEffect(() => {
        setLoading(true)
        if (profile?.id) {
            getExpenses();
            fetchCategory();
            fetchBudget();
            fetchSource();
            getCurrentPeriod();
        }
    }, [profile])
    useEffect(() => {
        if (currentBudgetId > 0) { fetchSummary() }
    }, [currentBudgetId > 0])

    return (
        <main className="flex flex-col items-center min-h-screen pt-20 gap-10">
            {loading && <Loading />}
            <h1 className={`${pixelify.className} text-xl`}>
                expenses
            </h1>
            <div className="flex flex-wrap justify-center gap-x-3 text-center px-6">
                {summary.map((s) => (
                    <div key={s.category_name} className={`${geistMono.className} ${geistMono.style} px-3 py-2 my-2 border shadow-xs max-w-[300px] sm:w-auto`}>
                        <h3 className="text-sm font-semibold py-1">{s.category_name}</h3>
                        <p className="text-xs py-2">Rp {s.sum_amount.toLocaleString("id-ID")}</p>
                        <p className="text-xs">{s.percentage_max_expense}% of budget's max expense</p>
                        {s.bc_limit && (<p className="text-xs">{s.percentage_bc_limit}% of category's budget</p>)}
                    </div>
                ))}
            </div>
            <div className="mt-2 items-center justify-center">
                <Button size="md" variant="outline" className={`${geistMono.className} min-w-[400px] cursor-pointer mt-6`} onClick={() => openModalCreate()}>
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
                                desc={formatRupiah(e.amount)}
                                className="min-w-[400px] outline-gray-400 hover:bg-pink-400 cursor-pointer mt-6"
                                onClick={() => handleClickEditExpense(e.id)}
                            >
                                <span className="text-xs">
                                    {moment(new Date(e.expense_date)).format('dddd').substring(0, 3) + ", " + moment(new Date(e.expense_date)).format("D MMMM YYYY")}
                                </span>
                                <div className="flex flex-row justify-between text-xs mt-2">
                                    <div className="w-1/2">
                                        <div className="flex flex-col">
                                            <span className="text-gray-500">category:</span>
                                            <span>{e.categories?.name}</span>
                                        </div>
                                    </div>
                                    <div className="w-1/2">
                                        <div className="flex flex-col">
                                            <span className="text-gray-500">source:</span>
                                            <span>{e.sources?.name}</span>
                                        </div>
                                    </div>
                                    <div className="w-1/3">
                                        <div className="flex flex-col">
                                            <span className="text-gray-500">budget:</span>
                                            <span>{e.budgets?.periods?.name}</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })
                ) : (
                    <div className={`flex flex-col items-center justify-center min-h-[100px] text-gray-500 ${geistMono.className}`}>
                        no expenses found!
                    </div>
                )}
                {openModalForm &&
                    <FormModal
                        isOpen={openModalForm}
                        onClose={closeModalForm}
                        title={`${isCreateMode ? "create new" : "update"} expense`}
                    >
                        <form>
                            <div className="flex gap-4 items-center space-y-4">
                                <div className={`flex items-center ${geistMono.className} text-s w-[200px] text-start justify-start`}>
                                    description
                                </div>
                                <div className="flex-1">
                                    <Input
                                        type="text"
                                        placeholder="enter your description..."
                                        defaultValue={selectedExpense?.description}
                                        onChange={(e) => setSelectedExpense((prev) =>
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
                                        formatNumber={true}
                                        placeholder="enter your amount..."
                                        defaultValue={selectedExpense && selectedExpense?.amount >= 0 ? selectedExpense?.amount : ""}
                                        onChange={(e) => setSelectedExpense((prev) =>
                                            prev ? { ...prev, amount: Number(e.target.value) } : prev
                                        )}
                                    ></Input>
                                </div>
                            </div>
                            <div className="flex gap-4 items-center space-y-4">
                                <div className={`flex items-center ${geistMono.className} text-s w-[200px] text-start justify-start`}>
                                    date
                                </div>
                                <div className="flex-1">
                                    <Input
                                        type="date"
                                        placeholder="enter your date of expense..."
                                        defaultValue={selectedExpense?.expense_date ?? today}
                                        onChange={(e) => setSelectedExpense((prev) =>
                                            prev ? { ...prev, expense_date: e.target.value } : prev
                                        )}>
                                    </Input>
                                </div>
                            </div>
                            <div className="flex gap-4 items-center space-y-4">
                                <div className={`flex items-center ${geistMono.className} text-s w-[200px] text-start justify-start`}>
                                    budget
                                </div>
                                <div className="flex-1">
                                    <Select
                                        options={budgetOptions}
                                        placeholder="select budget..."
                                        defaultValue={selectedExpense && selectedExpense?.budget_id >= 0 ? String(selectedExpense?.budget_id) : ""}
                                        onChange={(val: string) => {
                                            const selectedLabel = budgetOptions.find((opt) => opt.value === val)?.label || "";
                                            setSelectedExpense((prev) =>
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
                                        defaultValue={selectedExpense && selectedExpense?.category_id >= 0 ? String(selectedExpense.category_id) : ""}
                                        onChange={(val: string) =>
                                            setSelectedExpense((prev) =>
                                                prev ? { ...prev, category_id: Number(val), categories: { ...prev.categories, id: Number(val) } } : prev
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
                                        defaultValue={selectedExpense && selectedExpense?.source_id >= 0 ? String(selectedExpense.source_id) : ""}
                                        onChange={(val: string) =>
                                            setSelectedExpense((prev) =>
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