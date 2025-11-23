import { readdirSync, statSync, readFileSync, Dirent } from "fs";
import { join, extname, basename } from "path";
import type { DefaultTheme } from "vitepress";
import matter from "gray-matter";
import { getCategoryColor } from "../../src/constants/colors";

interface SidebarItem {
    text: string;
    link?: string;
    items?: SidebarItem[];
    collapsed?: boolean;
}

/**
 * 폴더 구조를 기반으로 자동으로 사이드바를 생성하는 함수
 * @param folderPath - pages 폴더 내의 상대 경로 (예: 'posts', 'projects')
 * @param urlPath - URL 경로 (예: '/posts', '/projects')
 */
export function generateSidebar(
    folderPath: string = "posts",
    urlPath?: string,
): DefaultTheme.SidebarItem[] {
    const targetDir = join(process.cwd(), "contents", folderPath);
    const finalUrlPath = urlPath || `/${folderPath}`;

    try {
        // 폴더가 존재하지 않으면 빈 사이드바 반환
        if (!statSync(targetDir).isDirectory()) {
            return [];
        }
    } catch (error) {
        // 폴더가 없으면 빈 사이드바 반환
        return [];
    }

    const sidebarItems = generateSidebarItems(targetDir, finalUrlPath);
    return sidebarItems;
}

function generateSidebarItems(dir: string, basePath: string): SidebarItem[] {
    const items: SidebarItem[] = [];

    try {
        items.push({ text: "전체 게시글", link: `${basePath}/` });

        const entries = readdirSync(dir, { withFileTypes: true });
        const folders = entries.filter((entry: Dirent) => entry.isDirectory());

        for (const folder of folders.sort((a: Dirent, b: Dirent) => a.name.localeCompare(b.name))) {
            const folderBasePath = `${basePath}/${folder.name}`;
            const color = getCategoryColor(folder.name);

            items.push({
                text: `<span class="category-indicator" style="background-color: ${color};"></span>${formatTitle(folder.name)}`,
                link: `${folderBasePath}/`,
            });
        }
    } catch (error) {
        console.warn(`사이드바 생성 중 오류 발생: ${dir}`, error);
    }

    return items;
}

/**
 * 마크다운 파일에서 frontmatter의 title을 추출합니다
 * @param filePath - 마크다운 파일 경로
 * @returns frontmatter의 title 또는 null
 */
function getFrontmatterTitle(filePath: string): string | null {
    try {
        const content = readFileSync(filePath, "utf-8");
        const { data } = matter(content);
        return data.title || null;
    } catch (error) {
        console.warn(`Frontmatter 읽기 실패 (${filePath}):`, error);
        return null;
    }
}

/**
 * 파일명/폴더명을 사용자 친화적인 제목으로 변환
 */
function formatTitle(name: string): string {
    return name
        .replace(/[-_]/g, " ") // 하이픈과 언더스코어를 공백으로 변환
        .replace(/\b\w/g, (l) => l.toUpperCase()) // 각 단어의 첫 글자를 대문자로
        .trim();
}

/**
 * 특정 경로에 대한 사이드바만 생성 (다중 사이드바 사용 시)
 * @param folderPath - pages 폴더 내의 상대 경로
 * @param urlPath - URL 경로
 */
export function generateSidebarForPath(
    folderPath: string,
    urlPath?: string,
): DefaultTheme.SidebarItem[] {
    const pagesDir = join(process.cwd(), "pages");
    const targetDir = join(pagesDir, folderPath);
    const finalUrlPath = urlPath || `/${folderPath}`;

    try {
        if (!statSync(targetDir).isDirectory()) {
            return [];
        }
    } catch (error) {
        return [];
    }

    return generateSidebarItems(targetDir, finalUrlPath);
}
