"use client"
import { Geist_Mono, Pixelify_Sans } from "next/font/google";
import Card from "../../components/card/Card";
import { useCallback, useEffect, useState } from "react";
import { useProfile } from "../../context/ProfileContext";
import Loading from "../../components/common/Loading";
import moment from "moment";
import Button from "../../components/ui/button/Button";
import FormModal from "../../components/modals/FormModal";
import Input from "../../components/form/input/InputField";
import SimpleModal from "../../components/modals/SimpleModal";
import { formatRupiah } from "../../../lib/helpers/format";
import ModalDetail from "./(components)/ModalDetail";

const geistMono = Geist_Mono({
    variable: "--font-geist-sono",
    subsets: ["latin"],
    weight: ["400"]
})

const pixelify = Pixelify_Sans({
    subsets: ["latin"],
    weight: ["400"],
});

export default function Plans() {
    interface Plan {
        id: number;
        max_expense: number;
        name: string;
        end_date: string;
        start_date: string;
        category_plans: [
            {
                amount: number,
                categories: {
                    name: string;
                }
            }
        ]
    }

    interface FormPlanType {
        name?: string;
        start_date?: string;
        end_date?: string;
        max_expense?: number;
    }

    const { profile } = useProfile()
    const [loading, setLoading] = useState(false);
    const [openModalAdd, setOpenModalAdd] = useState(false);
    const [openModalSuccess, setOpenModalSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [openModalFailed, setOpenModalFailed] = useState(false);
    const closeModalFailed = () => { setOpenModalFailed(false) };
    const [failedMessage, setFailedMessage] = useState("");
    const [openModalDetail, setOpenModalDetail] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [plan, setPlan] = useState<Plan[]>([])
    const [formPlan, setFormPlan] = useState<FormPlanType>({
        name: "",
        start_date: "",
        end_date: "",
        max_expense: 0
    });

    const getPlan = useCallback(async () => {
        try {
            if (!profile?.id) return;
            const getPlan = await fetch(`/api/plan?userId=${profile?.id}`, {
                method: "GET"
            });
            const res = await getPlan.json();
            if (res.data) {
                setPlan(res.data)
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
    }, [profile])

    useEffect(() => {
        setLoading(true)
        if (profile?.id) {
            getPlan()
            setFormPlan((prev) => ({ ...prev, user_id: Number(profile?.id) }))
        }
    }, [profile, getPlan])

    const closeModalAdd = () => {
        setOpenModalAdd(false);
        getPlan();
    }

    const closeModalSuccess = () => {
        setOpenModalSuccess(false);
        getPlan();
    }

    const closeModalDetail = () => {
        setOpenModalDetail(false);
        setSelectedId(null)
        getPlan();
    }

    const handleClickDetail = async (id: number) => {
        console.log("id: ", id)
        setLoading(true)
        setOpenModalDetail(true)
        setLoading(false)
        setSelectedId(id);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormPlan((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        setLoading(true);
        e.preventDefault();

        try {
            if (!formPlan.name || !formPlan.start_date || !formPlan.end_date || !formPlan.max_expense) {
                setFailedMessage("fill all the required fields!");
                setOpenModalFailed(true);
                setLoading(false);
                return;
            }

            const res = await fetch("/api/plan", {
                method: "POST",
                body: JSON.stringify(formPlan),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccessMessage("success add new plan!");
                closeModalAdd()
                setLoading(false);
                setOpenModalSuccess(true);
            } else {
                setFailedMessage(data.message);
                setLoading(false);
                setOpenModalFailed(true);
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setFailedMessage(err.message);
            } else {
                setFailedMessage("Something went wrong")
            }
            setLoading(false);
            setOpenModalFailed(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex flex-col items-center min-h-screen pt-20 gap-10">
            {loading && <Loading />}
            <h1 className={`${pixelify.className} text-xl`}>
                plans
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
                {plan.length > 0 ? (
                    plan.map((p) => {
                        const today = new Date();
                        const start = new Date(p.start_date);
                        const end = new Date(p.end_date);
                        const isActive = today >= start && today <= end;
                        return (
                            <Card
                                key={p.id}
                                title={p.name}
                                desc={moment(new Date(p.start_date)).format("DD MMMM YYYY") + " - " + moment(new Date(p.end_date)).format("DD MMMM YYYY")}
                                className="min-w-[400px] outline-gray-400 hover:bg-pink-400 cursor-pointer mt-6"
                                onClick={() => handleClickDetail(p.id)}
                            >
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs">
                                        {isActive ? "active" : "inactive"}
                                    </span>
                                    <span className="text-xs">
                                        max expense: {formatRupiah(p.max_expense)}
                                    </span>
                                </div>
                            </Card>
                        );
                    })
                ) : (
                    <div className={`flex flex-col items-center justify-center min-h-[100px] text-gray-500 ${geistMono.className}`}>
                        no plans found!
                    </div>
                )}
            </div>
            {openModalAdd &&
                <FormModal
                    isOpen={openModalAdd}
                    onClose={closeModalAdd}
                    title="add new plan"
                >
                    <form onSubmit={handleSubmit}>
                        <div className="flex gap-4 items-center space-y-4">
                            <div className={`flex items-center ${geistMono.className} text-s w-[200px] text-start justify-start`}>
                                name
                            </div>
                            <div className="flex-1">
                                <Input name="name" type="text" placeholder="enter plan name..." className={`flex ${geistMono.className} text-s w-full`} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="flex items-center justify-center py-6">
                            <Button size="sm" variant="outline" className={`${geistMono.className} text-s cursor-pointer hover:underline hover:text-pink-600`}>
                                add
                            </Button>
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
            {openModalDetail && selectedId !== null && (
                <ModalDetail
                    isOpen={openModalDetail}
                    onClose={closeModalDetail}
                    id={selectedId}
                />
            )}
        </main>
    );
}