import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";

export const Filter = () => {
    return (
        <Select>
            <SelectTrigger className="w-[120px] rounded-[6px]">
                <SelectValue placeholder="Sort By" className="rounded-[6px]" />
            </SelectTrigger>
            <SelectContent className="hover:bg- rounded-[6px] bg-[#0f1117]">
                <SelectItem value="date">Date</SelectItem>
            </SelectContent>
        </Select>
    );
};
