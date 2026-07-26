# Repository Guidelines

## 프로젝트 구조 및 모듈 구성

이 저장소는 VitePress 기반 기술 블로그 및 포트폴리오 사이트입니다.

- 핵심 VitePress 설정은 `.vitepress/config.mts`에 있으며, 커스텀 플러그인은 `.vitepress/plugins/`, 테마 진입점과 전역 스타일은 `.vitepress/theme/`에 있습니다.

- Markdown 콘텐츠는 `contents/` 아래에 둡니다.
    - 블로그 글 : `contents/posts/`
    - 프로젝트 페이지 : `contents/projects/`
    - 아카이브 페이지 : `contents/archive/`

- 재사용 가능한 Vue/TypeScript 코드는 `src/`에 있습니다
    - 컴포넌트 : `src/components/`
    - 유틸리티 : `src/utils/`
    - 모델 : `src/models/`
    - 상수 : `src/constants/`

- 생성된 포스트 메타데이터는 `data/posts.json`에 저장됩니다

## 빌드, 테스트, 개발 명령어

`.nvmrc`에 맞춰 Node 22를 사용하고, `package.json`에 선언된 Yarn Classic 을 기준으로 의존성을 관리합니다.

- `yarn install --frozen-lockfile`: `yarn.lock` 기준으로 의존성을 설치합니다.
- `npm run docs:dev`: 로컬 VitePress 개발 서버를 실행합니다.
- `npm run docs:build`: 정적 사이트를 `.vitepress/dist/`에 빌드합니다. 기본 검증 명령으로 사용하세요.
- `npm run docs:preview`: 프로덕션 빌드 결과를 로컬에서 미리 봅니다.
- `npm run generate-posts`: Markdown 콘텐츠를 바탕으로 `data/posts.json`을 다시 생성합니다.

## 코딩 스타일 및 네이밍 규칙

- 포맷팅은 Prettier 설정을 따르며 `tabWidth: 4`, `printWidth: 100`을 사용합니다.
    - 기존 TypeScript와 Vue 파일처럼 double quotes와 4칸 들여쓰기를 유지하세요.
- 컴포넌트 디렉토리는 `src/components/PostCard/PostCard.vue`처럼 PascalCase를 사용하고, 필요한 경우 같은 디렉토리에 CSS 파일을 둡니다.
- `src` 내부 import는 가독성이 좋아질 때 `@` alias를 사용합니다.

## 콘텐츠 작성 규칙

- 포스트는 `contents/posts/React/my-post/index.md`처럼 카테고리별 디렉토리 아래에 작성합니다.
- 글 전용 이미지는 해당 포스트의 `img/` 폴더에 두고 `![diagram](./img/diagram.png)`처럼 상대 경로로 참조하세요.
- 포스트 생성기가 사용하는 frontmatter에는 `title`, `createdAt`, `category`, `description`을 포함하고, 댓글이 필요한 글에는 `comment`를 추가합니다.
- `contents/posts/index.md` 같은 index 페이지는 섹션 랜딩 페이지 용도로 유지합니다.

## 테스트 및 검증 기준

- 이 저장소에는 별도의 unit test 스크립트가 없습니다. PR을 열기 전에 `npm run docs:build`를 실행해 메타데이터 생성, 이미지 최적화, Mermaid 다이어그램, KaTeX 콘텐츠가 오류 없이 빌드되는지 확인하세요.
- 포스트를 추가하거나 이동했는데 `data/posts.json`이 자동 갱신되지 않았다면 `npm run generate-posts`를 실행합니다.

## 커밋 및 Pull Request 규칙

- `feat:`, `fix:`, `chore:`, `docs:` 같은 짧은 conventional prefix를 사용합니다
- 커밋 제목은 하나의 변경 사항에 집중해 간결하게 작성하세요
- PR에는 변경 요약, 콘텐츠 또는 빌드 영향, 관련 이슈 링크를 포함합니다.
- UI, 레이아웃, 포스트 렌더링에 보이는 변화가 있다면 스크린샷을 첨부하세요.
- GitHub Pages 배포는 `.github/workflows/deploy.yml`을 통해 `main` 브랜치에서 자동 실행됩니다.
