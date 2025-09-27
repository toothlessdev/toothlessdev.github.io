<script setup lang="ts">
import { computed } from "vue";
import { useData } from "vitepress";
import Giscus from "@giscus/vue";

const GISCUS = {
    repo: "toothlessdev/toothlessdev.github.io",
    repoId: "R_kgDOK8A2Yg",
    category: "General",
    categoryId: "DIC_kwDOK8A2Ys4Cv8uz",
} as const;

const { isDark, lang } = useData();

const theme = computed(() => (isDark.value ? "dark" : "light"));
const mapping = "pathname";
const uiLang = computed(() => (lang.value?.startsWith("ko") ? "ko" : "en"));
</script>

<template>
    <div class="giscus-comments">
        <Giscus
            class="giscus"
            :repo="GISCUS.repo"
            :repo-id="GISCUS.repoId"
            :category="GISCUS.category"
            :category-id="GISCUS.categoryId"
            :mapping="mapping"
            strict="0"
            reactions-enabled="1"
            emit-metadata="0"
            input-position="top"
            :theme="theme"
            :lang="uiLang"
            crossorigin="anonymous"
            loading="lazy"
        />
    </div>
</template>

<style scoped>
.giscus-comments {
    margin-top: 4rem;
    padding-top: 1rem;
    border-top: 1px solid var(--vp-c-divider);
}

.giscus-comments :deep(.giscus),
.giscus-comments :deep(iframe) {
    margin-top: 0;
}
</style>

<style>
.giscus-frame {
    margin-top: 2rem;
}

.giscus {
    margin-top: 2rem;
}
</style>
