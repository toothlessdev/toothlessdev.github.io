import React from "react";

import { RootLayout } from "@/layouts/RootLayout";
import { graphql, PageProps } from "gatsby";
import { CategoryKey } from "@/constants/categories";
import { CategoryMenu } from "@/components/navigations/CategoryMenu";
import { PostListItem } from "@/components/displays/PostList/PostListItem";
import { Filter } from "@/components/forms/Filter/Filter";

interface Data {
    allMdx: {
        edges: Post<CategoryKey>[];
    };
}

export default function PostPage({ data }: PageProps<Data>) {
    const posts = data.allMdx.edges;

    return (
        <RootLayout className="flex">
            <CategoryMenu />

            <section className="w-[70%] p-2">
                <div className="flex items-center justify-between text-white">
                    <p className="font-bold">Posts</p>
                    <Filter></Filter>
                </div>

                <div className="grid grid-cols-1 gap-2">
                    {posts.map((post) => (
                        <PostListItem
                            key={post.node.id}
                            slug={post.node.frontmatter.slug}
                            title={post.node.frontmatter.title}
                            content={post.node.body}
                            category={post.node.frontmatter.category}
                            date={post.node.frontmatter.date}
                        ></PostListItem>
                    ))}
                </div>

                {/* <PageNavigation></PageNavigation> */}
            </section>
        </RootLayout>
    );
}

export const query = graphql`
    query {
        allMdx(filter: { frontmatter: { pinned: { eq: true } } }, sort: { frontmatter: { date: DESC } }, limit: 10) {
            edges {
                node {
                    id
                    frontmatter {
                        title
                        date(formatString: "MMMM DD, YYYY")
                        category
                        slug
                    }
                    body
                }
            }
        }
    }
`;
