import { defineConfig } from "vitepress";
import { generateSidebar } from "./plugins/sidebar";

import { createAutoGeneratePostsPlugin } from "./plugins/posts";

// https://vitepress.dev/reference/site-config
export default defineConfig({
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
                    { text: "JavaScript", link: "/posts/javascript/" },
                    { text: "React", link: "/posts/react/" },
                    { text: "Vue.js", link: "/posts/vue/" },
                    { text: "백엔드", link: "/posts/backend/" },
                    { text: "WEB", link: "/posts/web/" },
                ],
            },
            { text: "Projects", link: "/projects/" },
        ],

        sidebar: {
            "/posts/": generateSidebar("posts", "/posts"),
            "/projects/": generateSidebar("projects", "/projects"),

            "/": [
                {
                    text: "Examples",
                    items: [
                        { text: "Markdown Examples", link: "/markdown-examples" },
                        { text: "Runtime API Examples", link: "/api-examples" },
                    ],
                },
            ],
        },

        socialLinks: [{ icon: "github", link: "https://github.com/toothlessdev" }],
    },

    sitemap: {
        hostname: "https://toothlessdev.github.io/",
    },

    // URL 리라이트 설정 - /posts/* -> /pages/posts/*
    rewrites: {
        "pages/posts/index.md": "posts/index.md",
        "pages/posts/:slug*": "posts/:slug*",
        "pages/projects/index.md": "projects/index.md",
        "pages/projects/:slug*": "projects/:slug*",
    },

    vite: {
        plugins: [createAutoGeneratePostsPlugin()],
    },
});
