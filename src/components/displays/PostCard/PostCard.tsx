import React from "react";

import { NotebookPen } from "lucide-react";
import { Link } from "gatsby";
import { categoryColor, CategoryKey } from "@/constants/categories";
import { toPlainText } from "@/lib/toPlainText";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export interface PostCardProps {
    slug: string;

    title: string;
    category: CategoryKey;
    content: string;
    date: string;
}

export const PostCard = ({ slug, title, category, content, date }: PostCardProps) => {
    return (
        <Link to={`/posts${slug}`} className="hover:cursor-pointer">
            <Card className="rounded-[8px] border-[#3d444d] bg-[#0e1117] px-6 text-white hover:cursor-pointer">
                <CardHeader className="flex flex-row items-center px-0 py-2">
                    <div className="mt-[6px] flex h-fit justify-end">
                        <NotebookPen size={16} className="mr-1 flex items-center" />
                    </div>
                    <p className="text-md line-clamp-1 font-bold">{title}</p>
                </CardHeader>
                <CardContent className="p-0">
                    <p className="line-clamp-2 text-sm text-[#9198a1]">{toPlainText(content)}</p>
                </CardContent>
                <CardFooter className="mb-[6px] flex px-0 py-2 text-[#9198a1]">
                    <div
                        className={`mr-1 aspect-square h-[12px] w-[12px] rounded-full`}
                        style={{ backgroundColor: categoryColor[category] }}
                    />
                    <p className="text-sm">{category}</p>
                </CardFooter>
            </Card>
        </Link>
    );
};
