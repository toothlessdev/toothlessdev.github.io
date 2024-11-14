import React from "react";
import { categoryColor, CategoryKey } from "@/constants/categories";
import { Link } from "gatsby";
import { toPlainText } from "@/lib/toPlainText";

export interface PostCardProps {
    slug: string;

    title: string;
    category: CategoryKey;
    content: string;
    date: string;
}

export const PostListItem = ({ slug, title, category, content, date }: PostCardProps) => {
    return (
        <Link to={`/posts${slug}`}>
            <div className="border-b-[1px] border-[#3d444d] py-4">
                <h1 className="pb-2 text-xl font-bold text-white hover:underline">{title}</h1>
                <p className="line-clamp-2 text-sm text-[#9198a1]">{toPlainText(content)}</p>
                <div className="flex items-center py-2">
                    <div
                        className={`mr-1 aspect-square h-[12px] w-[12px] rounded-full`}
                        style={{
                            backgroundColor: categoryColor[category],
                        }}
                    ></div>
                    <p className="text-sm text-[#9198a1]">{category}</p>
                </div>
            </div>
        </Link>
    );
};
