"use client"
import { Geist_Mono, Pixelify_Sans } from "next/font/google";
import Card from "../../components/card/Card";
import { useCallback, useEffect, useState } from "react";
import { useProfile } from "../../context/ProfileContext";
import Loading from "../../components/common/Loading";
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

export default function PlanCategories() {
    interface PlanCategories {
        id: number;
        plan_id: number;
        plans: {
            id: number;
            name: string;
            start_date: string;
            end_date: string;
        },
        category_id: number;
        categories: {
            id: number;
            name: string;
            user_id: number;
        },
        amount: number;
    }

    interface Plan {
        id: number,
        name: string;
        start_date: string;
        end_date: string;
    }

    interface Select {
        id: number,
        name: string;
    }

    const { profile } = useProfile()
    const [loading, setLoading] = useState(false);
    const [openModalForm, setOpenModalForm] = useState(false);
    const [categoryPlans, setPlanCategories] = useState<PlanCategories[]>([])
    const [planOptions, setPlanOptions] = useState<{ value: string; label: string }[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);
    const [selectedCP, setSelectedCP] = useState<PlanCategories | null>(null);
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

    const handleClickEditCP = async (idCP: number) => {
        console.log("id: ", idCP)
        setLoading(true)
        const foundCP = categoryPlans.find((bc) => bc.id === idCP);
        console.log("foundCP: ", JSON.stringify(foundCP))
        if (foundCP) {
            setSelectedCP({
                id: foundCP.id,
                plan_id: foundCP.plan_id,
                plans: {
                    id: foundCP.plans.id,
                    name: foundCP.plans.name,
                    start_date: foundCP.plans.start_date,
                    end_date: foundCP.plans.end_date,
                },
                category_id: foundCP.category_id,
                categories: {
                    id: foundCP.categories.id,
                    name: foundCP.categories.name,
                    user_id: foundCP.categories.user_id,
                },
                amount: foundCP.amount,
            });
        }
        setOpenModalForm(true)
        setLoading(false)
    }

    const getPlanCategories = useCallback(async () => {
        try {
            if (!profile?.id) return;
            const getPlanCategories = await fetch(`/api/category-plan?userId=${profile?.id}`, {
                method: "GET"
            });
            const res = await getPlanCategories.json();
            if (res.data) {
                setPlanCategories(res.data)
            }
            setLoading(false)
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error(err.message);
            } else {
                console.error("Something went wrong");
            }
        } finally {
        }
    }, [profile]);


    const fetchPlan = useCallback(async () => {
        const getPlan = await fetch(`/api/plan?userId=${profile?.id}`);
        const res = await getPlan.json();
        if (res.data) {
            const dataPlan: Plan[] = res.data
            const today = new Date();
            const formattedOptions = dataPlan.map((b) => (
                {
                    value: String(b.id),
                    label: b?.name + " (" +
                        `${(today >= (new Date(b?.start_date)) && today <= (new Date(b?.end_date))) ? "active" : "inactive"}`
                        + ")",
                })).sort((a, b) => a.label.localeCompare(b.label));
            setPlanOptions(formattedOptions);
        }
    }, [profile]);

    const fetchCategory = useCallback(async () => {
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
    }, [profile]);

    const openModalCreate = () => {
        const firstPlan = planOptions.length > 0 ? planOptions[0] : null;
        const firstCategory = categoryOptions.length > 0 ? categoryOptions[0] : null;
        setSelectedCP({
            id: 0,
            plan_id: firstPlan ? Number(firstPlan.value) : -1,
            plans: {
                id: firstPlan ? Number(firstPlan.value) : -1,
                name: "",
                start_date: "",
                end_date: "",
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
        getPlanCategories();
        setOpenModalForm(false);
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
            await handleSubmitEditCP();
        } else if (pendingAction === "delete") {
            await handleDeleteCP(selectedCP?.id ?? 0);
        } else if (pendingAction === "create") {
            await handleSubmitCreateCP();
        }
        setOpenModalConfirm(false);
        setPendingAction(null);
    };

    const handleSubmitEditCP = async (e?: React.FormEvent) => {
        setLoading(true);
        e?.preventDefault();
        console.log("selectedCP: " + JSON.stringify(selectedCP))
        try {
            if (!selectedCP || selectedCP?.id < 1 || selectedCP.plan_id < 1 || selectedCP.category_id < 1 || selectedCP.amount < 0) {
                setFailedMessage("fill all the required fields!");
                setOpenModalFailed(true);
                setLoading(false);
                return;
            }
            console.log(JSON.stringify({
                id: selectedCP.id,
                plan_id: selectedCP.plan_id,
                category_id: selectedCP.category_id,
                amount: selectedCP.amount
            }))
            const res = await fetch("/api/plan-category", {
                method: "PUT",
                body: JSON.stringify({
                    id: selectedCP.id,
                    plan_id: selectedCP.plan_id,
                    category_id: selectedCP.category_id,
                    amount: selectedCP.amount
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setSuccessMessage("success update plan for this category!");
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
            const res = await fetch(`/api/category-plan?id=${id}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (res.ok) {
                setSuccessMessage("success delete plan for this category!");
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

    const handleOpenConfirmCreate = () => {
        setConfirmMessage("are you sure you want to create this category?");
        setPendingAction("create");
        setOpenModalConfirm(true);
    };

    const handleSubmitCreateCP = async () => {
        setLoading(true);
        try {
            if (!selectedCP?.category_id || !selectedCP.amount) {
                setFailedMessage("fill all the required fields!");
                setOpenModalFailed(true);
                setLoading(false);
                return;
            }
            const res = await fetch("/api/category-plan", {
                method: "POST",
                body: JSON.stringify({
                    plan_id: selectedCP.plan_id,
                    category_id: selectedCP.category_id,
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
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error(err.message);
            } else {
                console.error("Something went wrong");
            }
        } finally {
            closeModalForm();
            setLoading(false);
            setIsCreateMode(false);
        }
    };

    useEffect(() => {
        setLoading(true)
        if (profile?.id) {
            getPlanCategories()
            fetchCategory();
            fetchPlan();
        }
    }, [profile, getPlanCategories, fetchCategory, fetchPlan])

    return (
        <main className="flex flex-col items-center min-h-screen pt-20">
            {loading && <Loading />}
            <h1 className={`${pixelify.className} text-xl`}>
                category plan
            </h1>
            <Button size="md" variant="outline" className={`${geistMono.className} min-w-[400px] cursor-pointer mt-6`} onClick={() => openModalCreate()}>
                <div className="flex flex-col">
                    <div className="flex flex-row items-center justify-center mb-1">
                        <svg id="plus-solid" width="20" height="20" fill="#FF6F91" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="23 11 23 13 22 13 22 14 14 14 14 22 13 22 13 23 11 23 11 22 10 22 10 14 2 14 2 13 1 13 1 11 2 11 2 10 10 10 10 2 11 2 11 1 13 1 13 2 14 2 14 10 22 10 22 11 23 11" /></svg>
                    </div>
                    add
                </div>
            </Button>
            {categoryPlans.length > 0 ? (
                categoryPlans.map((b) => {
                    const today = new Date();
                    const start = new Date(b.plans?.start_date);
                    const end = new Date(b.plans?.end_date);
                    const isActive = today >= start && today <= end;
                    return (
                        <Card
                            key={b.id}
                            title={b.categories.name}
                            className="min-w-[400px] outline-gray-400 hover:bg-pink-400 cursor-pointer mt-6"
                            onClick={() => handleClickEditCP(b.id)}
                        >
                            <div className="flex flex-col gap-1">
                                <span className="text-xs">period: {b.plans?.name} ({isActive ? "active" : "inactive"})</span>
                                <span className="text-xs">
                                    amount: {formatRupiah(b.amount)}
                                </span>
                            </div>
                        </Card>
                    );
                })
            ) : (
                <div className={`flex flex-col items-center justify-center min-h-[100px] text-gray-500 ${geistMono.className}`}>
                    no category plan found!
                </div>
            )}
            {openModalForm &&
                <FormModal
                    isOpen={openModalForm}
                    onClose={closeModalForm}
                    title={`${isCreateMode ? "create new" : "update"} plan category`}
                >
                    <form>
                        <div className="flex gap-4 items-center space-y-4">
                            <div className={`flex items-center ${geistMono.className} text-s w-[200px] text-start justify-start`}>
                                plan
                            </div>
                            <div className="flex-1">
                                <Select
                                    options={planOptions}
                                    placeholder="select plan..."
                                    defaultValue={selectedCP ? String(selectedCP?.plan_id) : ""}
                                    onChange={(val: string) =>
                                        setSelectedCP((prev) =>
                                            prev ? { ...prev, plan_id: Number(val), plans: { ...prev.plans, id: Number(val) } } : prev
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
                                    defaultValue={selectedCP ? String(selectedCP?.category_id) : ""}
                                    onChange={(val: string) =>
                                        setSelectedCP((prev) =>
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
                                    defaultValue={selectedCP?.amount}
                                    onChange={(e) => setSelectedCP((prev) =>
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