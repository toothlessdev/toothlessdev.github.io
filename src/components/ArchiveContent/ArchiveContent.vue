<script setup lang="ts">
import { computed } from "vue";
import { useData } from "vitepress";
import Giscus from "@giscus/vue";
import { GISCUS } from "@/constants/giscus";
import "./ArchiveContent.css";

const { isDark, lang } = useData();

const theme = computed(() => (isDark.value ? "dark" : "light"));
const mapping = "pathname";
const uiLang = computed(() => (lang.value?.startsWith("ko") ? "ko" : "en"));
</script>

<template>
    <div class="archive-content">
        <header class="til-header">
            <h1>📚 Archive of TIL</h1>
            <p class="til-description">매일 하나씩, 아주 작은 것이라도 배우고 기록합니다.</p>
        </header>

        <section class="til-giscus-section">
            <Giscus
                class="giscus-comments"
                :repo="GISCUS.repo"
                :repo-id="GISCUS.repoId"
                :category="GISCUS.category"
                :category-id="GISCUS.categoryId"
                :mapping="mapping"
                strict="0"
                reactions-enabled="0"
                emit-metadata="0"
                input-position="top"
                :theme="theme"
                :lang="uiLang"
                crossorigin="anonymous"
                loading="lazy"
            />
        </section>
    </div>
</template>
