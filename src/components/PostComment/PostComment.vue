<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch, ref, nextTick, toRef, type Ref } from "vue";

const props = defineProps<{
    theme: string;
}>();

const containerRef = ref<HTMLDivElement | null>(null);

function mountUtterances(theme: string) {
    const container = containerRef.value;
    if (!container) return;

    if (container.querySelector("iframe.utterances-frame")) return;

    const script = document.createElement("script");

    script.src = "https://utteranc.es/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";

    script.setAttribute("repo", "toothlessdev/toothlessdev-comments");
    script.setAttribute("issue-term", "pathname");
    script.setAttribute("label", "blog-comment");
    script.setAttribute("theme", theme);

    container.appendChild(script);
}

function setUtterancesTheme(theme: string) {
    const iframe = containerRef.value?.querySelector<HTMLIFrameElement>("iframe.utterances-frame");
    if (!iframe?.contentWindow) return;
    iframe.contentWindow.postMessage({ type: "set-theme", theme }, "https://utteranc.es");
}

onMounted(async () => {
    await nextTick();
    mountUtterances(props.theme);
});

watch(toRef(props, "theme"), (t) => {
    if (!containerRef.value?.querySelector("iframe.utterances-frame")) {
        mountUtterances(t);
        return;
    }
    setUtterancesTheme(t);
});

onBeforeUnmount(() => {
    const container = containerRef.value;
    if (!container) return;

    container.querySelector("iframe.utterances-frame")?.remove();
});
</script>

<template>
    <div ref="containerRef" />
</template>
