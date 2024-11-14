import React from "react";

export interface PostCardContainerProps {
    children: React.ReactNode;
}

export const PostCardContainer = ({ children }: PostCardContainerProps) => {
    return <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">{children}</ul>;
};
