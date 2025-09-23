// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import PostCardList from "@/components/PostCardList/PostCardList.vue";
import PostLayout from "@/components/PostLayout/PostLayout.vue";
import "./style.css";

export default {
    extends: DefaultTheme,
    Layout: PostLayout,
    enhanceApp({ app, router, siteData }) {
        app.component("PostCardList", PostCardList);
    },
} satisfies Theme;
