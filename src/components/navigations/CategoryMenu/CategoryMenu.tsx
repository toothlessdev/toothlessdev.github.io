import React from "react";
import { graphql, useStaticQuery } from "gatsby";

import { CategoryMenuItem } from ".";
import { CategoryKey } from "@/constants/categories";

export interface CategoryMenuQuery {
    allMdx: {
        group: {
            edges: {
                node: {
                    frontmatter: {
                        title: string;
                        category: CategoryKey;
                        slug: string;
                    };
                };
            }[];
        }[];
    };
}

export const categoryMenuQuery = graphql`
    query {
        allMdx {
            group(field: { frontmatter: { category: SELECT } }) {
                edges {
                    node {
                        frontmatter {
                            title
                            category
                            slug
                        }
                    }
                }
            }
        }
    }
`;

export const CategoryMenu = () => {
    const data = useStaticQuery<CategoryMenuQuery>(categoryMenuQuery);

    const categories = data.allMdx.group.map((category) => {
        return {
            category: category.edges[0].node.frontmatter.category,
            content: category.edges.map((post) => {
                return {
                    title: post.node.frontmatter.title,
                    slug: post.node.frontmatter.slug,
                };
            }),
        };
    });

    return (
        <aside className="w-[30%] p-2 text-white">
            <h2 className="font-bold">Categories</h2>
            <nav className="py-2">
                {categories.map((category) => {
                    return <CategoryMenuItem category={category.category} contents={category.content} />;
                })}
            </nav>
        </aside>
    );
};
