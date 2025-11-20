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

export default function Categories() {
    interface Category {
        id: number;
        name: string;
        type: string;
    }

    const typeOptions = [
        { label: "income", value: "income" },
        { label: "expense", value: "expense" }
    ]

    const { profile } = useProfile()
    const [loading, setLoading] = useState(false);
    const [openModalForm, setOpenModalForm] = useState(false);
    const [openModalSuccess, setOpenModalSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [openModalFailed, setOpenModalFailed] = useState(false);
    const closeModalFailed = () => { setOpenModalFailed(false) };
    const [failedMessage, setFailedMessage] = useState("");
    const [openModalConfirm, setOpenModalConfirm] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState("");
    const [pendingAction, setPendingAction] = useState<"edit" | "delete" | "create" | null>(null);
    const [isCreateMode, setIsCreateMode] = useState(false);
    const [selectedIdEditCategory, setSelectedIdEditCategory] = useState<number | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [category, setCategory] = useState<Category[]>([]);

    const getCategories = async () => {
        try {
            if (!profile?.id) return;
            const getCategory = await fetch(`/api/category?userId=${profile?.id}`, {
                method: "GET"
            });
            const res = await getCategory.json();
            if (res.data) {
                setCategory(res.data)
            }
            setLoading(false)
        } catch (err) {
            console.error(err);
        } finally {
        }
    }

    const handleOpenConfirmCreate = () => {
        setConfirmMessage("are you sure you want to create this category?");
        setPendingAction("create");
        setOpenModalConfirm(true);
    };

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

    const handleClickEdit = async (id: number) => {
        console.log("id: ", id)
        setLoading(true)
        setSelectedIdEditCategory(id)
        const found = category.find((c) => c.id === id);
        console.log("found: ", JSON.stringify(found))
        if (found) {
            setSelectedCategory({
                id: found.id,
                name: found.name,
                type: found.type
            });
        }
        setOpenModalForm(true)
        setLoading(false)
        setSelectedIdEditCategory(id);
    }

    const openModalCreate = () => {
        setSelectedCategory({
            id: 0,
            name: "",
            type: "",
        });
        setIsCreateMode(true);
        setOpenModalForm(true);
    }

    const closeModalForm = () => {
        getCategories();
        setOpenModalForm(false);
        setSelectedIdEditCategory(null)
        setIsCreateMode(false);
    }

    const closeModalSuccess = () => {
        setOpenModalSuccess(false);
        getCategories();
    }

    const handleConfirmAction = async () => {
        if (pendingAction === "edit") {
            await handleSubmitEdit();
        } else if (pendingAction === "delete") {
            await handleDelete(selectedCategory?.id ?? 0);
        } else if (pendingAction === "create") {
            await handleSubmitCreate();
        }
        setOpenModalConfirm(false);
        setPendingAction(null);
    };

    const handleSubmitCreate = async (e?: React.FormEvent) => {
        setLoading(true);
        e?.preventDefault();
        try {
            if (!selectedCategory?.name) {
                setFailedMessage("fill all the required fields!");
                setOpenModalFailed(true);
                setLoading(false);
                return;
            }
            const res = await fetch("/api/category", {
                method: "POST",
                body: JSON.stringify({
                    user_id: profile?.id,
                    name: selectedCategory?.name,
                    type: selectedCategory?.type
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setSuccessMessage("success add new category!");
                closeModalForm()
                setOpenModalSuccess(true);
            } else {
                setFailedMessage(data.message);
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

    const handleSubmitEdit = async (e?: React.FormEvent) => {
        setLoading(true);
        e?.preventDefault();
        console.log("selectedCategory: " + JSON.stringify(selectedCategory))
        try {
            if (!selectedCategory || selectedCategory?.id < 1 || !selectedCategory.name) {
                setFailedMessage("fill all the required fields!");
                setOpenModalFailed(true);
                setLoading(false);
                return;
            }
            console.log(JSON.stringify({
                id: selectedCategory.id,
                name: selectedCategory.name,
            }))
            const res = await fetch("/api/category", {
                method: "PUT",
                body: JSON.stringify({
                    id: selectedCategory.id,
                    user_id: profile?.id,
                    name: selectedCategory.name,
                    type: selectedCategory.type
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setSuccessMessage("success update category!");
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

    const handleDelete = async (id: number) => {
        setLoading(true);
        try {
            if (!id || id === 0) {
                setFailedMessage("fill all the required fields!");
                setOpenModalFailed(true);
                setLoading(false);
                return;
            }
            const res = await fetch(`/api/category?id=${id}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (res.ok) {
                setSuccessMessage("success delete category!");
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

    useEffect(() => {
        setLoading(true)
        if (profile?.id) {
            getCategories()
        }
    }, [profile])

    return (
        <main className="flex flex-col items-center min-h-screen pt-20 gap-10">
            {loading && <Loading />}
            <h1 className={`${pixelify.className} text-xl`}>
                categories
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
                {category.length > 0 ? (
                    category.map((c) => {
                        return (
                            <Card
                                key={c.name}
                                title={c.name}
                                desc={`type: ${c.type}`}
                                className="min-w-[400px] outline-gray-400 hover:bg-pink-400 cursor-pointer mt-6"
                                onClick={() => { handleClickEdit(c.id) }}
                            >
                                <span></span>
                            </Card>
                        );
                    })
                ) : (
                    <div className={`flex flex-col items-center justify-center min-h-[100px] text-gray-500 ${geistMono.className}`}>
                        no categories found!
                    </div>
                )}
            </div>
            {openModalForm &&
                <FormModal
                    isOpen={openModalForm}
                    onClose={closeModalForm}
                    title={`${isCreateMode ? "create new" : "update"} category`}
                >
                    <form>
                        <div className="flex gap-4 items-center space-y-4">
                            <div className={`flex items-center ${geistMono.className} text-s w-[200px] text-start justify-start`}>
                                name
                            </div>
                            <div className="flex-1">
                                <Input
                                    name="name"
                                    type="text"
                                    placeholder="enter category name..."
                                    defaultValue={selectedCategory?.name}
                                    className={`flex ${geistMono.className} text-s w-full`}
                                    onChange={(e) => setSelectedCategory((prev) => prev ? { ...prev, name: e.target.value } : prev)} />
                            </div>
                        </div>
                        <div className="flex gap-4 items-center space-y-4">
                            <div className={`flex items-center ${geistMono.className} text-s w-[200px] text-start justify-start`}>
                                type
                            </div>
                            <div className="flex-1">
                                <Select
                                    options={typeOptions}
                                    placeholder="select type..."
                                    defaultValue={selectedCategory?.type ? String(selectedCategory?.type) : ""}
                                    onChange={(val: string) => setSelectedCategory((prev) => prev ? { ...prev, type: val } : prev)}
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
    );
}