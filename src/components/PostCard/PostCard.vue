<template>
    <article class="blog-card" @click="navigateToPost(post.url)">
        <div class="blog-card-content">
            <h3 class="blog-card-title">
                {{ post.frontmatter.title }}
            </h3>

            <p class="blog-card-description">
                {{ post.frontmatter.description }}
            </p>

            <div class="blog-card-footer">
                <div class="blog-card-meta">
                    <span
                        class="blog-card-category-indicator"
                        :style="{
                            backgroundColor: getCategoryColor(post.frontmatter.category),
                        }"
                    ></span>
                    <span class="blog-card-category-name">{{ post.frontmatter.category }}</span>
                </div>
                <time class="blog-card-date">
                    {{ formatDate(post.frontmatter.createdAt) }}
                </time>
            </div>
        </div>
    </article>
</template>

<script setup lang="ts">
import { getCategoryColor } from "@/constants/colors";
import { formatDate } from "@/utils/date";
import type { Post } from "@/models/PostModel";
import "./PostCard.css";

interface Props {
    post: Post;
}

defineProps<Props>();

function navigateToPost(url: string) {
    window.location.href = url;
}
</script>
