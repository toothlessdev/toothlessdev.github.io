<template>
    <div class="blog-list">
        <div class="blog-cards">
            <PostCard v-for="post in sortedPosts" :key="post.url" :post="post" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { posts } from "../../../.vitepress/data/posts";
import { computed } from "vue";
import PostCard from "../PostCard/PostCard.vue";
import "./PostCardList.css";

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
</script>
