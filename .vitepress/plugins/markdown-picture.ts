import type MarkdownIt from "markdown-it";
import type { RenderRule } from "markdown-it/lib/renderer.mjs";

/**
 * 이미지 경로에서 확장자를 변경합니다
 */
function changeExtension(src: string, newExt: string): string {
    const lastDotIndex = src.lastIndexOf(".");
    if (lastDotIndex === -1) return src;
    return src.substring(0, lastDotIndex) + "." + newExt;
}

/**
 * 마크다운의 이미지를 picture 태그로 변환하는 플러그인
 */
export function markdownPicturePlugin(md: MarkdownIt) {
    const defaultRender: RenderRule =
        md.renderer.rules.image ||
        ((tokens, idx, options, env, self) => {
            return self.renderToken(tokens, idx, options);
        });

    md.renderer.rules.image = (tokens, idx, options, env, self) => {
        const token = tokens[idx];
        const srcIndex = token.attrIndex("src");

        if (srcIndex < 0) {
            return defaultRender(tokens, idx, options, env, self);
        }

        const src = token.attrs![srcIndex][1];
        const alt = token.content;

        // 외부 URL이거나 svg, gif는 picture 태그로 변환하지 않음
        if (src.startsWith("http") || src.endsWith(".svg") || src.endsWith(".gif")) {
            return defaultRender(tokens, idx, options, env, self);
        }

        // 이미지 포맷별 경로 생성
        const srcWebp = changeExtension(src, "webp");
        const srcJpeg = changeExtension(src, "jpeg");

        // picture 태그 생성
        return `<picture>
    <source srcset="${srcWebp}" type="image/webp" />
    <source srcset="${srcJpeg}" type="image/jpeg" />
    <img src="${srcJpeg}" alt="${alt}" loading="lazy" />
</picture>`;
    };
}
