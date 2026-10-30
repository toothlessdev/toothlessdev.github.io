import { defineConfig } from "vitepress";
import { generateSidebar } from "./plugins/sidebar";

// @ts-ignore
import markdownItKatex from "markdown-it-katex";

import { createAutoGeneratePostsPlugin } from "./plugins/posts";
import { createImageOptimizerPlugin } from "./plugins/image-optimizer";
import { markdownPicturePlugin } from "./plugins/markdown-picture";
import { writeRedirectPages } from "./plugins/redirects";
import { oldPathToNewPath } from "./redirects";
import { withMermaid } from "vitepress-plugin-mermaid";

const isProduction = process.env.NODE_ENV === "production";

const SITE_HOSTNAME = "https://toothlessdev.github.io/";

const GOOGLE_ANALYTICS_ID = "G-3XM039P5E6";
const NAVER_SITE_VERIFICATION_CODE = "db7f3601aa486190aa58c3e09dcd7f35a784543e";

// https://vitepress.dev/reference/site-config
export default withMermaid(
    defineConfig({
        lang: "ko-KR",
        title: "🦷 ToothlessDev",
        description: "A VitePress Site",

        /**
         * 글 목록 페이지(카테고리 index.md)는 목차가 없는데도 오른쪽 aside 자리를 차지해서 본문 폭이 줄어듭니다.
         * 홈과 같은 본문 폭을 쓰도록 createdAt 이 없는 posts 아래 페이지는 aside 를 끕니다.
         */
        transformPageData(pageData) {
            const isPostListPage =
                pageData.relativePath.startsWith("posts/") && !pageData.frontmatter.createdAt;
            if (isPostListPage) pageData.frontmatter.aside ??= false;
        },

        themeConfig: {
            // https://vitepress.dev/reference/default-theme-config
            siteTitle: "toothlessdev",
            logo: { light: "/logo-light.svg", dark: "/logo-dark.svg", alt: "" },

            nav: [{ text: "Blog", link: "/posts/", activeMatch: "^/posts/" }],

            sidebarMenuLabel: "카테고리",
            returnToTopLabel: "맨 위로",
            darkModeSwitchLabel: "다크 모드",
            lightModeSwitchTitle: "라이트 모드로 전환",
            darkModeSwitchTitle: "다크 모드로 전환",
            outline: { label: "목차" },
            docFooter: { prev: "이전 글", next: "다음 글" },

            sidebar: {
                "/posts/": generateSidebar("posts", "/posts"),
                "/projects/": generateSidebar("projects", "/projects"),
            },

            socialLinks: [{ icon: "github", link: "https://github.com/toothlessdev" }],

            search: {
                provider: "local",
                options: {
                    translations: {
                        button: { buttonText: "검색", buttonAriaLabel: "글 검색" },
                        modal: {
                            displayDetails: "본문 미리보기",
                            resetButtonTitle: "검색어 지우기",
                            backButtonTitle: "닫기",
                            noResultsText: "검색 결과가 없습니다",
                            footer: {
                                selectText: "열기",
                                navigateText: "이동",
                                closeText: "닫기",
                            },
                        },
                    },
                },
            },
        },

        sitemap: {
            hostname: SITE_HOSTNAME,
        },

        async buildEnd(siteConfig) {
            await writeRedirectPages(siteConfig.outDir, SITE_HOSTNAME, oldPathToNewPath);
        },

        rewrites: {
            "contents/archive/:slug*": "archive/:slug*",
            "contents/posts/index.md": "posts/index.md",
            "contents/posts/:slug*": "posts/:slug*",
            "contents/projects/index.md": "projects/index.md",
            "contents/projects/:slug*": "projects/:slug*",
        },

        markdown: {
            config: (md) => {
                md.use(markdownItKatex);
                md.use(markdownPicturePlugin);
            },
        },

        vite: {
            resolve: {
                alias: [{ find: "@", replacement: "/src" }],
            },
            plugins: [
                createAutoGeneratePostsPlugin(),
                createImageOptimizerPlugin({
                    formats: ["webp", "jpeg"],
                    webpQuality: 90,
                    jpegQuality: 90,
                }),
            ],
        },

        head: [
            ["link", { rel: "preconnect", href: "https://cdn.jsdelivr.net", crossorigin: "" }],
            [
                "link",
                {
                    rel: "stylesheet",
                    href: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css",
                },
            ],
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
    }),
);
