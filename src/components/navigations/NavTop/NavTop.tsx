import React from "react";
import { NavItem } from "./NavItem";
import { nav } from "@/constants/nav";

export const NavTop = () => {
    return (
        <nav className="mx-auto w-full max-w-[1000px] bg-[#02040a] px-[10px]">
            <ul className="flex h-[40px] gap-4">
                {nav.map((item) => {
                    return <NavItem {...item} />;
                })}
            </ul>
        </nav>
    );
};
