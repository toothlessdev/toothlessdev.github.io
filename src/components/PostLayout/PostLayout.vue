<script setup>
import { useData } from "vitepress";
import DefaultTheme from "vitepress/theme";
import PostComment from "@/components/PostComment/PostComment.vue";
import PostHeader from "@/components/PostHeader/PostHeader.vue";
const { Layout } = DefaultTheme;

const { frontmatter } = useData();

const showHeader = Boolean(frontmatter.value.title);
const showComments = frontmatter.value.comment === true;
</script>

<template>
    <Layout>
        <template #doc-before>
            <PostHeader v-if="showHeader" />
        </template>

        <template #doc-after>
            <PostComment v-if="showComments" />
        </template>
    </Layout>
</template>
