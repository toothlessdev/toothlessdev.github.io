import { mkdir, writeFile } from "fs/promises";
import { join } from "path";

/**
 * GitHub Pages 는 서버 리다이렉트(301)를 설정할 수 없어서, 옛 경로마다 meta refresh 페이지를 둡니다.
 * Google 은 지연 0 의 meta refresh 를 영구 리다이렉트로 취급하고, canonical 이 새 URL 로 색인을 옮겨줍니다.
 */
export async function writeRedirectPages(
    outDir: string,
    hostname: string,
    oldPathToNewPath: Record<string, string>,
) {
    for (const [oldPath, newPath] of Object.entries(oldPathToNewPath)) {
        const newUrl = new URL(newPath, hostname).href;
        const pageDir = join(outDir, oldPath);

        await mkdir(pageDir, { recursive: true });
        await writeFile(join(pageDir, "index.html"), renderRedirectPage(newUrl), "utf-8");
    }
}

function renderRedirectPage(newUrl: string): string {
    return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<title>이동된 페이지</title>
<link rel="canonical" href="${newUrl}">
<meta http-equiv="refresh" content="0; url=${newUrl}">
<script>location.replace(${JSON.stringify(newUrl)} + location.hash);</script>
</head>
<body><a href="${newUrl}">${newUrl}</a> 로 이동했습니다.</body>
</html>
`;
}
