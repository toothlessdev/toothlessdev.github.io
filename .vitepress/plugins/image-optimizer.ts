import { Plugin } from "vite";
import sharp from "sharp";
import { existsSync } from "fs";
import { join, dirname, extname, basename } from "path";
import { glob } from "glob";

interface ImageOptimizerOptions {
    /**
     * 이미지를 찾을 디렉토리 패턴
     * @default "contents/posts/** /img/** /*.(jpg|jpeg|png)"
     */
    sourcePattern?: string;

    /**
     * 생성할 이미지 포맷들
     * @default ["webp", "jpeg"]
     */
    formats?: ("webp" | "jpeg" | "avif")[];

    /**
     * WebP 품질 (0-100)
     * @default 90
     */
    webpQuality?: number;

    /**
     * JPEG 품질 (0-100)
     * @default 90
     */
    jpegQuality?: number;

    /**
     * AVIF 품질 (0-100)
     * @default 90
     */
    avifQuality?: number;
}

/**
 * 이미지를 여러 포맷으로 변환합니다
 */
async function convertImage(
    sourcePath: string,
    formats: ("webp" | "jpeg" | "avif")[],
    options: ImageOptimizerOptions,
) {
    const ext = extname(sourcePath).toLowerCase();
    const dir = dirname(sourcePath);
    const name = basename(sourcePath, ext);

    // 이미 최적화된 이미지는 스킵
    if (formats.includes("webp" as any) && ext === ".webp") return;
    if (formats.includes("jpeg" as any) && [".jpg", ".jpeg"].includes(ext)) return;
    if (formats.includes("avif" as any) && ext === ".avif") return;

    try {
        const image = sharp(sourcePath);

        for (const format of formats) {
            const outputPath = join(dir, `${name}.${format}`);

            // 이미 변환된 파일이 있으면 스킵
            if (existsSync(outputPath)) continue;

            try {
                if (format === "webp") {
                    await image
                        .clone()
                        .webp({ quality: options.webpQuality || 80 })
                        .toFile(outputPath);
                    console.log(`✅ WebP 생성: ${outputPath}`);
                } else if (format === "jpeg") {
                    await image
                        .clone()
                        .jpeg({ quality: options.jpegQuality || 80 })
                        .toFile(outputPath);
                    console.log(`✅ JPEG 생성: ${outputPath}`);
                } else if (format === "avif") {
                    await image
                        .clone()
                        .avif({ quality: options.avifQuality || 70 })
                        .toFile(outputPath);
                    console.log(`✅ AVIF 생성: ${outputPath}`);
                }
            } catch (error) {
                console.warn(
                    `⚠️  ${format.toUpperCase()} 변환 실패 (${basename(sourcePath)}): ${error instanceof Error ? error.message : String(error)}`,
                );
            }
        }
    } catch (error) {
        console.warn(
            `⚠️  이미지 로드 실패 (${basename(sourcePath)}): ${error instanceof Error ? error.message : String(error)}. 원본 파일을 사용합니다.`,
        );
    }
}

/**
 * 빌드 시점에 이미지를 최적화하는 Vite 플러그인
 */
export function createImageOptimizerPlugin(options: ImageOptimizerOptions = {}): Plugin {
    const {
        sourcePattern = "contents/posts/**/img/**/*.{jpg,jpeg,png}",
        formats = ["webp", "jpeg"],
    } = options;

    return {
        name: "vitepress-image-optimizer",

        async buildStart() {
            console.log("🖼️  이미지 최적화 시작...");

            try {
                const imagePaths = await glob(sourcePattern, {
                    cwd: process.cwd(),
                    absolute: true,
                });

                console.log(`📁 발견된 이미지: ${imagePaths.length}개`);

                for (const imagePath of imagePaths) {
                    await convertImage(imagePath, formats, options);
                }

                console.log("✅ 이미지 최적화 완료!");
            } catch (error) {
                console.error("❌ 이미지 최적화 실패:", error);
            }
        },
    };
}
