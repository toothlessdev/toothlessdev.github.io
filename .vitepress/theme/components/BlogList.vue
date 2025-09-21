<template>
    <div class="blog-list">
        <div class="blog-cards">
            <article
                v-for="post in sortedPosts"
                :key="post.url"
                class="blog-card"
                @click="navigateToPost(post.url)"
            >
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
                            <span class="blog-card-category-name">{{
                                post.frontmatter.category
                            }}</span>
                        </div>
                        <time class="blog-card-date">
                            {{ formatDate(post.frontmatter.createdAt) }}
                        </time>
                    </div>
                </div>
            </article>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { posts } from "../../data/posts";
import { getCategoryColor } from "../constants/colors";
import "./BlogList.css";

interface Props {
    category?: string;
}

const props = withDefaults(defineProps<Props>(), {
    category: undefined,
});

const sortedPosts = computed(() => {
    if (props.category) {
        return posts.filter(
            (post) => post.frontmatter.category.toLowerCase() === props.category!.toLowerCase(),
        );
    }
    return posts;
});

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
