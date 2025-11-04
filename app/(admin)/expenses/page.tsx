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
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    interface Expense {
        id: number;
        description: string;
        amount: number;
        expense_date: string;
        budget_id: number;
        budgets: {
            periods: {
                name: string;
            }
        },
        category_id: number;
        categories: {
            name: string;
        },
        source_id: number;
        sources: {
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

    const { profile } = useProfile()
    const [loading, setLoading] = useState(false);
    const [expense, setExpense] = useState<Expense[]>([])
    const [openModalAdd, setOpenModalAdd] = useState(false);
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
    const [currentBudgetId, setCurrentBudgetId] = useState(0);
    const [summary, setSummary] = useState<Summary[]>([])

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

    const getCurrentPeriod = async () => {
        const cp = await checkCurrentPeriod(Number(profile?.id))
        if (cp) { setCurrentBudgetId(cp.data.budget_id) }
    }

    const handleClickCreateExpense = () => {
        setSelectedExpense({
            id: 0,
            description: "",
            amount: 0,
            expense_date: today,
            budget_id: -1,
            budgets: { periods: { name: "" } },
            category_id: -1,
            categories: { name: "" },
            source_id: -1,
            sources: { name: "" }
        });
        setOpenModalAdd(true)
    }

    const closeModalAdd = () => {
        setOpenModalAdd(false);
        getExpenses();
    }

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
            closeModalAdd();
            setLoading(false);
        }
    }

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
        setOpenModalConfirm(true);
    };

    const handleConfirmAction = async () => {
        await handleSubmitCreateExpense();
        setOpenModalConfirm(false);
    };

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
                    <div key={s.category_name} className={`${geistMono.className} ${geistMono.style} py-2 my-2 border shadow-xs max-w-[200px] sm:w-auto`}>
                        <h3 className="text-sm font-semibold py-1">{s.category_name}</h3>
                        <p className="text-xs py-2">Rp {s.sum_amount.toLocaleString("id-ID")}</p>
                        <p className="text-xs">{s.percentage_max_expense}% of budget's max expense</p>
                        {s.bc_limit && (<p className="text-xs">{s.percentage_bc_limit}% of category's budget</p>)}
                    </div>
                ))}
            </div>
            <div className="mt-2 items-center justify-center">
                <Button size="md" variant="outline" className={`${geistMono.className} min-w-[400px] cursor-pointer mt-6`} onClick={() => handleClickCreateExpense()}>
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
                {openModalAdd &&
                    <FormModal
                        isOpen={openModalAdd}
                        onClose={closeModalAdd}
                        title="add new expense"
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
                                        placeholder="enter your amount..."
                                        defaultValue={selectedExpense && selectedExpense?.amount >= 0 ? selectedExpense?.amount : ""}
                                        onChange={(e) => setSelectedExpense((prev) =>
                                            prev ? { ...prev, amount: Number(e.target.value) } : prev
                                        )}
                                        formatNumber={true}
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
                                                prev
                                                    ? {
                                                        ...prev,
                                                        budget_id: Number(val),
                                                        budgets: {
                                                            ...prev.budgets,
                                                            periods: { name: selectedLabel },
                                                        },
                                                    }
                                                    : prev
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
                            <div className="flex items-center justify-center py-6 gap-3">
                                <Button onClick={() => handleOpenConfirmCreate()} type="button" size="sm" variant="outline" className={`${geistMono.className} text-s cursor-pointer hover:underline hover:text-pink-600`}>
                                    create
                                </Button>
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