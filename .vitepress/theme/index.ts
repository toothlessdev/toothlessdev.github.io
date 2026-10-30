// https://vitepress.dev/guide/custom-theme
import { inBrowser, type Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import Giscus from "@giscus/vue";
import HomePage from "@/components/HomePage/HomePage.vue";
import PostCardList from "@/components/PostCardList/PostCardList.vue";
import PostLayout from "@/components/PostLayout/PostLayout.vue";
import { enableSmoothOutlineScroll } from "@/utils/smoothOutlineScroll";
import "./style.css";

export default {
    extends: DefaultTheme,
    Layout: PostLayout,
    enhanceApp({ app }) {
        app.component("HomePage", HomePage);
        app.component("PostCardList", PostCardList);
        app.component("Giscus", Giscus);

        if (inBrowser) enableSmoothOutlineScroll();
    },
} satisfies Theme;
