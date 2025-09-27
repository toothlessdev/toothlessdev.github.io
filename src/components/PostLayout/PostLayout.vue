<script setup>
import { useData } from "vitepress";
import DefaultTheme from "vitepress/theme";
import PostComment from "@/components/PostComment/PostComment.vue";
const { Layout } = DefaultTheme;

const { frontmatter } = useData();

// comments가 false가 아닌 경우 댓글을 표시 (기본값은 true)
const showComments = frontmatter.value.comments !== false;
</script>

<template>
    <Layout>
        <template #doc-after>
            <PostComment v-if="showComments" />
        </template>
    </Layout>
</template>
