import React from "react";

import { Header } from "./Header";
import { cn } from "@/lib/utils";

export interface RootLayoutProps {
    className?: string;
    children: React.ReactNode;
}

export const RootLayout = ({ children, className }: RootLayoutProps) => {
    return (
        <>
            <Header />
            <main className={cn("w-full max-w-[1000px] mx-auto p-[10px]", className)}>{children}</main>
        </>
    );
};
