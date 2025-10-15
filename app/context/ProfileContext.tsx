// context/ProfileContext.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

type Profile = {
    id: string;
    name: string;
    email: string;
    id_auth: string;
};

type ProfileContextType = {
    profile: Profile | null;
    setProfile: (p: Profile) => void;
    loadingProfile: boolean;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth(); // ⬅️ taruh DI DALAM component
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.id) {
                setProfile(null)
                setLoadingProfile(false)
                return
            }
            try {
                setLoadingProfile(true)
                const res = await fetch(`/api/user?idAuth=${user.id}`);
                const data = await res.json();
                if (data?.data?.length > 0) {
                    setProfile(data.data[0]);
                } else {
                    setProfile(null);
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
                setProfile(null);
            } finally {
                setLoadingProfile(false)
            }
        };
        fetchProfile();
    }, [user?.id]); // depend ke user.id

    return (
        <ProfileContext.Provider value={{ profile, setProfile, loadingProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) throw new Error("useProfile must be used within ProfileProvider");
    return context;
};
