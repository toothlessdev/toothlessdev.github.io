import { graphql, Link, useStaticQuery } from "gatsby";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import React from "react";
import { categoryColor, CategoryKey } from "@/constants/categories";

interface CategoryMenuQuery {
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

export const CategoryMenu = () => {
    const data = useStaticQuery<CategoryMenuQuery>(graphql`
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
    `);

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
        <aside className="text-white w-[30%] p-2">
            <h2 className="font-bold">Categories</h2>
            <nav className="py-2">
                {categories.map((category) => {
                    return <CategoryMenuItem category={category.category} contents={category.content} />;
                })}
            </nav>
        </aside>
    );
};

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
                <AccordionTrigger className="h-[22px] px-2 rounded-[4px] border-none hover:bg-[#161a21]">
                    <div className="flex justify-start items-center hover:no-underline">
                        <div className="w-[12px] h-[12px] mr-1 rounded-full" style={{ backgroundColor: categoryColor[category] }} />
                        <p className="hover:no-underline">{category}</p>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                    {contents.map((content) => {
                        return (
                            <Link to={`/posts${content.slug}`}>
                                <p className="pl-8 py-1.5">{content.title}</p>
                            </Link>
                        );
                    })}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};