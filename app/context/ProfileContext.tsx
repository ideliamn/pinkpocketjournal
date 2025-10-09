// context/ProfileContext.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

type Profile = {
    id: string;
    nip: string;
    nama: string;
    jabatan: string;
    image_url: string;
    id_auth: string;
    created_by: string;
    created_at: Date;
    updated_by: string;
    updated_at: Date;
};

type ProfileContextType = {
    profile: Profile | null;
    setProfile: (p: Profile) => void;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth(); // ⬅️ taruh DI DALAM component
    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        if (!user?.id) return; // kalau belum login jangan fetch

        const fetchProfile = async () => {
            const res = await fetch(`/api/profile?idAuth=${user.id}`);
            const data = await res.json();
            setProfile(data);
        };
        fetchProfile();
    }, [user?.id]); // depend ke user.id

    return (
        <ProfileContext.Provider value={{ profile, setProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) throw new Error("useProfile must be used within ProfileProvider");
    return context;
};
