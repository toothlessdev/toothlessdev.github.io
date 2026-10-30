const SCROLL_END_FALLBACK_MS = 1200;

/**
 * 목차 링크를 눌렀을 때만 부드럽게 스크롤합니다.
 *
 * VitePress 라우터가 window capture 단계에서 먼저 클릭을 가로채 requestAnimationFrame 안에서
 * window.scrollTo(0, top) 으로 점프시킵니다. 이동 거리 계산(scrollOffset)은 라우터에 맡기고,
 * 그 rAF 가 실행되기 전에 scroll-behavior 만 잠깐 smooth 로 바꿔 같은 이동을 부드럽게 만듭니다.
 *
 * html 에 scroll-behavior: smooth 를 항상 걸어두지 않은 이유는 페이지 이동 시 맨 위로 가는 스크롤까지
 * 부드러워지기 때문입니다.
 */
export function enableSmoothOutlineScroll() {
    let restoreTimer: number | undefined;

    function restoreScrollBehavior() {
        window.clearTimeout(restoreTimer);
        document.documentElement.style.scrollBehavior = "";
    }

    document.addEventListener("click", (event) => {
        const outlineLink = (event.target as Element | null)?.closest?.("a.outline-link");
        if (!outlineLink) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        document.documentElement.style.scrollBehavior = "smooth";

        window.clearTimeout(restoreTimer);
        window.addEventListener("scrollend", restoreScrollBehavior, { once: true });
        restoreTimer = window.setTimeout(restoreScrollBehavior, SCROLL_END_FALLBACK_MS);
    });
}
