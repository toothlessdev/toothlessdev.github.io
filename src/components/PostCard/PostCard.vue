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
import "./PostCard.css";

interface Post {
    url: string;
    frontmatter: {
        title: string;
        createdAt: string;
        category: string;
        description: string;
    };
}

interface Props {
    post: Post;
}

defineProps<Props>();

// 날짜 포맷팅 함수 (yyyy-mm-dd 형식)
function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date
        .toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        })
        .replace(/\. /g, "-")
        .replace(/\.$/, "");
}

function navigateToPost(url: string) {
    window.location.href = url;
}
</script>
