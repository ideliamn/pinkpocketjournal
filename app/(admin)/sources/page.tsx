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

export default function Sources() {
    interface Source {
        name: string;
    }

    interface FormSourceType {
        user_id?: number;
        name?: string;
    }

    const { profile } = useProfile()
    const [loading, setLoading] = useState(false);
    const [openModalAdd, setOpenModalAdd] = useState(false);
    const [openModalSuccess, setOpenModalSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [openModalFailed, setOpenModalFailed] = useState(false);
    const closeModalFailed = () => { setOpenModalFailed(false) };
    const [failedMessage, setFailedMessage] = useState("");
    const [source, setSource] = useState<Source[]>([])
    const [formSource, setFormSource] = useState<FormSourceType>({
        user_id: 0,
        name: "",
    });

    const getMenu = async () => {
        try {
            if (!profile?.id) return;
            const getSource = await fetch(`/api/source?userId=${profile?.id}`, {
                method: "GET"
            });
            const res = await getSource.json();
            if (res.data) {
                setSource(res.data)
            }
            setLoading(false)
        } catch (err) {
            console.error(err);
        } finally {
        }
    }

    useEffect(() => {
        setLoading(true)
        if (profile?.id) {
            getMenu()
            setFormSource((prev) => ({ ...prev, user_id: Number(profile?.id) }))
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
        setFormSource((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        setLoading(true);
        e.preventDefault();

        try {
            if (!formSource.name) {
                setFailedMessage("fill all the required fields!");
                setOpenModalFailed(true);
                setLoading(false);
                return;
            }

            const res = await fetch("/api/source", {
                method: "POST",
                body: JSON.stringify(formSource),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccessMessage("success add new source!");
                closeModalAdd()
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
                sources
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
                {source.length > 0 ? (
                    source.map((p) => {
                        return (
                            <Card
                                key={p.name}
                                title={p.name}
                                className="min-w-[400px] outline-gray-400 hover:bg-pink-400 cursor-pointer mt-6"
                            >
                                <span></span>
                            </Card>
                        );
                    })
                ) : (
                    <div className={`flex flex-col items-center justify-center min-h-[100px] text-gray-500 ${geistMono.className}`}>
                        no sources found!
                    </div>
                )}
            </div>
            {openModalAdd &&
                <FormModal
                    isOpen={openModalAdd}
                    onClose={closeModalAdd}
                    title="add new source"
                >
                    <form onSubmit={handleSubmit}>
                        <div className="flex gap-4 items-center space-y-4">
                            <div className={`flex items-center ${geistMono.className} text-s w-[200px] text-start justify-start`}>
                                name
                            </div>
                            <div className="flex-1">
                                <Input name="name" type="text" placeholder="enter source name..." className={`flex ${geistMono.className} text-s w-full`} onChange={handleChange} />
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