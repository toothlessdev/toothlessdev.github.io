<script setup>
import { useData } from "vitepress";
import DefaultTheme from "vitepress/theme";
import PostComment from "@/components/PostComment/PostComment.vue";
const { Layout } = DefaultTheme;

const { frontmatter } = useData();

const showComments = frontmatter.value.comment === true;
</script>

<template>
    <Layout>
        <template #doc-after>
            <PostComment v-if="showComments" />
        </template>
    </Layout>
</template>
