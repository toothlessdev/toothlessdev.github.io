<script setup>
import { useData } from "vitepress";
import { computed } from "vue";
import DefaultTheme from "vitepress/theme";
import PostComment from "@/components/PostComment/PostComment.vue";
import PostHeader from "@/components/PostHeader/PostHeader.vue";
import SidebarIndicator from "@/components/SidebarIndicator/SidebarIndicator.vue";
const { Layout } = DefaultTheme;

const { frontmatter } = useData();

const showHeader = computed(() => Boolean(frontmatter.value.title));
const showComments = computed(() => frontmatter.value.comment === true);
</script>

<template>
    <Layout>
        <template #sidebar-nav-before>
            <SidebarIndicator />
        </template>

        <template #doc-before>
            <PostHeader v-if="showHeader" />
        </template>

        <template #doc-after>
            <PostComment v-if="showComments" />
        </template>
    </Layout>
</template>
