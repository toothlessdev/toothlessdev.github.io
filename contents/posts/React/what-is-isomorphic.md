---
title: "Isomorphic 이란 뭐고 어떨때 사용하는 네이밍일까 ? (feat. useIsomorphicEffect 는 뭘까)"
createdAt: 2025-10-29
category: React
description: 오픈소스를 보다보면 Isomorphic 이라는 단어를 마주치게 됩니다. Isomorphic 이란 무엇인지, 그리고 어떨때 사용하는 네이밍인지에 대해 알아봅니다. 또 리액트에서 자주 사용되는 useIsomorphicEffect 훅도 함께 살펴봅니다.
comment: true
head:
    - - meta
      - name: keywords
        content: Isomorphic, Isomorphic JavaScript, React, useIsomorphicEffect, 동형 사상, 동일한 인터페이스, 다른 구현, 소프트웨어 공학, 리액트 훅, 서버 사이드 렌더링, 클라이언트 사이드 렌더링, SSR, CSR
---

리액트 오픈소스들을 보다보면 `Isomorphic` 이라는 단어를 마주치게 됩니다. <br/>
예를들어, `useIsomorphicEffect` 같은 훅이 그렇습니다. 한번씩 본것 같지 않나요 ㅎㅎ

그렇다면 Isomorphic 이란 무엇인지, 그리고 어떨때 사용하는 네이밍인지에 대해 알아봅시다

## 🤔 동일한 인터페이스, 다른 구현 : Isomorphic

