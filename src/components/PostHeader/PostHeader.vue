<script setup lang="ts">
import { useData, useRoute, withBase } from "vitepress";
import { computed } from "vue";
import { formatDate } from "@/utils/date";
import { getCategoryColor } from "@/constants/colors";

const { frontmatter } = useData();
const route = useRoute();

const title = computed(() => frontmatter.value.title || "");
const description = computed(() => frontmatter.value.description || "");
const createdAt = computed(() => frontmatter.value.createdAt || "");

/** 사이드바 카테고리와 같은 이름과 링크를 쓰도록 contents/posts 아래 폴더 이름을 씁니다. */
const categoryFolder = computed(() => route.path.split("/")[2] || "");
</script>

<template>
    <header class="post-header">
        <a
            v-if="categoryFolder"
            class="post-header-category"
            :href="withBase(`/posts/${categoryFolder}/`)"
        >
            <span
                class="post-header-category-dot"
                :style="{ backgroundColor: getCategoryColor(categoryFolder) }"
            />
            {{ categoryFolder }}
        </a>
        <h1 class="post-header-title">{{ title }}</h1>
        <p v-if="description" class="post-header-description">{{ description }}</p>
        <time v-if="createdAt" class="post-header-date" :datetime="createdAt">{{
            formatDate(createdAt)
        }}</time>
    </header>
</template>

<style>
@import "./PostHeader.css";
</style>
