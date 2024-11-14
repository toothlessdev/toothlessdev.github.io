import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { NotebookPen } from "lucide-react";
import { Link } from "gatsby";
import { categoryColor, CategoryKey } from "@/constants/categories";
import { toPlainText } from "@/lib/toPlainText";

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
            <Card className="px-6 bg-[#0e1117] border-[#3d444d] text-white rounded-[8px] hover:cursor-pointer">
                <CardHeader className="px-0 py-2 flex flex-row items-center">
                    <div className="flex justify-end h-fit mt-[6px]">
                        <NotebookPen size={16} className="mr-1 flex items-center" />
                    </div>
                    <p className="font-bold text-md line-clamp-1">{title}</p>
                </CardHeader>
                <CardContent className="p-0">
                    <p className="text-sm line-clamp-2 text-[#9198a1]">{toPlainText(content)}</p>
                </CardContent>
                <CardFooter className="mb-[6px] px-0 py-2 text-[#9198a1] flex">
                    <div
                        className={`w-[12px] h-[12px] mr-1 aspect-square rounded-full`}
                        style={{
                            backgroundColor: categoryColor[category],
                        }}></div>
                    <p className="text-sm">{category}</p>
                </CardFooter>
            </Card>
        </Link>
    );
};

export interface PostCardContainerProps {
    children: React.ReactNode;
}

export const PostCardContainer = ({ children }: PostCardContainerProps) => {
    return <ul className="grid gap-2 grid-cols-1 md:grid-cols-2">{children}</ul>;
};
