import React from "react";
import { graphql } from "gatsby";
import { MDXProvider } from "@mdx-js/react";
import { RootLayout } from "@/layouts/RootLayout";
import dayjs from "dayjs";
import { mdxComponents } from "@/config/mdx";

interface PageTemplateProps {
    data: {
        mdx: {
            frontmatter: {
                title: string;
                date: string;
                category: string;
            };
        };
    };
    children: React.ReactNode;
}

export default function PageTemplate({ data, children }: PageTemplateProps) {
    return (
        <RootLayout>
            <div className="border-b-[1px] border-[#3c444d] py-4">
                <h1 className="line-clamp-1 text-xl font-bold text-white">{data.mdx.frontmatter.title}</h1>
                <p className="text-[#8f97a0]">{dayjs(data.mdx.frontmatter.date).format("YYYY-MM-DD")}</p>
            </div>
            <div className="markdown" style={{ width: "100%", maxWidth: "auto" }}>
                <MDXProvider components={mdxComponents}>{children}</MDXProvider>
            </div>
        </RootLayout>
    );
}

export const query = graphql`
    query ($id: String!) {
        mdx(id: { eq: $id }) {
            frontmatter {
                title
                date
                category
            }
        }
    }
`;
