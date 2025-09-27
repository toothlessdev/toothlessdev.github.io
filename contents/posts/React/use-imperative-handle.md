---
title: React 는 항상 단방향으로 데이터가 흐를까? (useImperativeHandle)
createdAt: 2024-06-10
category: React
description: React 는 항상 데이터가 단방향으로 흐를까요? React 의 useImperativeHandle 훅을 사용하여 부모 컴포넌트가 자식 컴포넌트의 메서드나 속성에 접근하는 방법에 대해 알아봅니다
comment: true
---

# React 는 항상 단방향으로 데이터가 흐를까? (useImperativeHandle)

:::warning
아직 작성중이거나 검토중인 글입니다. 내용이 부정확하거나 변경될 수 있습니다
:::

## 단방향 vs 양방향 데이터 바인딩

리액트는 데이터의 단방향 흐름을 중요하게 여김
이는 상위 컴포넌트에서 하위 컴포넌트로 props 를 통해 데이터를 전달하는방식으로, 데이터 흐름을 예측 가능하게 만들어 관리가 용이함

## useImperativeHandle

### ref 와 forwardRef

useImperativeHandle 을 이해하기 위해서는 먼저 React.forwardRef 를 먼저 알아야 함

ref 는 useRef 에서 반환한 객체로,
컴포넌트 또는 DOM 요소의 ref 라는 특별한 props 에 넣어, HTML 에 접근하는 용도로 흔히 사용

만약, ref 를 상위 컴포넌트에서 하위 컴포넌트로 전달하려면 어떻게 해야 할까?

아님

forwardRef

useImperativeHandle 훅 사용하면

자식 컴포넌트에서 부모 컴포넌트로 함수를 전달 할 수 있음

근데 리액트에서 별로 추천안함

단방향으로 설계되었기 때문.

ContextAPI 나 Redux 와 같은 전역상태 라이브러리 쓰는게 좋음.
