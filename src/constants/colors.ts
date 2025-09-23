/**
 * 카테고리별 색상 상수 정의 (GitHub 스타일)
 */
export const categoryColorMap: Record<string, string> = {
    Aws: "#ff9900",
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    React: "#61dafb",
    NextJS: "#000000",
    VueJs: "#4fc08d",
    Web: "#e34c26",
    Backend: "#0078d4",
    default: "#586069",
};

/**
 * 카테고리에 해당하는 색상을 가져옵니다
 * @param category - 카테고리명
 * @returns 해당 카테고리의 색상 또는 기본 색상
 */
export function getCategoryColor(category: string): string {
    return categoryColorMap[category] || categoryColorMap.default;
}
