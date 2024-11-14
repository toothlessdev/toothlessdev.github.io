import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { categoryColor, CategoryKey } from "@/constants/categories";
import { Link } from "gatsby";
import React from "react";

export interface CategoryMenuItemProps {
    category: CategoryKey;
    contents: {
        title: string;
        slug: string;
    }[];
}

export const CategoryMenuItem = ({ category, contents }: CategoryMenuItemProps) => {
    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-none">
                <AccordionTrigger className="h-[22px] rounded-[4px] border-none px-2 hover:bg-[#161a21]">
                    <div className="flex items-center justify-start hover:no-underline">
                        <div
                            className="mr-1 h-[12px] w-[12px] rounded-full"
                            style={{ backgroundColor: categoryColor[category] }}
                        />
                        <p className="hover:no-underline">{category}</p>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                    {contents.map((content) => {
                        return (
                            <Link to={`/posts${content.slug}`}>
                                <p className="overflow-hidden text-ellipsis text-nowrap py-2 pl-8 hover:underline">
                                    {content.title}
                                </p>
                            </Link>
                        );
                    })}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};
