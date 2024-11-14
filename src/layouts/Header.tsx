import React from "react";

import { NavBar } from "./NavBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
    return (
        <header className=" w-full border-b-[#3d444d] border-b-[1px] bg-[#02040a] sticky top-0">
            <div className="flex justify-between w-full max-w-[1000px] mx-auto px-[10px] py-4">
                <div className="flex items-center gap-4">
                    <Avatar className="w-10 h-10">
                        <AvatarImage src="https://avatars.githubusercontent.com/u/52105661?v=4" />
                        <AvatarFallback>TL</AvatarFallback>
                    </Avatar>

                    <h1 className="text-white font-bold text-lg">toothlessdev</h1>
                </div>

                <div className="flex gap-1">
                    <button className="w-[30px] h-[30px] flex items-center justify-center rounded-[8px] border-[1px] border-[#9098a1]" onClick={() => window.open("https://github.com/toothlessdev")}>
                        <Github className="text-[#9098a1]" size={20} />
                    </button>

                    <button className="w-[30px] h-[30px] flex items-center justify-center rounded-[8px] border-[1px] border-[#9098a1]" onClick={() => window.open("https://github.com/toothlessdev")}>
                        <Instagram className="text-[#9098a1]" size={20} />
                    </button>

                    <button className="w-[30px] h-[30px] flex items-center justify-center rounded-[8px] border-[1px] border-[#9098a1]" onClick={() => window.open("https://github.com/toothlessdev")}>
                        <Linkedin className="text-[#9098a1]" size={20} />
                    </button>
                </div>
            </div>
            <NavBar />
        </header>
    );
};
