import React from "react";
import UserDropdown from "../components/header/UserDropdown";
import Menu from "../components/header/Menu";

const AppHeader: React.FC = () => {
    return (
        <header className="top-0 w-full">
            <div className="flex items-center justify-between grow px-3 py-3">
                <div className="flex items-center w-full gap-4 shadow-theme-md justify-start">
                    <Menu />
                </div>
                <div className="flex items-center w-full gap-4 shadow-theme-md justify-end">
                    <UserDropdown />
                </div>
            </div>
        </header >
    );
};

export default AppHeader;
