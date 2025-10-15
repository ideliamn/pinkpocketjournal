"use client"
import { Geist_Mono, Pixelify_Sans } from "next/font/google";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/tables";
import Card from "../../components/card/Card";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { useProfile } from "../../context/ProfileContext";
import Loading from "../../components/common/Loading";
import moment from "moment";
import Button from "../../components/ui/button/Button";
import FormModal from "../../components/modals/FormModal";
import Input from "../../components/form/input/InputField";
import SimpleModal from "../../components/modals/SimpleModal";

const geistMono = Geist_Mono({
    variable: "--font-geist-sono",
    subsets: ["latin"],
    weight: ["400"]
})

const pixelify = Pixelify_Sans({
    subsets: ["latin"],
    weight: ["400"],
});

export default function Periods() {
    interface Period {
        name: string;
        start_date: string;
        end_date: string;
    }

    interface FormPeriodType {
        user_id?: number;
        name?: string;
        start_date?: string;
        end_date?: string;
    }

    const { profile } = useProfile()
    const [loading, setLoading] = useState(false);
    const [openModalAdd, setOpenModalAdd] = useState(false);
    const [openModalSuccess, setOpenModalSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [openModalFailed, setOpenModalFailed] = useState(false);
    const closeModalFailed = () => { setOpenModalFailed(false) };
    const [failedMessage, setFailedMessage] = useState("");
    const [period, setPeriod] = useState<Period[]>([])
    const [formPeriod, setFormPeriod] = useState<FormPeriodType>({
        user_id: 0,
        name: "",
        start_date: "",
        end_date: ""
    });

    const getMenu = async () => {
        try {
            if (!profile?.id) return;
            const getPeriod = await fetch(`/api/period?userId=${profile?.id}`, {
                method: "GET"
            });
            const res = await getPeriod.json();
            if (res.data) {
                setPeriod(res.data)
            }
            setLoading(false)
        } catch (err) {
            console.error(err);
        } finally {
        }
    }

    useEffect(() => {
        if (profile?.id) {
            getMenu()
            setFormPeriod((prev) => ({ ...prev, user_id: Number(profile?.id) }))
        }
    }, [profile])

    const closeModalAdd = () => {
        setOpenModalAdd(false);
        getMenu();
    }

    const closeModalSuccess = () => {
        setOpenModalSuccess(false);
        getMenu();
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormPeriod((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        setLoading(true);
        e.preventDefault();

        try {
            if (!formPeriod.name || !formPeriod.start_date || !formPeriod.end_date) {
                setFailedMessage("fill all the required fields!");
                setOpenModalFailed(true);
                setLoading(false);
                return;
            }

            const res = await fetch("/api/period", {
                method: "POST",
                body: JSON.stringify(formPeriod),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccessMessage("success add new period!");
                setLoading(false);
                setOpenModalSuccess(true);
            } else {
                setFailedMessage(data.message);
                setLoading(false);
                setOpenModalFailed(true);
            }
        } catch (err: any) {
            setFailedMessage(err.message);
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
                periods
            </h1>
            <div className="mt-2 items-center justify-center">
                <Button size="md" variant="outline" className={`${geistMono.className} min-w-[400px] cursor-pointer mt-6`} onClick={() => setOpenModalAdd(true)}>
                    add
                </Button>
                {period.map((p) => {
                    const today = new Date();
                    const start = new Date(p.start_date);
                    const end = new Date(p.end_date);
                    const isActive = today >= start && today <= end;
                    return (
                        <Card
                            key={p.name}
                            title={p.name}
                            desc={isActive ? "active" : "inactive"}
                            className="min-w-[400px] outline-gray-400 hover:bg-pink-400 cursor-pointer mt-6"
                        >
                            <span>
                                {moment(new Date(p.start_date)).format("DD MMMM YYYY")} - {moment(new Date(p.end_date)).format("DD MMMM YYYY")}
                            </span>
                        </Card>
                    );
                })}
            </div>
            {openModalAdd &&
                <FormModal
                    isOpen={openModalAdd}
                    onClose={closeModalAdd}
                    title="add new period"
                >
                    <form onSubmit={handleSubmit}>
                        <div className="flex gap-4 items-center space-y-4">
                            <div className={`flex items-center ${geistMono.className} text-s w-[200px] text-start justify-start`}>
                                name
                            </div>
                            <div className="flex-1">
                                <Input name="name" type="text" placeholder="enter period name..." className={`flex ${geistMono.className} text-s w-full`} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="flex gap-4 items-center space-y-4">
                            <div className={`flex items-center ${geistMono.className} text-s w-[200px] text-start justify-start`}>
                                start date
                            </div>
                            <div className="flex-1">
                                <Input name="start_date" type="date" placeholder="enter start date..." className={`flex ${geistMono.className} text-s w-full`} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="flex gap-4 items-center space-y-4">
                            <div className={`flex items-center ${geistMono.className} text-s w-[200px] text-start justify-start`}>
                                end date
                            </div>
                            <div className="flex-1">
                                <Input name="end_date" type="date" placeholder="enter end date..." className={`flex ${geistMono.className} text-s w-full`} onChange={handleChange} />
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
        </main>
    );
}