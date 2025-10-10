---
title: DIY React 1 - JSX 마크업을 Virtual DOM 객체로 변환하기
createdAt: 2025-10-07
category: React
description: React의 핵심 개념과 동작 원리를 이해하기 위해, React를 직접 구현해보는 시리즈의 첫 번째 글입니다. 이번 글에서는 JSX 마크업을 Virtual DOM 객체로 변환하는 과정을 다룹니다.
comment: true
---

:::warning
아직 작성중이거나 검토중인 글입니다. 내용이 부정확하거나 변경될 수 있습니다
:::

리액트는 내부적으로 어떻게 동작할까요? 리액트의 핵심 개념과 동작 원리를 이해하기 위해 React를 직접 구현해보는 시리즈를 시작합니다!

최종적으로 우리가 구현할 React는 다음과 같은 기능을 갖추게 될 것입니다

::: info 시리즈

1. **Virtual DOM** : JSX 마크업을 Virtual DOM 객체로 변환하고, 이를 `Fiber` 단위로 분할하여 렌더링합니다.
2. **상태 관리 (`@State()`)** : 데코레이터를 통해 컴포넌트 필드를 반응형으로 만들어, 값이 변경될 때 자동으로 리렌더링을 트리거합니다.
3. **Reconciliation (Diff & Commit)** : 이전 Fiber 트리와 새로운 트리를 비교해, 변경된 부분만 실제 DOM에 반영합니다.
4. **이벤트 시스템** : Virtual DOM에서 `onClick`, `onInput` 등의 이벤트 핸들러를 감지해 실제 DOM 이벤트에 연결합니다.
5. **Concurrent Rendering** : `Fiber`, `Scheduler`, `Lane` 모델을 결합하여 렌더링을 **중단·재개·우선순위 조정**이 가능한 구조로 설계합니다.
    - `Fiber`: 작업 단위를 표현하는 구조체
    - `Scheduler`: 브라우저 유휴 시간에 작업을 분배하는 스케줄러
    - `Lane`: 업데이트의 우선순위를 관리하는 시스템
6. **Commit Phase (DOM 적용)** : 렌더링이 완료된 Fiber 트리를 실제 DOM에 한 번에 반영하며, 사이드 이펙트를 순서 보장과 함께 처리합니다.
7. **Suspense** : Promise 기반의 비동기 렌더링을 지원하여, 데이터가 준비되지 않은 Fiber를 일시 중단하고 준비되면 재개합니다.

:::

요번 글에서는 시리즈의 첫 번째 단계로, JSX 마크업을 Virtual DOM 객체로 변환하는 과정을 다루며 <br/>
Vite, TypeScript 환경에서 진행합니다

## 🤔 JSX 가 뭔데 ?

JSX 는 JavaScriptXML 의 줄임말입니다.<br/>
HTML 처럼 보이지만 실제로는 JavaScript 를 확장한 문법입니다. <br/>
그래서 브라우저는 JSX 를 이해하지 못해요 ㅠㅠ

<center>
<img src="./img/build-react-1/dumb.png" alt="dumb" width="400"/>
</center>

### 🚀 JSX 는 어떻게 동작하는데 ?

```tsx
return (
    <Component prop1={0} prop2={"string"}>
        these are children
    </Component>
);
```

이 JSX 코드는 실제로는 컴파일 단계에서 함수 호출 형태로 변환됩니다. <br/>
Babel 이나 TypeScript 같은 친구가 JSX 코드를 다음과 같이 변환해줍니다

```tsx
return React.createElement(Component, { prop1: 0, prop2: "string" }, "these are children");
```

최종적으로 `React.createElement` 함수가 호출되면 다음과 같은 Virtual DOM 객체가 생성됩니다 <br/>
실제로는 더 많은 속성이 있지만 이해를 돕기 위해 핵심 속성만 포함했습니다

```tsx
{
    type: Component,
    props: {
        prop1: 0,
        prop2: "string",
        children: "these are children"
    }
}
```

### 🛠️ JSX 를 사용하려면 어떻게 해야함?

앞서 말했듯이 JSX 는 자바스크립트 표준 문법이 아니기 때문에 트랜스파일러가 필요합니다. <br/>
React 에서는 주로 다음 두가지 방법으로 JSX 를 처리합니다

1. **Babel** + `@babel/preset-react` 플러그인 : 가장 널리 사용되는 방법입니다. Babel 은 다양한 자바스크립트 문법을 구형 브라우저에서도 동작할 수 있도록 변환해주는 도구입니다. `@babel/preset-react` 플러그인은 JSX 문법을 `React.createElement` 호출로 변환해줍니다.
2. **TypeScript** + `jsx`, `jsxFactory`, `jsxImportSource` : `tsconfig.json` 파일에서 `jsx` 옵션을 `react` 또는 `react-jsx` 로 설정하면, TypeScript 가 JSX 코드를 React.createElement 호출로 변환합니다.

::: details 💡 tsconfig.json 의 jsx 옵션

- `"jsx" : "react"` : 런타임에서 JSX 를 `React.createElement` 로 변환합니다
- `"jsx" : "react-jsx"` : React17 부터 도입된 새로운 JSX 변환 방식을 사용합니다. 이 방식은 `import React from 'react'` 구문이 없어도 JSX 를 사용할 수 있게 해줍니다.
- `"jsxFactory" : "React.createElement"` : JSX 를 변환할 때 사용할 함수 이름을 지정합니다. 기본값은 `React.createElement` 입니다.:
- `"jsxImportSource" : "react"` : `"jsx" : "react-jsx"` 사용시에 `jsx` 함수를 어디서 가져올지 지정합니다
    - 가끔 `@emotion/react` 같은 라이브러리에서 제공하는 `jsx` 함수를 사용하고 싶을 때가 있는데 이때 사용하면돕니다

:::

## 👷 createElement 구현하기!

JSX 가 실제로는 `createElement` 함수 호출로 변환된다는 사실을 알았으니, <br/>
직접 만들어보겠습니다

우리가 목표로 하는건 `<div><p>안뇽!</p></div>` 같은 JSX 마크업을 다음과 같은 Virtual DOM 객체로 변환하는 것입니다

```json
{
    "type": "div",
    "props": {
        "children": [
            {
                "type": "p",
                "props": {
                    "children": "안뇽!"
                }
            }
        ]
    }
}
```

> 🎯 목표!
>
> 1. JSX 마크업을 Virtual DOM 객체로 변환하는 `createElement` 함수 구현
> 2. null, undefined, boolean 값은 무시
> 3. 중첩된 children 처리

### 1. createElement 구현하기

먼저 아주 간단한 Virtual DOM 객체 타입을 정의해보겠습니다

```ts
export type RenderableElementType = string | Function; // HTML 태그 문자열 또는 컴포넌트 함수

export interface RenderableElement {
    type: RenderableElementType;
    props: {
        [key: string]: any; // 속성 (id, className, style 등)
        children?: RenderableElement | RenderableElement[] | string; // 자식 요소
    };
}
```

이제 `createElement` 함수를 구현해봅시다

```ts
export function createElement(
    type: RenderableElementType,
    props: Record<string, any> | null,
    ...children: any[]
): RenderableElement {}
```
