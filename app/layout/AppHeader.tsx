import React, { useState } from "react";
import UserDropdown from "../components/header/UserDropdown";
import Menu from "../components/header/Menu";

const AppHeader: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    console.log(isOpen, "llllll")
    return (
        <header className="fixed  w-full mb-10 bg-pink-100">
            <div className="flex items-center justify-between px-3 py-3">
                <div className="relative">
                    <div className="md:hidden" onClick={() => setIsOpen(v => !v)}>
                        Menu
                    </div>

                    <div onClick={() => setIsOpen(() => false)} className={"absolute -left-3 md:left-0 md:-top-3 top-10 z-50 md:z-0 px-2 bg-pink-50 md:bg-transparent md:shadow-none shadow md:block " + (isOpen ? "hidden" : "block")}>
                        <Menu />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <UserDropdown />
                </div>
            </div>
        </header>
    );
};

export default AppHeader;
