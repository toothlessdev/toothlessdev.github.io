<template>
    <div ref="listRef" class="post-list">
        <PostCard
            v-for="post in pagePosts"
            :key="post.url"
            :post="post"
            :show-category="!category"
        />

        <nav v-if="pageCount > 1" class="post-pagination" aria-label="페이지">
            <button
                class="post-page-button"
                :disabled="currentPage === 1"
                aria-label="이전 페이지"
                @click="goToPage(currentPage - 1)"
            >
                ‹
            </button>
            <button
                v-for="page in pageCount"
                :key="page"
                class="post-page-button"
                :aria-current="page === currentPage ? 'page' : undefined"
                @click="goToPage(page)"
            >
                {{ page }}
            </button>
            <button
                class="post-page-button"
                :disabled="currentPage === pageCount"
                aria-label="다음 페이지"
                @click="goToPage(currentPage + 1)"
            >
                ›
            </button>
        </nav>
    </div>
</template>

<script setup lang="ts">
import postsData from "../../../data/posts.json";
import { computed, ref, watch } from "vue";
import PostCard from "../PostCard/PostCard.vue";
import type { Post } from "@/models/PostModel";
import "./PostCardList.css";

interface Props {
    category?: string;
    limit?: number;
    pageSize?: number;
}

const props = withDefaults(defineProps<Props>(), {
    category: undefined,
    limit: undefined,
    pageSize: 10,
});

const posts = postsData as Post[];

const filteredPosts = computed(() => {
    const categoryPosts = props.category
        ? posts.filter(
              (post) => post.frontmatter.category.toLowerCase() === props.category!.toLowerCase(),
          )
        : posts;
    return props.limit ? categoryPosts.slice(0, props.limit) : categoryPosts;
});

const listRef = ref<HTMLElement>();
const currentPage = ref(1);
const pageCount = computed(() =>
    props.limit ? 1 : Math.max(1, Math.ceil(filteredPosts.value.length / props.pageSize)),
);
const pagePosts = computed(() =>
    props.limit
        ? filteredPosts.value
        : filteredPosts.value.slice(
              (currentPage.value - 1) * props.pageSize,
              currentPage.value * props.pageSize,
          ),
);

watch(
    () => props.category,
    () => {
        currentPage.value = 1;
    },
);

function goToPage(page: number) {
    currentPage.value = Math.min(Math.max(page, 1), pageCount.value);

    const listTop = listRef.value?.getBoundingClientRect().top ?? 0;
    if (listTop < 0) window.scrollTo({ top: window.scrollY + listTop - 120, behavior: "smooth" });
}
</script>
