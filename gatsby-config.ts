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
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "pages",
                path: "./src/pages/",
            },
            __key: "pages",
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
        {
            resolve: `gatsby-plugin-mdx`,
            options: {
                extensions: [`mdx`, `md`],
                gatsbyRemarkPlugins: [
                    {
                        resolve: "gatsby-remark-mdx-relative-images",
                        options: {
                            staticFolderName: path.join(__dirname, "static"),
                        },
                    },
                    {
                        resolve: `gatsby-remark-images`,
                        options: {
                            maxWidth: 590,
                        },
                    },
                ],
            },
        },
        "gatsby-plugin-image",
        "gatsby-plugin-sharp",
        "gatsby-transformer-sharp",
    ],
};

export default config;
