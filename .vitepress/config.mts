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
                    { text: "전체", link: "/pages/posts/" },
                    { text: "JavaScript", link: "/pages/posts/javascript/" },
                    { text: "React", link: "/pages/posts/react/" },
                    { text: "Vue.js", link: "/pages/posts/vue/" },
                    { text: "백엔드", link: "/pages/posts/backend/" },
                    { text: "WEB", link: "/pages/posts/web/" },
                ],
            },
        ],

        sidebar: {
            "/pages/posts/": generateSidebar(),

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

    vite: {
        plugins: [createAutoGeneratePostsPlugin()],
    },
});
