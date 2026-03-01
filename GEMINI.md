# ToothlessDev Blog

이 프로젝트는 VitePress를 기반으로 구축된 기술 블로그 및 포트폴리오 사이트입니다.

## 프로젝트 개요
- **프레임워크:** [VitePress](https://vitepress.dev/) (Vue 기반 정적 사이트 생성기)
- **주요 기술:** TypeScript, Vue 3, Vanilla CSS
- **콘텐츠 관리:** `contents/` 디렉토리 내의 마크다운 파일
- **주요 기능:**
    - 이미지 자동 최적화 (Sharp 사용)
    - KaTeX를 이용한 수식 렌더링
    - Giscus를 이용한 댓글 시스템
    - 포스트 목록 및 사이드바 자동 생성 플러그인

## 디렉토리 구조
- `.vitepress/`: VitePress 설정 및 커스텀 플러그인 (`plugins/`)
- `contents/`: 마크다운 콘텐츠
    - `posts/`: 기술 블로그 포스트
    - `projects/`: 프로젝트 소개
    - `archive/`: 아카이브 페이지
- `src/`: 테마 커스터마이징을 위한 Vue 컴포넌트 및 유틸리티
- `scripts/`: 포스트 데이터 생성을 위한 스크립트
- `data/`: 자동 생성된 포스트 데이터 (`posts.json`)

## 개발 및 빌드 명령
- **의존성 설치:** `yarn install`
- **로컬 개발 서버 실행:** `npm run docs:dev`
- **프로젝트 빌드:** `npm run docs:build`
- **빌드 결과물 미리보기:** `npm run docs:preview`
- **포스트 데이터 수동 생성:** `npm run generate-posts`

## 개발 컨벤션
### 포스트 작성 (Markdown)
모든 포스트는 `contents/posts/` 하위 디렉토리에 위치해야 하며, 다음의 frontmatter 형식을 반드시 준수해야 합니다:
```yaml
---
title: "포스트 제목"
description: "포스트 요약 설명"
createdAt: "2024-03-20"
category: "카테고리명"
comment: true # 댓글 활성화 여부
---
```
- `index.md` 파일은 포스트 목록 생성에서 제외됩니다.
- 이미지는 각 포스트 디렉토리 내의 `img/` 폴더에 위치시키는 것을 권장합니다.

### 스타일링
- 컴포넌트별로 전용 `.css` 파일을 생성하여 관리합니다 (`src/components/` 참조).
- 전역 스타일은 `.vitepress/theme/style.css`에서 관리합니다.

### 아키텍처 및 플러그인
- **플러그인 시스템:** `.vitepress/plugins/`에 위치한 커스텀 Vite 플러그인을 통해 빌드 시 포스트 목록 생성, 이미지 최적화 등을 자동화합니다.
- **데이터 흐름:** 마크다운 파일 수정 -> Vite 플러그인 감지 -> `generate-posts.mjs` 실행 -> `data/posts.json` 업데이트 -> UI 반영

## 배포
- GitHub Actions를 통해 `main` 브랜치 푸시 시 자동 배포됩니다.
- 배포 설정은 `.github/workflows/deploy.yml`에 정의되어 있습니다.
