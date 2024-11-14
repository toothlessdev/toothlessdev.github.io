import path from "path";
import { GatsbyNode } from "gatsby";

const postTemplate = path.resolve(`./src/templates/PostTemplate.tsx`);

export interface CreatePagesQuery {
    allMdx: {
        nodes: {
            id: string;
            frontmatter: {
                slug: string;
            };
            internal: {
                contentFilePath: string;
            };
        }[];
    };
}

export const createPages: GatsbyNode["createPages"] = async ({ graphql, actions, reporter }) => {
    const { createPage } = actions;

    const result = await graphql<CreatePagesQuery>(`
        query {
            allMdx {
                nodes {
                    id
                    frontmatter {
                        slug
                    }
                    internal {
                        contentFilePath
                    }
                }
            }
        }
    `);

    if (result.errors) {
        reporter.panicOnBuild("Error loading MDX result", result.errors);
        return;
    }

    const posts = result.data?.allMdx.nodes;

    posts?.forEach((node) => {
        createPage({
            path: `/posts${node.frontmatter.slug}`,
            component: `${postTemplate}?__contentFilePath=${node.internal.contentFilePath}`,
            context: { id: node.id },
        });
    });
};
