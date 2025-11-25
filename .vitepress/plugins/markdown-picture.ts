import type MarkdownIt from "markdown-it";
import type { RenderRule } from "markdown-it/lib/renderer.mjs";
import { existsSync } from "fs";
import { join, dirname } from "path";

/**
 * 이미지 경로에서 확장자를 변경합니다
 */
function changeExtension(src: string, newExt: string): string {
    const lastDotIndex = src.lastIndexOf(".");
    if (lastDotIndex === -1) return src;
    return src.substring(0, lastDotIndex) + "." + newExt;
}

/**
 * 절대 경로로 변환하여 파일 존재 여부 확인
 */
function fileExists(relativePath: string, markdownFilePath: string): boolean {
    try {
        // VitePress rewrites로 인해 env.path가 /posts/... 형태로 오지만
        // 실제 파일은 /contents/posts/... 에 있음
        // markdownFilePath를 실제 파일 시스템 경로로 변환
        let actualPath = markdownFilePath;
        if (
            markdownFilePath.includes("/posts/") &&
            !markdownFilePath.includes("/contents/posts/")
        ) {
            actualPath = markdownFilePath.replace("/posts/", "/contents/posts/");
        }
        if (
            markdownFilePath.includes("/projects/") &&
            !markdownFilePath.includes("/contents/projects/")
        ) {
            actualPath = markdownFilePath.replace("/projects/", "/contents/projects/");
        }

        const dir = dirname(actualPath);
        const absolutePath = join(dir, relativePath);
        return existsSync(absolutePath);
    } catch {
        return false;
    }
}

/**
 * img 태그를 picture 태그로 변환하는 헬퍼 함수
 */
function convertImgToPicture(src: string, alt: string, markdownPath: string): string {
    // 외부 URL이거나 svg, gif는 picture 태그로 변환하지 않음
    if (src.startsWith("http") || src.endsWith(".svg") || src.endsWith(".gif")) {
        return `<img src="${src}" alt="${alt}" loading="lazy" />`;
    }

    // 이미지 포맷별 경로 생성
    const srcWebp = changeExtension(src, "webp");
    const srcAvif = changeExtension(src, "avif");
    const srcJpeg = changeExtension(src, "jpeg");

    // 실제로 존재하는 파일만 source로 추가
    const sources: string[] = [];

    // AVIF (최우선)
    if (fileExists(srcAvif, markdownPath)) {
        sources.push(`<source srcset="${srcAvif}" type="image/avif" />`);
    }
    // WebP (차선)
    if (fileExists(srcWebp, markdownPath)) {
        sources.push(`<source srcset="${srcWebp}" type="image/webp" />`);
    }
    // JPEG (폴백)
    if (fileExists(srcJpeg, markdownPath)) {
        sources.push(`<source srcset="${srcJpeg}" type="image/jpeg" />`);
    }

    // 변환된 이미지가 없으면 원본만 사용
    if (sources.length === 0) {
        return `<img src="${src}" alt="${alt}" loading="lazy" />`;
    }

    // picture 태그 생성 (원본을 최종 fallback으로 사용)
    return `<picture>
    ${sources.join("\n    ")}
    <img src="${src}" alt="${alt}" loading="lazy" />
</picture>`;
}

/**
 * HTML 문자열에서 img 태그를 찾아서 picture 태그로 변환
 */
function processHtmlImages(html: string, markdownPath: string): string {
    // <img> 태그를 찾는 정규식 (src와 alt 속성 추출)
    const imgRegex = /<img\s+([^>]*?)\/?>/gi;

    return html.replace(imgRegex, (match, attrs) => {
        // src 속성 추출
        const srcMatch = /src=["']([^"']+)["']/i.exec(attrs);
        if (!srcMatch) return match;

        const src = srcMatch[1];

        // alt 속성 추출
        const altMatch = /alt=["']([^"']*)["']/i.exec(attrs);
        const alt = altMatch ? altMatch[1] : "";

        return convertImgToPicture(src, alt, markdownPath);
    });
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

    // 1. markdown 이미지 (![](src)) 처리
    md.renderer.rules.image = (tokens, idx, options, env, self) => {
        const token = tokens[idx];
        const srcIndex = token.attrIndex("src");

        if (srcIndex < 0) {
            return defaultRender(tokens, idx, options, env, self);
        }

        const src = token.attrs![srcIndex][1];
        const alt = token.content;
        const markdownPath = env.path || "";

        return convertImgToPicture(src, alt, markdownPath);
    };

    // 2. HTML inline 이미지 (<img>) 처리
    const defaultHtmlInline =
        md.renderer.rules.html_inline || md.renderer.renderToken.bind(md.renderer);
    md.renderer.rules.html_inline = (tokens, idx, options, env, self) => {
        const token = tokens[idx];
        const content = token.content;
        const markdownPath = env.path || "";

        // img 태그가 있는 경우에만 처리
        if (content.includes("<img")) {
            return processHtmlImages(content, markdownPath);
        }

        return defaultHtmlInline(tokens, idx, options, env, self);
    };

    // 3. HTML block 이미지 처리
    const defaultHtmlBlock =
        md.renderer.rules.html_block || md.renderer.renderToken.bind(md.renderer);
    md.renderer.rules.html_block = (tokens, idx, options, env, self) => {
        const token = tokens[idx];
        const content = token.content;
        const markdownPath = env.path || "";

        // img 태그가 있는 경우에만 처리
        if (content.includes("<img")) {
            return processHtmlImages(content, markdownPath);
        }

        return defaultHtmlBlock(tokens, idx, options, env, self);
    };
}
