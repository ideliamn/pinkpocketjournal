"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "../common/Loading";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../context/ProfileContext";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { Pixelify_Sans } from "next/font/google";
import Link from "next/link";
import SimpleModal from "../modals/SimpleModal";

const pixelify = Pixelify_Sans({
    subsets: ["latin"],
    weight: ["400"],
});

export default function UserDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const { signOut, user, loading } = useAuth()
    const router = useRouter()
    const [openModalInfo, setOpenModalInfo] = useState(false);
    const { profile } = useProfile();
    const [logoutLoading, setLogoutLoading] = useState(false);

    useEffect(() => {
        if (!user && !profile && !loading) {
            setOpenModalInfo(true);
        }
    }, [loading, user, profile])

    function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.stopPropagation();
        setIsOpen((prev) => !prev);
    }

    function closeDropdown() {
        setIsOpen(false);
    }

    const handleLogout = async () => {
        setLogoutLoading(true);
        const { error } = await signOut()
        if (error) {
            console.log(error)
            return;
        }
        goToLogin()
    };

    const goToLogin = async () => {
        router.push("/")
    }

    return (
        <div className="relative">
            {loading && <Loading />}
            {logoutLoading && <Loading />}
            {/* Modal Info */}
            {openModalInfo && (
                <SimpleModal
                    type="info"
                    isOpen={openModalInfo}
                    onClose={() => goToLogin()}
                    title="Silakan login"
                    message="Session habis, silakan login terlebih dahulu"
                // yesButtonText="Ya"
                // handleYes={() => goToLogin()}
                />
            )}
            <button onClick={toggleDropdown} className="flex items-center dropdown-toggle cursor-pointer hover:bg-white/70 hover:text-pink-600 hover:underline">
                <span className="mr-3 overflow-hidden rounded-full h-8 w-8">
                    <svg width={20} height={20} id="user-solid" className="object-cover h-full w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="7 9 6 9 6 5 7 5 7 3 8 3 8 2 10 2 10 1 14 1 14 2 16 2 16 3 17 3 17 5 18 5 18 9 17 9 17 11 16 11 16 12 14 12 14 13 10 13 10 12 8 12 8 11 7 11 7 9" /><polygon points="22 19 22 22 21 22 21 23 3 23 3 22 2 22 2 19 3 19 3 18 4 18 4 17 5 17 5 16 7 16 7 15 17 15 17 16 19 16 19 17 20 17 20 18 21 18 21 19 22 19" /></svg>
                </span>
                <span className={`block mr-1 font-medium text-theme-sm ${pixelify.className}`}>
                    hello, {profile?.name?.split(" ")[0]}!
                </span>
                <svg className={`stroke-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.3125 8.65625L9 13.3437L13.6875 8.65625" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            <Dropdown
                isOpen={isOpen}
                onClose={closeDropdown}
                className="absolute border-red-100 border-1 bg-white right-0 flex-col px-4 py-2"
            >
                <span className={`block font-medium text-theme-sm ${pixelify.className} cursor-pointer hover:text-pink-600 hover:underline transition`}>
                    <Link href="/profile">edit profile</Link>
                </span>
                <span className={`block font-medium text-theme-sm ${pixelify.className} cursor-pointer hover:text-pink-600 hover:underline transition`} onClick={handleLogout}>
                    logout
                </span>
            </Dropdown>
        </div >
    );
}

