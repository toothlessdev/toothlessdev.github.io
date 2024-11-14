import { nav } from "@/constants/nav";
import { Link } from "gatsby";
import React from "react";

export const NavBar = () => {
    return (
        <nav className="w-full max-w-[1000px] mx-auto px-[10px] bg-[#02040a]">
            <ul className="flex gap-4 h-[40px]">
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
                className="flex items-center h-full text-white text-sm border-b-[2px] border-[#0e1117]"
                activeStyle={{
                    borderBottom: "2px solid #f78166",
                }}>
                {children}
            </Link>
        </li>
    );
};
