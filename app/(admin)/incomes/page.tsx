"use client"
import { Geist_Mono, Pixelify_Sans } from "next/font/google";
import Card from "../../components/card/Card";
import { useCallback, useEffect, useState } from "react";
import { useProfile } from "../../context/ProfileContext";
import Loading from "../../components/common/Loading";
import moment from "moment";
import Button from "../../components/ui/button/Button";
import { formatRupiah } from "../../../lib/helpers/format";
import FormModal from "../../components/modals/FormModal";
import Input from "../../components/form/input/InputField";
import Select from "../../components/ui/select/Select";
import SimpleModal from "../../components/modals/SimpleModal";
import { checkExpense } from "../../../lib/helpers/expense";

const geistMono = Geist_Mono({
    variable: "--font-geist-sono",
    subsets: ["latin"],
    weight: ["200", "400"]
})

const pixelify = Pixelify_Sans({
    subsets: ["latin"],
    weight: ["400"],
});

export default function Incomes() {
    // INTERFACE //
    interface Income {
        id: number;
        description: string;
        amount: number;
        income_date: string;
        plan_id: number;
        plans: {
            id: number;
            name: string;
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
    interface Plan {
        id: number,
        name: string;
    }

    // CONST //
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const { profile } = useProfile()
    const [loading, setLoading] = useState(false);
    const [income, setIncome] = useState<Income[]>([])
    const [openModalForm, setOpenModalForm] = useState(false);
    const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);
    const [planOptions, setPlanOptions] = useState<{ value: string; label: string }[]>([]);
    const [sourceOptions, setSourceOptions] = useState<{ value: string; label: string }[]>([]);
    const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);
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
    const [confirmExceedingPlan, setConfirmExceedingPlan] = useState(false);
    const [pendingAction, setPendingAction] = useState<"edit" | "delete" | "create" | null>(null);
    const [isCreateMode, setIsCreateMode] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // HANDLE CLICK CONFIRM
    const handleConfirmAction = async () => {
        if (pendingAction === "edit") {
            await handleSubmitEditIncome();
        } else if (pendingAction === "delete") {
            await handleDeleteIncome(selectedIncome?.id ?? 0);
        } else if (pendingAction === "create") {
            await handleSubmitCreateIncome();
        }
        setOpenModalConfirm(false);
        setPendingAction(null);
    };

    // HANDLE CLOSE MODAL FORM
    const closeModalForm = () => {
        getIncomes();
        setOpenModalForm(false);
        setIsCreateMode(false);
    }

    // GET CURRENT PERIOD

    // HANDLE OPEN MODAL CREATE / EDIT
    const openModalCreate = () => {
        setSelectedIncome({
            id: 0,
            description: "",
            amount: 0,
            income_date: today,
            plan_id: -1,
            plans: { id: -1, name: "" },
            category_id: -1,
            categories: { id: -1, name: "" },
            source_id: -1,
            sources: { id: -1, name: "" }
        });
        setIsCreateMode(true);
        setOpenModalForm(true)
    }
    const handleClickEditIncome = async (id: number) => {
        console.log("id edit: ", id)
        setLoading(true)
        const foundIncome = income.find((e) => e.id === id);
        console.log("foundIncome: ", JSON.stringify(foundIncome))
        if (foundIncome) {
            setSelectedIncome({
                id: id,
                description: foundIncome.description,
                amount: foundIncome.amount,
                income_date: foundIncome.income_date,
                plan_id: foundIncome.plan_id,
                plans: {
                    id: foundIncome.plans.id,
                    name: foundIncome.plans.name
                },
                category_id: foundIncome.category_id,
                categories: {
                    id: foundIncome.categories.id,
                    name: foundIncome.categories.name,
                },
                source_id: foundIncome.source_id,
                sources: {
                    id: foundIncome.sources.id,
                    name: foundIncome.sources.name,
                }
            })
        }
        setOpenModalForm(true);
        setLoading(false);
    }

    // FETCH INITIAL DATA //
    const getIncomes = useCallback(async (pageNum = 1) => {
        setLoading(true);
        try {
            if (!profile?.id) return;
            const getIncome = await fetch(`/api/income?userId=${profile?.id}&page=${pageNum}&limit=10`, {
                method: "GET"
            });
            const res = await getIncome.json();
            if (res.data) {
                console.log("res.data: ", JSON.stringify(res.data))
                setIncome(res.data)
                setPage(res.currentPage);
                setTotalPages(res.totalPages);
            }
            setLoading(false)
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error(err.message);
            } else {
                console.error("Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    }, [profile]);

    const fetchCategory = useCallback(async () => {
        const getCategory = await fetch(`/api/category?userId=${profile?.id}&type=income`);
        const res = await getCategory.json();
        if (res.data) {
            const dataCategory: Select[] = res.data
            const formattedOptions = dataCategory.map((k) => ({
                value: String(k.id),
                label: k.name,
            })).sort((a, b) => a.label.localeCompare(b.label));
            setCategoryOptions(formattedOptions);
        }
    }, [profile])

    const fetchPlan = useCallback(async () => {
        const getPlan = await fetch(`/api/plan?userId=${profile?.id}`);
        const res = await getPlan.json();
        if (res.data) {
            const dataPlan: Plan[] = res.data
            const formattedOptions = dataPlan.map((k) => ({
                value: String(k.id),
                label: k?.name,
            })).sort((a, b) => a.label.localeCompare(b.label));
            setPlanOptions(formattedOptions);
        }
    }, [profile]);

    const fetchSource = useCallback(async () => {
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
    }, [profile]);

    // HANDLE CONFIRM FOR EACH ACTION
    const handleOpenConfirmCreate = () => {
        if (!selectedIncome?.description
            || !selectedIncome?.amount
            || !selectedIncome?.income_date
            || !selectedIncome?.plan_id
            || !selectedIncome?.category_id
            || !selectedIncome?.source_id
        ) {
            setFailedMessage("fill all the required fields!");
            setOpenModalFailed(true);
            setLoading(false);
            return;
        }
        setConfirmMessage("are you sure you want to create this income?");
        setPendingAction("create");
        setOpenModalConfirm(true);
    };
    const handleOpenConfirmEdit = () => {
        setConfirmMessage("are you sure you want to update this income?");
        setPendingAction("edit");
        setOpenModalConfirm(true);
    };
    const handleOpenConfirmDelete = () => {
        setConfirmMessage("are you sure you want to delete this income?");
        setPendingAction("delete");
        setOpenModalConfirm(true);
    };

    // HANDLE SUBMIT FUNCTIONS
    const handleSubmitCreateIncome = async () => {
        console.log("submit!")
        setLoading(true);
        try {
            if (!selectedIncome?.description
                || selectedIncome?.amount < 0
                || !selectedIncome?.income_date
                || selectedIncome?.plan_id <= 0
                || selectedIncome?.category_id <= 0
                || selectedIncome?.source_id <= 0
            ) {
                setFailedMessage("fill all the required fields!");
                setOpenModalFailed(true);
                setLoading(false);
                return;
            }
            if (!confirmExceedingPlan) {
                const checkIncomePlan = await checkExpense(Number(profile?.id), selectedIncome?.plan_id, selectedIncome?.amount, selectedIncome?.category_id)
                if (checkIncomePlan.isExceeding) {
                    setWarningMessage(checkIncomePlan?.message);
                    setOpenModalWarning(true);
                }
            }
            const res = await fetch("/api/income", {
                method: "POST",
                body: JSON.stringify({
                    user_id: profile?.id,
                    plan_id: selectedIncome?.plan_id,
                    category_id: selectedIncome?.category_id,
                    description: selectedIncome?.description,
                    amount: selectedIncome?.amount,
                    income_date: selectedIncome?.income_date,
                    source_id: selectedIncome?.source_id
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
            setConfirmExceedingPlan(false);
            closeModalForm();
            setLoading(false);
        }
    }
    const handleSubmitEditIncome = async (e?: React.FormEvent) => {
        setLoading(true);
        e?.preventDefault();
        console.log("selectedIncome: " + JSON.stringify(selectedIncome))
        try {
            if (!selectedIncome
                || selectedIncome?.id < 1
                || !selectedIncome?.description
                || !selectedIncome?.amount
                || !selectedIncome?.income_date
                || !selectedIncome?.plan_id
                || !selectedIncome?.category_id
                || !selectedIncome?.source_id) {
                setFailedMessage("fill all the required fields!");
                setOpenModalFailed(true);
                setLoading(false);
                return;
            }
            const res = await fetch("/api/income", {
                method: "PUT",
                body: JSON.stringify({
                    id: selectedIncome?.id,
                    user_id: profile?.id,
                    plan_id: selectedIncome?.plan_id,
                    category_id: selectedIncome?.category_id,
                    description: selectedIncome?.description,
                    amount: selectedIncome?.amount,
                    income_date: selectedIncome?.income_date,
                    source_id: selectedIncome?.source_id
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setSuccessMessage("success update income!");
                setLoading(false);
                setOpenModalSuccess(true);
            } else {
                setFailedMessage(data.message);
                setLoading(false);
                setOpenModalFailed(true);
            }
        } catch (err: unknown) {
            console.error(err)
        } finally {
            closeModalForm();
            setLoading(false)
        }
    };
    const handleDeleteIncome = async (id: number) => {
        setLoading(true);
        console.log("selectedIncome: " + JSON.stringify(selectedIncome))
        try {
            if (!id || id === 0) {
                setFailedMessage("fill all the required fields!");
                setOpenModalFailed(true);
                setLoading(false);
                return;
            }
            const res = await fetch(`/api/income?id=${id}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (res.ok) {
                setSuccessMessage("success delete income!");
                setLoading(false);
                setOpenModalSuccess(true);
            } else {
                setFailedMessage(data.message);
                setLoading(false);
                setOpenModalFailed(true);
            }
        } catch (err: unknown) {
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
            getIncomes();
            fetchCategory();
            fetchPlan();
            fetchSource();
        }
    }, [profile, getIncomes, fetchCategory, fetchPlan, fetchSource])

    return (
        <main className="flex flex-col items-center min-h-screen pt-20 gap-10">
            {loading && <Loading />}
            <h1 className={`${pixelify.className} text-xl`}>
                incomes
            </h1>
            <div className="mt-2 items-center justify-center">
                <Button size="md" variant="outline" className={`${geistMono.className} min-w-[400px] cursor-pointer mt-6`} onClick={() => openModalCreate()}>
                    <div className="flex flex-col">
                        <div className="flex flex-row items-center justify-center mb-1">
                            <svg id="plus-solid" width="20" height="20" fill="#FF6F91" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="23 11 23 13 22 13 22 14 14 14 14 22 13 22 13 23 11 23 11 22 10 22 10 14 2 14 2 13 1 13 1 11 2 11 2 10 10 10 10 2 11 2 11 1 13 1 13 2 14 2 14 10 22 10 22 11 23 11" /></svg>
                        </div>
                        add
                    </div>
                </Button>
                {income.length > 0 ? (
                    income.map((e) => {
                        return (
                            <Card
                                key={e.id}
                                title={e.description}
                                desc={formatRupiah(e.amount)}
                                className="min-w-[400px] outline-gray-400 hover:bg-pink-400 cursor-pointer mt-6"
                                onClick={() => handleClickEditIncome(e.id)}
                            >
                                <span className="text-xs">
                                    {moment(new Date(e.income_date)).format('dddd').substring(0, 3) + ", " + moment(new Date(e.income_date)).format("D MMMM YYYY")}
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
                                            <span className="text-gray-500">plan:</span>
                                            <span>{e.plans?.name}</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })
                ) : (
                    <div className={`flex flex-col items-center justify-center min-h-[100px] text-gray-500 ${geistMono.className}`}>
                        no incomes found!
                    </div>
                )}
                {income.length > 0 && (
                    <div className={`flex justify-center items-center gap-2 mt-6 ${geistMono.className}`}>
                        <button
                            disabled={page === 1}
                            onClick={() => getIncomes(page - 1)}
                            className="px-3 py-1 border disabled:opacity-50 cursor-pointer hover:bg-pink-500 hover:text-white"
                        >
                            prev
                        </button>

                        <span className="text-sm text-gray-600">
                            page {page} of {totalPages}
                        </span>

                        <button
                            disabled={page === totalPages}
                            onClick={() => getIncomes(page + 1)}
                            className="px-3 py-1 border disabled:opacity-50 cursor-pointer hover:bg-pink-500 hover:text-white"
                        >
                            next
                        </button>
                    </div>)}
                {openModalForm &&
                    <FormModal
                        isOpen={openModalForm}
                        onClose={closeModalForm}
                        title={`${isCreateMode ? "create new" : "update"} income`}
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
                                        defaultValue={selectedIncome?.description}
                                        onChange={(e) => setSelectedIncome((prev) =>
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
                                        defaultValue={selectedIncome && selectedIncome?.amount >= 0 ? selectedIncome?.amount : ""}
                                        onChange={(e) => setSelectedIncome((prev) =>
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
                                        placeholder="enter your date of income..."
                                        defaultValue={selectedIncome?.income_date ?? today}
                                        onChange={(e) => setSelectedIncome((prev) =>
                                            prev ? { ...prev, income_date: e.target.value } : prev
                                        )}>
                                    </Input>
                                </div>
                            </div>
                            <div className="flex gap-4 items-center space-y-4">
                                <div className={`flex items-center ${geistMono.className} text-s w-[200px] text-start justify-start`}>
                                    plan
                                </div>
                                <div className="flex-1">
                                    <Select
                                        options={planOptions}
                                        placeholder="select plan..."
                                        defaultValue={selectedIncome && selectedIncome?.plan_id >= 0 ? String(selectedIncome?.plan_id) : ""}
                                        onChange={(val: string) => {
                                            setSelectedIncome((prev) =>
                                                prev ? { ...prev, plan_id: Number(val), plans: { ...prev.plans, id: Number(val) } } : prev
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
                                        defaultValue={selectedIncome && selectedIncome?.category_id >= 0 ? String(selectedIncome.category_id) : ""}
                                        onChange={(val: string) =>
                                            setSelectedIncome((prev) =>
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
                                        defaultValue={selectedIncome && selectedIncome?.source_id >= 0 ? String(selectedIncome.source_id) : ""}
                                        onChange={(val: string) =>
                                            setSelectedIncome((prev) =>
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
                    handleYes={() => { setConfirmExceedingPlan(true); handleConfirmAction(); }}
                    noButton
                    noButtonText="cancel"
                    handleNo={() => setOpenModalWarning(false)}
                />
            )}
        </main>
    );
}