> 수학에서 동형 사상은 서로 구조가 같은 두 대상 사이에, 모든 구조를 보존하는 사상이다. <br/>
> 두 대상 사이에 동형 사상이 존재하는 경우 서로 동형이라고 하며, 서로 동형인 두 대상은 구조가 같아 구조로서 구별할 수 없다. <br/>
> (출처 : 위키백과 - [동형 사상](https://ko.wikipedia.org/wiki/%EB%8F%99%ED%98%95_%EC%82%AC%EC%83%81))

Isomorphic 이라는 단어는 그리스어에서 유래되었으며, `iso`는 "동일한"을, `morph`는 "형태"를 의미합니다. <br/>
따라서 Isomorphic은 `동일한 형태를 가진` 이라는 뜻을 가지고 있습니다.

## 🛠️ 소프트웨어 공학에서의 Isomorphic ?

소프트웨어 개발에서 Isomorphic이라는 용어는 동일한 인터페이스를 가지지만, 서로 다른 구현을 가진 시스템이나 컴포넌트를 설명할 때 사용됩니다.

Isomorphic은 원래 서버와 클라이언트가 동일한 코드 구조(형태) 를 공유하지만, 환경에 따라 다르게 동작하는 코드를 설명할 때 자주 사용됩니다.

예를 들어 Isomorphic JavaScript는
브라우저(클라이언트)와 Node.js(서버) 양쪽 모두에서 동일한 로직이 실행될 수 있도록 작성된 코드를 말합니다.
다음과 같이 서로의 역할은 다르지만, `하나의 코드가 양쪽의 환경에서 동작하는 형태`이기 때문에 Isomorphic 이라고 부릅니다.

> 클라이언트: DOM 조작, 이벤트 처리, 렌더링 <br/>
> 서버: 데이터 Fetch, 초기 HTML 생성(SSR)

<br/>

이건 JavaScript 에서도 있는데요, <br/>
`globalThis` 는 브라우저와 Node.js 환경에서 동일한 전역 객체에 접근할 수 있도록 해주는 Isomorphic API입니다.

```javascript
// 브라우저에서
globalThis === window; // true

// Node.js에서
globalThis === global; // true
```

## 🪄 Isomorphic 네이밍은 언제 사용될까?

그럼 Isomorphic 이라는 네이밍이 언제 사용될지 감이 잡힐것입니다 ㅎㅎ<br/>

| 상황                                                    | 예시                  | 설명                                         |
| ------------------------------------------------------- | --------------------- | -------------------------------------------- |
| 환경에 따라 다른 구현을 가지지만 동일한 API를 제공할 때 | `useIsomorphicEffect` | SSR/CSR 모두에서 안전하게 동작               |
| 서버와 클라이언트에서 동일한 로직을 재사용할 때         | `isomorphic-fetch`    | fetch를 Node.js와 브라우저에서 공통으로 사용 |
| 플랫폼별로 다르게 구현되지만 같은 기능을 보장할 때      | `isomorphic-storage`  | localStorage vs in-memory storage            |

## ❌ Isomorphic 네이밍을 쓰면 안 되는 경우

Isomorphic은 "동일한 인터페이스를 유지한 채, 환경에 따라 자동으로 구현이 달라지는 구조"를 의미합니다. <br/>
즉, `사용자가 환경을 인식하지 않고도 동일한 코드를 쓸 수 있어야` Isomorphic이라고 부를 수 있습니다.

예를들어 다음과 같은 네이밍은 적절하지 않습니다

```typescript
import { useQuery, useSuspenseQuery } from "react-query";

export const useIsomorphicQuery = (suspense: boolean) => {
    return suspense ? useSuspenseQuery() : useQuery();
};
```

왜냐하면 `suspense` 라는 플래그를 통해 사용자가 직접 환경을 인식하고 선택해야 하기 때문입니다. <br/>
따라서 이 경우는 Isomorphic 이라는 네이밍을 쓰지 않는 것이 좋습니다.

### ✅ 그럼 어떤 네이밍을 써야할까 ?

이 경우는 `usePolymorphicQuery` 또는 `useAdaptiveQuery` 와 같은 네이밍이 더 적절합니다. <br/>

| 패턴                | 설명                            | 예시 네이밍                                               |
| ------------------- | ------------------------------- | --------------------------------------------------------- |
| Adaptive Pattern    | 환경이나 조건에 자동으로 적응   | `useAdaptiveQuery()`, `useAutoQuery()`, `useSmartQuery()` |
| Polymorphic Pattern | 같은 인터페이스지만 구현이 다름 | `usePolymorphicQuery()`                                   |

:::details 🤓 엥? Adaptive 도 "자동으로 적용" 이라고? Isomorphic 이랑 Adaptive 두개 비슷한거같은데...

| 구분        | Isomorphic                                                                   | Adaptive                                                              |
| ----------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 핵심 개념   | 환경(플랫폼) 에 따라 자동으로 다른 구현이 실행되지만, 인터페이스는 동일      | 상태나 조건(성능, 네트워크, 사용자 설정 등)에 따라 전략을 바꾸는 코드 |
| 결정 주체   | 환경 (ex. 서버 vs 클라이언트, Node vs Browser)                               | 로직 (ex. 속도 모드, 네트워크 품질, 사용자 옵션)                      |
| 사용자 관점 | 환경을 전혀 의식하지 않아야 함                                               | 사용자가 옵션을 줄 수도 있음                                          |
| 예시        | `useIsomorphicLayoutEffect` : SSR이면 `useEffect`, CSR이면 `useLayoutEffect` | `useAdaptiveQuery({ mode: 'suspense' })` : mode 에 따라 선택          |
| 목표        | 코드가 어느 환경에서든 똑같이 작동하게                                       | 현재 상황에 가장 적절하게 작동하게                                    |

:::

## ⚛️ React 에서의 useIsomorphicEffect ?

위의 예제에서 살펴본 것처럼, <br/>
React 생태계에서는 "Isomorphic" 이라는 단어가 환경별로 다른 구현을 동일한 API로 추상화할 때 자주 사용됩니다.

예를 들어, 브라우저에서는 `useLayoutEffect`가 DOM을 바로 조작하기 위해 사용되지만, <br/>
`SSR(Server-Side Rendering)` 환경에서는 DOM이 없기 때문에 호출 시 경고가 발생합니다.

이를 해결하기 위해 만들어진 것이 바로 `useIsomorphicEffect` 입니다.

```typescript
import { useEffect, useLayoutEffect } from "react";

export const useIsomorphicEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
```

즉, 클라이언트 환경에서는 useLayoutEffect를, 서버 환경에서는 useEffect를 사용하지만 <br/>
개발자는 단일 훅(useIsomorphicEffect)으로 통일된 인터페이스를 쓸 수 있습니다.

## 🧐 왜 굳이 이런 훅이 필요할까?

그렇다면 왜 굳이 이런 훅이 필요한지 알아보기전에 `useLayoutEffect` 와 `useEffect` 의 차이를 간단히 짚고 넘어가봅시다.

- `useEffect` : 렌더링 후에 비동기적으로 실행됩니다. (화면이 그려진 후에 실행) <br/>
    - 주로 데이터 Fetch, 구독 설정 등 부수 효과를 처리할 때 사용됩니다.
- `useLayoutEffect` : 렌더링 직후, 브라우저가 화면에 그리기 전에 동기적으로 실행됩니다. (CRP 의 paint 이전에 실행되어야 하는 작업) <br/>
    - 주로 DOM 측정, 레이아웃 조정 등 화면에 영향을 미치는 작업에 사용됩니다.

그리고 두 훅은 모두 서버사이드에서는 실행되지 않습니다. <br/>

이제 본론으로 돌아와서, <br/>
서버 렌더링(SSR)은 문자열 HTML을 만드는 과정일 뿐, 브라우저의 렌더 트리/레이아웃 단계가 존재하지 않습니다. <br/>
그래서 "페인트 전에 동기 실행, DOM 조작" 이라는 전제 자체가 성립 안 됨으로, 실행할 타이밍이 없고 다음과 같은 경고가 발생합니다.

> Warning: useLayoutEffect does nothing on the server, because its effect runs after the DOM is updated... <br/>
> ⚠️ 님아... useLayoutEffect는 페인트 전에 DOM 읽거나 조작하려는 훅인데, 서버는 DOM이 없잖아요..

## 🧠 정리!

> Isomorphic은 환경이 다르더라도 동일한 인터페이스를 유지하는 코드 구조를 의미한다.

React에서는 주로 SSR 호환성을 보장하기 위해, 클라이언트 전용 훅이나 API를 서버 환경에서도 안전하게 사용할 수 있도록 Isomorphic 추상화 계층을 두는 패턴에서 등장합니다.
