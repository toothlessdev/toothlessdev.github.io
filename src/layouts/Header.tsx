import React from "react";

import { NavTop } from "@/components/navigations/NavTop";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, Instagram, Linkedin } from "lucide-react";

export const Header = () => {
    return (
        <header className="sticky top-0 z-30 w-full border-b-[1px] border-b-[#3d444d] bg-[#02040a] px-6">
            <div className="mx-auto flex w-full max-w-[1000px] justify-between px-[10px] py-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src="https://avatars.githubusercontent.com/u/52105661?v=4" />
                        <AvatarFallback>TL</AvatarFallback>
                    </Avatar>
                    <h1 className="text-lg font-bold text-white">toothlessdev</h1>
                </div>

                <div className="flex gap-1">
                    <button
                        className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] border-[1px] border-[#9098a1]"
                        onClick={() => window.open("https://github.com/toothlessdev")}
                    >
                        <Github className="text-[#9098a1]" size={20} />
                    </button>

                    <button
                        className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] border-[1px] border-[#9098a1]"
                        onClick={() => window.open("https://github.com/toothlessdev")}
                    >
                        <Instagram className="text-[#9098a1]" size={20} />
                    </button>

                    <button
                        className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] border-[1px] border-[#9098a1]"
                        onClick={() => window.open("https://github.com/toothlessdev")}
                    >
                        <Linkedin className="text-[#9098a1]" size={20} />
                    </button>
                </div>
            </div>
            <NavTop />
        </header>
    );
};
