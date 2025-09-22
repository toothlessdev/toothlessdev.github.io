import { defineConfig } from "vitepress";
import { generateSidebar } from "./plugins/sidebar";

import { createAutoGeneratePostsPlugin } from "./plugins/posts";

const GOOGLE_ANALYTICS_ID = "G-3XM039P5E6";
const NAVER_SITE_VERIFICATION_CODE = "596cb41268d676e378deaba826716cd18229d0b1";

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

    rewrites: {
        "pages/posts/index.md": "posts/index.md",
        "pages/posts/:slug*": "posts/:slug*",
        "pages/projects/index.md": "projects/index.md",
        "pages/projects/:slug*": "projects/:slug*",
    },

    vite: {
        plugins: [createAutoGeneratePostsPlugin()],
    },

    head: [
        [
            "script",
            {
                async: "",
                src: `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`,
            },
        ],
        [
            "script",
            {},
            `
                window.dataLayer = window.dataLayer || [];
                function gtag() { dataLayer.push(arguments); }
                gtag('js', new Date());
                gtag('config', '${GOOGLE_ANALYTICS_ID}');
            `,
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
