<template>
    <a class="post-row" :href="withBase(post.url)">
        <span class="post-row-title">{{ post.frontmatter.title }}</span>
        <span class="post-row-description">{{ post.frontmatter.description }}</span>
        <span class="post-row-meta">
            <span class="post-row-meta-item">
                <svg viewBox="0 0 16 16" aria-hidden="true">
                    <g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
                        <rect x="2.5" y="3.5" width="11" height="10" rx="2" />
                        <path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" />
                    </g>
                </svg>
                <time :datetime="post.frontmatter.createdAt">{{
                    formatDate(post.frontmatter.createdAt)
                }}</time>
            </span>
            <span v-if="showCategory" class="post-row-meta-item">
                <span
                    class="post-row-category-dot"
                    :style="{ backgroundColor: getCategoryColor(category) }"
                />
                {{ category }}
            </span>
        </span>
    </a>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { withBase } from "vitepress";
import { getCategoryColor } from "@/constants/colors";
import { formatDate } from "@/utils/date";
import type { Post } from "@/models/PostModel";
import "./PostCard.css";

interface Props {
    post: Post;
    showCategory?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    showCategory: true,
});

/** 사이드바와 같은 이름과 색을 쓰도록 frontmatter 대신 contents/posts 아래 폴더 이름을 씁니다. */
const category = computed(() => props.post.url.split("/")[2] ?? props.post.frontmatter.category);
</script>
