import type { GatsbyConfig } from "gatsby";
import path from "path";

const config: GatsbyConfig = {
    pathPrefix: "/",
    siteMetadata: {
        title: `toothlessdev`,
        siteUrl: `https://toothlessdev.github.io`,
    },
    graphqlTypegen: true,
    plugins: [
        "gatsby-plugin-postcss",
        "gatsby-plugin-image",
        "gatsby-plugin-sharp",
        "gatsby-transformer-sharp",
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "images",
                path: "./src/images/",
            },
            __key: "images",
        },
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "pages",
                path: "./src/pages/",
            },
            __key: "pages",
        },
        {
            resolve: `gatsby-plugin-mdx`,
            options: {
                extensions: [`mdx`, `md`],
                gatsbyRemarkPlugins: [
                    {
                        resolve: `gatsby-remark-images`,
                        options: {
                            maxWidth: 590,
                        },
                    },
                ],
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `posts`,
                path: `${__dirname}/content/posts`,
            },
            __key: "posts",
        },
        {
            resolve: `gatsby-plugin-alias-imports`,
            options: {
                alias: {
                    "@": path.resolve(__dirname, "src"),
                },
                extensions: [],
            },
        },
    ],
};

export default config;
