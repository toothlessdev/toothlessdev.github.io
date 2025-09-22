import { readdirSync, statSync, readFileSync, Dirent } from "fs";
import { join, extname, basename } from "path";
import type { DefaultTheme } from "vitepress";
import matter from "gray-matter";

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
        const entries = readdirSync(dir, { withFileTypes: true });

        // 파일과 폴더를 분리하여 정렬
        const files = entries.filter(
            (entry: Dirent) => entry.isFile() && entry.name.endsWith(".md"),
        );
        const folders = entries.filter((entry: Dirent) => entry.isDirectory());

        // 폴더 처리 (카테고리로 취급)
        for (const folder of folders.sort((a: Dirent, b: Dirent) => a.name.localeCompare(b.name))) {
            const folderPath = join(dir, folder.name);
            const folderBasePath = `${basePath}/${folder.name}`;

            const folderItems = generateSidebarItems(folderPath, folderBasePath);

            if (folderItems.length > 0) {
                items.push({
                    text: formatTitle(folder.name),
                    items: folderItems,
                    collapsed: true, // 기본적으로 접혀있도록 설정
                });
            }
        }

        // 파일 처리
        for (const file of files.sort((a: Dirent, b: Dirent) => a.name.localeCompare(b.name))) {
            const fileName = basename(file.name, extname(file.name));

            // index.md 파일은 해당 폴더의 대표 페이지로 처리
            if (fileName === "index") {
                continue;
            }

            const filePath = join(dir, file.name);
            const frontmatterTitle = getFrontmatterTitle(filePath);

            items.push({
                // frontmatter title 우선, 없으면 파일명 사용
                text: frontmatterTitle || formatTitle(fileName),
                link: `${basePath}/${fileName}`,
            });
        }

        // index.md 파일이 있으면 첫 번째 항목으로 추가
        const indexFile = files.find(
            (file: Dirent) => basename(file.name, extname(file.name)) === "index",
        );

        if (indexFile) {
            items.unshift({
                text: "개요",
                link: `${basePath}/`,
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
