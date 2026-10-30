<template>
    <div class="home-page">
        <h1 class="home-statement">겉은 매끄럽게,<br />속은 견고하게.</h1>
        <p class="home-intro">
            Frontend Developer 김대건입니다. 작은 지연과 전환까지 다듬고, 보이지 않는 영역까지
            설계하는 일을 좋아합니다. GDG, 멋쟁이사자처럼 운영진 활동과 카카오 테크캠퍼스 3기에서
            배운 것을 이곳에 기록합니다.
        </p>
        <div class="home-links">
            <a href="https://github.com/toothlessdev" target="_blank" rel="noopener">GitHub ↗</a>
            <a :href="withBase('/202604.pdf')" target="_blank" rel="noopener">Resume ↗</a>
            <a :href="withBase('/archive')">Archive of TIL</a>
        </div>

        <section class="home-section" aria-labelledby="home-recent-title">
            <div class="home-section-head">
                <h2 id="home-recent-title" class="home-section-title">최근 글</h2>
                <a class="home-section-more" :href="withBase('/posts/')">전체 보기</a>
            </div>
            <PostCardList :limit="3" />
        </section>

        <section class="home-section" aria-labelledby="home-topics-title">
            <div class="home-section-head">
                <h2 id="home-topics-title" class="home-section-title">주제</h2>
            </div>
            <div class="home-topics">
                <a
                    v-for="topic in topics"
                    :key="topic.name"
                    class="home-topic"
                    :href="withBase(`/posts/${topic.name}/`)"
                >
                    <span
                        class="home-topic-dot"
                        :style="{ backgroundColor: getCategoryColor(topic.name) }"
                    />
                    {{ topic.name }}
                    <span class="home-topic-count">{{ topic.postCount }}</span>
                </a>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { withBase } from "vitepress";
import postsData from "../../../data/posts.json";
import PostCardList from "../PostCardList/PostCardList.vue";
import { getCategoryColor } from "@/constants/colors";
import type { Post } from "@/models/PostModel";
import "./HomePage.css";

const posts = postsData as Post[];

const postCountByCategory = new Map<string, number>();
for (const post of posts) {
    const category = post.url.split("/")[2];
    postCountByCategory.set(category, (postCountByCategory.get(category) ?? 0) + 1);
}

const topics = [...postCountByCategory]
    .map(([name, postCount]) => ({ name, postCount }))
    .sort((a, b) => b.postCount - a.postCount);
</script>
