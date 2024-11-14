import React from "react";

import { RootLayout } from "@/layouts/RootLayout";

import { graphql, PageProps } from "gatsby";
import { PostCard, PostCardContainer } from "@/components/displays/PostCard";
import { CategoryKey } from "@/constants/categories";
import { Hero } from "@/components/displays/Hero";

interface Data {
    pinned: {
        edges: Post<CategoryKey>[];
    };
    recent: {
        edges: Post<CategoryKey>[];
    };
}

export default function HomePage({ data }: PageProps<Data>) {
    const pinnedPosts = data.pinned.edges;
    const recentPosts = data.recent.edges;

    return (
        <RootLayout>
            <Hero></Hero>

            <section>
                <div className="flex text-white py-2">
                    <p>Pinned</p>
                </div>

                <PostCardContainer>
                    {pinnedPosts.map((post) => (
                        <PostCard
                            key={post.node.id}
                            slug={post.node.frontmatter.slug}
                            title={post.node.frontmatter.title}
                            content={`
                                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ea quis, impedit ipsa nobis blanditiis dolorem, nemo quod tempora sequi consequatur numquam accusamus
                                recusandae, eligendi amet alias veritatis dolorum animi atque?
                            `}
                            category={post.node.frontmatter.category}
                            date={post.node.frontmatter.date}></PostCard>
                    ))}
                </PostCardContainer>
            </section>

            <section>
                <div className="flex text-white py-2">
                    <p>Recent Posts</p>
                </div>

                <PostCardContainer>
                    {recentPosts.map((post) => (
                        <PostCard
                            key={post.node.id}
                            slug={post.node.frontmatter.slug}
                            title={post.node.frontmatter.title}
                            content={post.node.body}
                            category={post.node.frontmatter.category}
                            date={post.node.frontmatter.date}></PostCard>
                    ))}
                </PostCardContainer>
            </section>
        </RootLayout>
    );
}

export const query = graphql`
    query {
        pinned: allMdx(filter: { frontmatter: { pinned: { eq: true } } }, sort: { frontmatter: { date: DESC } }, limit: 4) {
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
        recent: allMdx(sort: { frontmatter: { date: DESC } }, limit: 4) {
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
