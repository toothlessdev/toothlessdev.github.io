
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

export const posts: Post[] = [
  {
    "url": "/posts/JavaScript/js-execution-context-part2",
    "frontmatter": {
      "title": "JavaScript Execution Context 실행 컨텍스트 - 예제편 (feat. 호이스팅, 스코프 체인, 클로저)",
      "createdAt": "2025-07-04T00:00:00.000Z",
      "category": "JavaScript",
      "description": "간단한 예제를 통해 실행컨텍스트가 어떻게 동작하는지 알아보고, 호이스팅과 스코프 체인, 클로저는 어떻게 동작하는지 알아봅니다"
    }
  },
  {
    "url": "/posts/JavaScript/js-execution-context-part1",
    "frontmatter": {
      "title": "JavaScript Execution Context 실행 컨텍스트 - 개념편 (feat. 호이스팅, 스코프 체인, 클로저)",
      "createdAt": "2025-07-03T00:00:00.000Z",
      "category": "JavaScript",
      "description": "JavaScript 실행 컨텍스트란 무엇인가요? 실행 컨텍스트는 JavaScript 코드가 실행되는 환경을 정의하는 객체입니다. 이 글에서는 실행 컨텍스트의 개념과 구성 요소, 그리고 Lexical Environment와 Variable Environment에 대해 설명합니다."
    }
  },
  {
    "url": "/posts/JavaScript/v8-how-the-value-stored",
    "frontmatter": {
      "title": "동적 타이핑 언어 JavaScript 값은 실제로 어떻게 저장될까? (Feat. Tagged Pointer, NaN-Boxing)",
      "createdAt": "2025-07-02T00:00:00.000Z",
      "category": "JavaScript",
      "description": "JavaScript 에서는 숫자, 문자열, 불리언, 객체 등 다양한 값을 다룰 수 있습니다. 일반적인으로는 원시값은 스택에, 나머지는 힙에 저장된다고 합니다. 하지만 동적 타입 언어인 JavaScript 는 런타임에 타입이 결정되는데, 그렇다면 실제로 값은 어디에 또 어떻게 저장될까요 ?"
    }
  },
  {
    "url": "/posts/JavaScript/js-object-comparison",
    "frontmatter": {
      "title": "객체리터럴 vs 정적메서드 vs 클래스 인스턴스 vs 클로저함수",
      "createdAt": "2025-05-08T00:00:00.000Z",
      "category": "JavaScript",
      "description": "객체리터럴, 정적메서드, 클래스 인스턴스, 클로저함수를 사용하면 공통적으로 객체를 생성할 수 있습니다. 이들은 모두 객체를 생성하는 방법이지만, 각각의 특징과 장단점이 다릅니다. 이 글에서는 이 네 가지 방법을 비교하고, 각각의 장단점과 사용 예시를 살펴보겠습니다."
    }
  },
  {
    "url": "/posts/Web/css-cascade-algorithm",
    "frontmatter": {
      "title": "CSS Cascade Algorithm 이란? (Feat. Cascade Layer)",
      "createdAt": "2025-04-13T00:00:00.000Z",
      "category": "WEB",
      "description": "CSS Cascade Algorithm 은 브라우저에서 스타일을 적용하는 방법을 정의합니다. CSS Cascade Algorithm 을 이해하면 CSS 스타일 우선순위를 이해할 수 있습니다."
    }
  },
  {
    "url": "/posts/React/inf-scroll",
    "frontmatter": {
      "title": "React로 무한 스크롤 구현하기 (Intersection Observer 활용)",
      "createdAt": "2024-11-15T00:00:00.000Z",
      "category": "React",
      "description": "React와 Intersection Observer API를 활용해 성능 최적화된 무한 스크롤을 구현하는 방법을 알아보겠습니다. 페이지네이션의 종류부터 커스텀 훅까지 단계별로 설명합니다."
    }
  },
  {
    "url": "/posts/Web/network-rest-api",
    "frontmatter": {
      "title": "REST API 의 REST 는 무엇인가?",
      "createdAt": "2024-10-25T00:00:00.000Z",
      "category": "Web",
      "description": "REST API 는 REpresentational State Transfer API 로, 웹 서비스에서 통신하는데 사용되는 소프트웨어 인터페이스입니다."
    }
  },
  {
    "url": "/posts/React/hooks-basics",
    "frontmatter": {
      "title": "React Hooks 기초",
      "createdAt": "2024-04-05T00:00:00.000Z",
      "category": "React",
      "description": "React Hooks를 사용한 함수형 컴포넌트 개발을 알아보겠습니다. useState, useEffect 등 기본 Hooks의 사용법과 패턴을 다룹니다."
    }
  },
  {
    "url": "/posts/JavaScript/async-programming",
    "frontmatter": {
      "title": "JavaScript 비동기 프로그래밍",
      "createdAt": "2024-03-20T00:00:00.000Z",
      "category": "JavaScript",
      "description": "JavaScript의 비동기 처리 방법들을 알아보겠습니다. Promise, async/await, fetch API 등을 활용한 비동기 프로그래밍 패턴을 다룹니다."
    }
  },
  {
    "url": "/posts/JavaScript/es6-basics",
    "frontmatter": {
      "title": "ES6 기본 문법",
      "createdAt": "2024-03-15T00:00:00.000Z",
      "category": "JavaScript",
      "description": "ES6에서 새로 추가된 기본 문법들을 알아보겠습니다. let, const, 화살표 함수, 템플릿 리터럴 등 모던 JavaScript의 핵심 기능들을 다룹니다."
    }
  },
  {
    "url": "/posts/JavaScript/test-automation",
    "frontmatter": {
      "title": "자동화 테스트 포스트",
      "createdAt": "2024-01-20",
      "category": "JavaScript",
      "description": "사이드바와 포스트 목록이 자동으로 업데이트되는지 테스트하는 포스트입니다."
    }
  }
]
