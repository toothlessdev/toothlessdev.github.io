<script setup lang="ts">
import { useData } from "vitepress";
import { computed } from "vue";
import { formatDate } from "@/utils/date";

const { frontmatter } = useData();

const title = computed(() => frontmatter.value.title || "");
const createdAt = computed(() => frontmatter.value.createdAt || "");
const category = computed(() => frontmatter.value.category || "");
const description = computed(() => frontmatter.value.description || "");
</script>

<template>
    <header class="post-header">
        <h1 class="post-title">{{ title }}</h1>

        <div class="post-meta">
            <span v-if="category" class="category-tag">{{ category }}</span>
            <time v-if="createdAt" class="created-date">{{ formatDate(createdAt) }}</time>
        </div>
    </header>
</template>

<style>
@import "./PostHeader.css";
</style>
