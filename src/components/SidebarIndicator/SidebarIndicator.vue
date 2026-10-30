<template>
    <span ref="indicatorRef" class="sidebar-indicator" aria-hidden="true" />
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vitepress";

/**
 * 선택 배경을 사이드바 항목마다 그리지 않고 이 요소 하나를 옮겨서, 어디서 어디로 바뀌었는지 보이게 합니다.
 * 처음 놓일 때와 resize 때는 이전 위치가 의미가 없으므로 애니메이션 없이 제자리에 둡니다.
 */
const indicatorRef = ref<HTMLElement>();
const route = useRoute();
let hasBeenPlaced = false;

/**
 * 글 상세 페이지는 사이드바에 항목이 없어서 is-active 가 붙지 않습니다.
 * 그때는 URL 의 카테고리 폴더와 같은 링크를 현재 위치로 봅니다.
 * class 는 Vue 가 다시 덮어쓰므로 표시는 data 속성으로 합니다.
 */
function findCurrentItem(nav: HTMLElement): HTMLElement | null {
    for (const marked of nav.querySelectorAll("[data-current-category]")) {
        marked.removeAttribute("data-current-category");
    }

    const activeItem = nav.querySelector<HTMLElement>(".VPSidebarItem.is-active > .item");
    if (activeItem) return activeItem;

    const categoryFolder = route.path.split("/")[2];
    if (!categoryFolder) return null;

    const categoryLink = nav.querySelector<HTMLElement>(
        `a.link[href$="/posts/${categoryFolder}/"]`,
    );
    const categoryItem = categoryLink?.closest<HTMLElement>(".VPSidebarItem");
    categoryItem?.setAttribute("data-current-category", "");
    return categoryLink?.closest<HTMLElement>(".item") ?? null;
}

function moveToActiveItem({ shouldAnimate }: { shouldAnimate: boolean }) {
    const indicator = indicatorRef.value;
    const nav = indicator?.parentElement;
    if (!indicator || !nav) return;
    const activeItem = findCurrentItem(nav);

    if (!activeItem) {
        indicator.style.opacity = "0";
        hasBeenPlaced = false;
        return;
    }

    const offsetTop = activeItem.getBoundingClientRect().top - nav.getBoundingClientRect().top;
    const animate = shouldAnimate && hasBeenPlaced;

    if (!animate) indicator.style.transition = "none";
    indicator.style.opacity = "1";
    indicator.style.height = `${activeItem.offsetHeight}px`;
    indicator.style.transform = `translateY(${offsetTop}px)`;
    if (!animate) {
        void indicator.offsetHeight;
        indicator.style.transition = "";
    }

    hasBeenPlaced = true;
}

const placeWithoutAnimation = () => moveToActiveItem({ shouldAnimate: false });

onMounted(() => {
    nextTick(placeWithoutAnimation);
    window.addEventListener("resize", placeWithoutAnimation);
});

onBeforeUnmount(() => {
    window.removeEventListener("resize", placeWithoutAnimation);
});

watch(
    () => route.path,
    () => nextTick(() => requestAnimationFrame(() => moveToActiveItem({ shouldAnimate: true }))),
);
</script>
