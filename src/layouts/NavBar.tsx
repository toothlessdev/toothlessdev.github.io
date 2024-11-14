import { nav } from "@/constants/nav";
import { Link } from "gatsby";
import React from "react";

export const NavBar = () => {
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

export interface NavItemProps {
    to: string;
    children: React.ReactNode;
}

export const NavItem = ({ to, children }: NavItemProps) => {
    return (
        <li className="h-full">
            <Link
                to={to}
                className="flex h-full items-center border-b-[2px] border-[#0e1117] text-sm text-white"
                activeStyle={{
                    borderBottom: "2px solid #f78166",
                }}
            >
                {children}
            </Link>
        </li>
    );
};
