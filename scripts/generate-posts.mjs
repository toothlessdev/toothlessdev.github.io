import { promises as fs } from "fs";
import { join, extname, basename } from "path";
import matter from "gray-matter";

/**
 * 단일 마크다운 파일을 읽고 frontmatter를 파싱합니다
 * @param {string} filePath - 파일 경로
 * @returns {Promise<Object|null>} - 파싱된 frontmatter 또는 null
 */
async function readMarkdownFile(filePath) {
    try {
        const content = await fs.readFile(filePath, "utf-8");
        const { data } = matter(content);
        return data;
    } catch (error) {
        console.warn(`파일 읽기 오류 (${filePath}):`, error);
        return null;
    }
}

/**
 * frontmatter가 유효한 포스트 데이터인지 검증합니다
 * @param {Object} frontmatter - frontmatter 데이터
 * @returns {boolean} - 유효성 여부
 */
function isValidPostData(frontmatter) {
    return !!(
        frontmatter?.title &&
        frontmatter?.createdAt &&
        frontmatter?.category &&
        frontmatter?.description
    );
}

/**
 * frontmatter와 파일 정보를 포스트 객체로 변환합니다
 * @param {Object} frontmatter - frontmatter 데이터
 * @param {string} filePath - 파일 경로
 * @param {string} urlPrefix - URL 접두사
 * @returns {Object} - 포스트 객체
 */
function createPostObject(frontmatter, filePath, urlPrefix) {
    const fileName = basename(filePath, extname(filePath));
    return {
        url: `${urlPrefix}/${fileName}`,
        frontmatter: {
            title: frontmatter.title,
            createdAt: frontmatter.createdAt,
            category: frontmatter.category,
            description: frontmatter.description,
        },
    };
}

/**
 * 단일 파일을 처리하여 포스트 데이터를 생성합니다
 * @param {string} filePath - 파일 경로
 * @param {string} fileName - 파일명
 * @param {string} urlPrefix - URL 접두사
 * @returns {Promise<Object|null>} - 포스트 객체 또는 null
 */
async function processMarkdownFile(filePath, fileName, urlPrefix) {
    // index.md 파일은 제외
    if (fileName === "index.md") return null;

    const frontmatter = await readMarkdownFile(filePath);
    if (!frontmatter || !isValidPostData(frontmatter)) {
        return null;
    }

    return createPostObject(frontmatter, filePath, urlPrefix);
}

/**
 * 디렉토리를 재귀적으로 스캔하여 모든 마크다운 파일을 찾습니다
 * @param {string} dir - 스캔할 디렉토리
 * @param {string} urlPrefix - URL 접두사
 * @returns {Promise<Object[]>} - 포스트 객체들의 배열
 */
async function scanDirectory(dir, urlPrefix) {
    const posts = [];

    try {
        const entries = await fs.readdir(dir, { withFileTypes: true });

        const promises = entries.map(async (entry) => {
            const fullPath = join(dir, entry.name);

            if (entry.isDirectory()) {
                const subPosts = await scanDirectory(fullPath, `${urlPrefix}/${entry.name}`);
                posts.push(...subPosts);
            } else if (entry.isFile() && entry.name.endsWith(".md")) {
                const post = await processMarkdownFile(fullPath, entry.name, urlPrefix);
                if (post) {
                    posts.push(post);
                }
            }
        });

        await Promise.all(promises);
    } catch (error) {
        console.warn(`디렉토리 스캔 오류 (${dir}):`, error);
    }

    return posts;
}

/**
 * 포스트들을 날짜순으로 정렬합니다 (최신순)
 * @param {Object[]} posts - 포스트 배열
 * @returns {Object[]} - 정렬된 포스트 배열
 */
function sortPostsByDate(posts) {
    return posts.sort((a, b) => {
        const dateA = new Date(a.frontmatter.createdAt);
        const dateB = new Date(b.frontmatter.createdAt);
        return dateB.getTime() - dateA.getTime();
    });
}

/**
 * pages/posts 디렉토리에서 모든 포스트 데이터를 생성합니다
 * @returns {Promise<Object[]>} - 정렬된 포스트 배열
 */
async function generatePostsData() {
    const postsDir = join(process.cwd(), "contents", "posts");
    const posts = await scanDirectory(postsDir, "/posts");
    return sortPostsByDate(posts);
}

/**
 * 포스트 데이터를 TypeScript 파일 내용으로 변환합니다
 * @param {Object[]} posts - 포스트 배열
 * @returns {string} - TypeScript 파일 내용
 */
function generateTypeScriptContent(posts) {
    return `
// 자동 생성된 파일 - 수정하지 마세요
// yarn generate-posts 명령어로 업데이트하세요

export interface Post {
  url: string
  frontmatter: {
    title: string
    createdAt: string
    category: string
    description: string
  }
}

export const posts: Post[] = ${JSON.stringify(posts, null, 2)}
`;
}

/**
 * 포스트 데이터를 파일에 씁니다
 * @param {string} content - 파일 내용
 * @param {string} outputPath - 출력 파일 경로
 * @returns {Promise<void>}
 */
async function writePostsFile(content, outputPath) {
    try {
        await fs.writeFile(outputPath, content, "utf-8");
    } catch (error) {
        throw new Error(`파일 쓰기 실패 (${outputPath}): ${error.message}`);
    }
}

/**
 * 포스트 생성 결과를 로깅합니다
 * @param {number} postCount - 포스트 개수
 * @param {string} outputPath - 출력 파일 경로
 */
function logSuccess(postCount, outputPath) {
    console.log(`✅ ${postCount}개의 포스트가 생성되었습니다: ${outputPath}`);
}

/**
 * 에러를 로깅하고 프로세스를 종료합니다
 * @param {Error} error - 에러 객체
 */
function handleError(error) {
    console.error("❌ 포스트 파일 생성 실패:", error);
    process.exit(1);
}

/**
 * 전체 포스트 파일 생성 프로세스를 조율합니다
 * @returns {Promise<void>}
 */
async function createPostsFile() {
    try {
        const posts = await generatePostsData();
        const content = generateTypeScriptContent(posts);
        const outputPath = join(process.cwd(), ".vitepress/data/posts.ts");

        await writePostsFile(content, outputPath);
        logSuccess(posts.length, outputPath);
    } catch (error) {
        handleError(error);
    }
}

// 즉시 실행 함수로 비동기 처리
(async () => {
    await createPostsFile();
})();
