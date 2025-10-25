import { defineConfig } from "vitepress";
import { generateSidebar } from "./plugins/sidebar";

// @ts-ignore
import markdownItKatex from "markdown-it-katex";

import { createAutoGeneratePostsPlugin } from "./plugins/posts";

const isProduction = process.env.NODE_ENV === "production";

const GOOGLE_ANALYTICS_ID = "G-3XM039P5E6";
const NAVER_SITE_VERIFICATION_CODE = "db7f3601aa486190aa58c3e09dcd7f35a784543e";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    lang: "ko-KR",
    title: "🦷 ToothlessDev",
    description: "A VitePress Site",
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: "Home", link: "/" },
            {
                text: "Blog",
                items: [
                    { text: "전체", link: "/posts/" },
                    { text: "Web", link: "/posts/Web/" },
                    { text: "JavaScript", link: "/posts/JavaScript/" },
                    { text: "React", link: "/posts/React/" },
                ],
            },
            { text: "Projects", link: "/projects/" },
        ],

        sidebar: {
            "/posts/": generateSidebar("posts", "/posts"),
            "/projects/": generateSidebar("projects", "/projects"),
        },

        socialLinks: [{ icon: "github", link: "https://github.com/toothlessdev" }],

        search: {
            provider: "local",
        },
    },

    sitemap: {
        hostname: "https://toothlessdev.github.io/",
    },

    rewrites: {
        "contents/posts/index.md": "posts/index.md",
        "contents/posts/:slug*": "posts/:slug*",
        "contents/projects/index.md": "projects/index.md",
        "contents/projects/:slug*": "projects/:slug*",
    },

    markdown: {
        config: (md) => {
            md.use(markdownItKatex);
        },
    },

    vite: {
        resolve: {
            alias: [{ find: "@", replacement: "/src" }],
        },
        plugins: [createAutoGeneratePostsPlugin()],
    },

    head: [
        [
            "script",
            {
                async: "",
                src: isProduction
                    ? `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`
                    : "",
            },
        ],
        [
            "script",
            {},
            isProduction
                ? `
                window.dataLayer = window.dataLayer || [];
                function gtag() { dataLayer.push(arguments); }
                gtag('js', new Date());
                gtag('config', '${GOOGLE_ANALYTICS_ID}');
            `
                : "",
        ],
        [
            "meta",
            {
                name: "naver-site-verification",
                content: NAVER_SITE_VERIFICATION_CODE,
            },
        ],
    ],
});
