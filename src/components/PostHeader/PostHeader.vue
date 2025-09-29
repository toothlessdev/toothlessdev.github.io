<script setup lang="ts">
import { useData } from "vitepress";
import { computed } from "vue";
import { formatDate } from "@/utils/date";
import { getCategoryColor } from "@/constants/colors";

const { frontmatter } = useData();

const title = computed(() => frontmatter.value.title || "");
const createdAt = computed(() => frontmatter.value.createdAt || "");
const category = computed(() => frontmatter.value.category || "");
</script>

<template>
    <header class="post-header">
        <h1 class="post-title">{{ title }}</h1>

        <div class="post-meta">
            <div class="post-category" v-if="category">
                <span
                    class="category-indicator"
                    :style="{ backgroundColor: getCategoryColor(category) }"
                />
                <span class="category-tag">{{ category }}</span>
            </div>
            <time v-if="createdAt" class="created-date">{{ formatDate(createdAt) }}</time>
        </div>
    </header>
</template>

<style>
@import "./PostHeader.css";
</style>
