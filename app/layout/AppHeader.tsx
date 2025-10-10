import React from "react";
import UserDropdown from "../components/header/UserDropdown";

const AppHeader: React.FC = () => {
    return (
        <header className="top-0 w-full bg-white">
            <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
                <div className="flex items-center w-full gap-4 px-5 py-4 lg:flex shadow-theme-md justify-end lg:px-0 lg:shadow-none">
                    <UserDropdown />
                </div>
            </div>
        </header >
    );
};

export default AppHeader;
