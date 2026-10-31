# Repository Guidelines

이 저장소는 VitePress 기반 기술 블로그 및 포트폴리오 사이트입니다.

## 블로그 글 수정 금지

`contents/posts/` 아래 글 본문과 이미지는 에이전트가 직접 수정하거나 새로 만들지 않습니다. 글은 작성자가 직접 씁니다.

## 프로젝트 구조 및 모듈 구성

- 핵심 VitePress 설정 : `.vitepress/config.mts`
- 커스텀 플러그인 : `.vitepress/plugins/`
- 테마 진입점과 전역 스타일 : `.vitepress/theme/`

- Markdown 콘텐츠 : `contents/*`
    - 블로그 글 : `contents/posts/`
    - 프로젝트 페이지 : `contents/projects/`
    - 아카이브 페이지 : `contents/archive/`

- 재사용 가능한 Vue/TypeScript 코드 : `src/*`
    - 컴포넌트 : `src/components/`
    - 유틸리티 : `src/utils/`
    - 모델 : `src/models/`
    - 상수 : `src/constants/`

생성된 포스트 메타데이터는 `data/posts.json`에 저장됩니다. 이 파일은 `contents/posts/` 내부 Markdown 파일을 바탕으로 자동 생성됩니다.

## 빌드, 테스트, 개발 명령어

`.nvmrc`에 맞춰 Node 22를 사용하고, `package.json`에 선언된 Yarn Classic 을 기준으로 의존성을 관리합니다.

- `yarn install --frozen-lockfile`: `yarn.lock` 기준으로 의존성을 설치합니다.
- `npm run docs:dev`: 로컬 VitePress 개발 서버를 실행합니다.
- `npm run docs:build`: 정적 사이트를 `.vitepress/dist/`에 빌드합니다. 기본 검증 명령으로 사용하세요.
- `npm run docs:preview`: 프로덕션 빌드 결과를 로컬에서 미리 봅니다.
- `npm run generate-posts`: Markdown 콘텐츠를 바탕으로 `data/posts.json`을 다시 생성합니다.

## 코딩 스타일 및 네이밍 규칙

- 컴포넌트 디렉토리는 `src/components/MyComponent/MyComponent.vue`처럼 PascalCase를 사용하고, 필요한 경우 같은 디렉토리에 CSS 파일을 둡니다.
- `src` 내부 import는 가독성이 좋아질 때 `@` alias를 사용합니다.

## 커밋 및 Pull Request 규칙

- `feat:`, `fix:`, `chore:`, `docs:` 같은 짧은 conventional prefix를 사용합니다
- 커밋 제목은 하나의 변경 사항에 집중해 간결하게 작성하세요
- PR에는 변경 요약, 콘텐츠 또는 빌드 영향, 관련 이슈 링크를 포함합니다.
- UI, 레이아웃, 포스트 렌더링에 보이는 변화가 있다면 스크린샷을 첨부하세요.
- GitHub Pages 배포는 `.github/workflows/deploy.yml`을 통해 `main` 브랜치에서 자동 실행됩니다.
