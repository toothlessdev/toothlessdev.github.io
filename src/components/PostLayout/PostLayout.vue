<script setup>
import { computed } from "vue";
import { useData } from "vitepress";
import DefaultTheme from "vitepress/theme";
import PostComment from "@/components/PostComment/PostComment.vue";
const { Layout } = DefaultTheme;

const COMMENT_THEME_DARK = "photon-dark";
const COMMENT_THEME_LIGHT = "github-light";

const { frontmatter, page, isDark } = useData();

const commentTheme = computed(() => (isDark.value ? COMMENT_THEME_DARK : COMMENT_THEME_LIGHT));
</script>

<template>
    <Layout>
        <template #doc-after>
            <PostComment
                v-if="frontmatter.comment"
                :key="page.relativePath"
                :theme="commentTheme"
            ></PostComment>
        </template>
    </Layout>
</template>
