import { exec } from "child_process";
import { promisify } from "util";
import { triggerFullReload } from "./utils";

const execAsync = promisify(exec);

/**
 * 포스트 생성 스크립트를 실행합니다
 */
async function executePostGeneration() {
    await execAsync("node scripts/generate-posts.mjs");
}

/**
 * 파일이 pages 디렉토리의 마크다운 파일인지 확인합니다
 */
function isPagesMarkdownFile(filePath: string): boolean {
    return filePath.includes("/pages/") && filePath.endsWith(".md");
}

/**
 * 빌드 시작 시 포스트를 생성하는 핸들러
 */
async function handleBuildStart() {
    try {
        console.log("🔄 포스트 목록을 업데이트하는 중...");
        await executePostGeneration();
        console.log("✅ 포스트 목록 업데이트 완료!");
    } catch (error) {
        console.warn(
            "포스트 목록 생성 실패:",
            error instanceof Error ? error.message : String(error),
        );
    }
}

/**
 * 핫 업데이트 시 포스트를 재생성하는 핸들러
 */
async function handleHotUpdate(ctx: any) {
    if (isPagesMarkdownFile(ctx.file)) {
        try {
            console.log("📝 포스트 변경 감지, 목록 업데이트 중...");
            await executePostGeneration();
            console.log("✅ 포스트 목록 업데이트 완료!");
            console.log("📋 사이드바 업데이트를 위해 개발 서버를 재시작해주세요!");
            console.log("   또는 Ctrl+C 후 yarn docs:dev 를 다시 실행하세요.");

            triggerFullReload(ctx.server);
        } catch (error) {
            console.warn(
                "포스트 목록 생성 실패:",
                error instanceof Error ? error.message : String(error),
            );
        }
    }
    return [];
}

/**
 * 자동 포스트 생성 Vite 플러그인을 생성합니다
 */
export function createAutoGeneratePostsPlugin() {
    return {
        name: "auto-generate-posts-and-sidebar",
        buildStart: handleBuildStart,
        handleHotUpdate: handleHotUpdate,
    };
}
