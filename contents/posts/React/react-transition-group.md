---
title: React Transition Group 뜯어보기
createdAt: 2024-10-15
category: React
description: 디자인학과 졸업전시 사이트를 만들면서 React Transition Group 을 통해 DOM 개수를 줄여보면서 React Transition Group 은 어떻게 동작하는지 살펴보았습니다.
comment: true
head:
    - - meta
      - name: keywords
        content: React, React Transition Group, TransitionGroup, CSSTransition, 애니메이션, React 애니메이션
---

디자인학과 졸업전시 웹사이트를 만들면서, 전체 페이지에 수평 아코디언 전환 애니메이션이 필요했습니다.

<img src="./img/react-transition-group/design-exhibition-site.png" width="800px" alt="디자인학과 졸업전시 웹사이트"/>

처음 접근은 단순히 다른 아코디언 애니메이션처럼 단순하게 접근했습니다. <br/>
모든 페이지 컴포넌트를 한 번에 전부 마운트해두고, 각 섹션의 `max-width` 만 조절하면서 열리고 닫히는 애니메이션을 구현했습니다.

## 🩸 사건 현장

그런데 웬걸.. Lighthouse에서 DOM 요소가 3,495개라는 경고가 뜨고, TBT(Total Blocking Time)도 높고 메모리 사용량도 계속 늘어나는 현상이 발생하는게 아니겠습니까?

<div style="display: flex; width:100%; background:#151515;">
  <img src="./img/react-transition-group/problem-1.png" style=" width:50%; object-fit:contain" alt="문제 상황 1"/>
  <img src="./img/react-transition-group/problem-2.png" style="width:50%; object-fit:contain" alt="문제 상황 2"/>
</div>

무엇보다 `안 보이는 페이지도 계속 DOM 요소로써 남아있다`는 점이 문제였습니다. <br/>
애니메이션이 끝나도 컴포넌트는 언마운트 되지 않으니까, 브라우저 입장에서는 그냥 페이지 여러 개를 동시에 돌리고 있는 셈이었습니다.

> 애니메이션은 자연스럽게 유지하되, 화면 바깥으로 나간 페이지는 DOM 에서 치워버릴 수 없을까?

`FramerMotion`, `React Spring` 등 여러 애니메이션 라이브러리를 살펴봤지만, 아코디언 애니메이션 하나를 위해서 번들 사이즈가 크기도 했고, 디자이너가 딱 원하는 애니메이션을 구현하기가 어려웠습니다. <br/>

결국 `React Transition Group` 라이브러리를 사용해서 이 문제를 해결할 수 있었습니다. <br/>
하지만, 공식문서가 ~~불친절~~ 해서 내부 동작 방식을 직접 살펴보고, 어떻게 애니메이션이 종료된 이후 컴포넌트가 언마운트 되는지 뒤적거려봤습니다.

## 🕵️‍♀️ React Transition Group

> React Transition Group은 컴포넌트가 들어오고 나갈 때(마운트/언마운트 시점)의 전환을 정의할 수 있도록 여러 간단한 컴포넌트를 제공합니다. <br/><br/>
> React Transition Group은 React-Motion 같은 애니메이션 라이브러리가 아닙니다. 이 라이브러리 자체가 스타일을 직접 애니메이션시키지는 않습니다. <br/><br/>
> 대신에, 이 라이브러리는 전환(transition)의 각 단계 정보를 노출하고, 클래스 이름을 붙이거나 떼고, 요소들을 그룹화하고, DOM을 적절히 조작해 줍니다. 덕분에 실제 시각적인 전환 애니메이션을 구현하는 작업이 훨씬 쉬워집니다.

[React Transition Group](https://reactcommunity.org/react-transition-group/) 공식 문서를 들어가보면 크게 `Transition`, `CSSTransition`, `SwitchTransition`, `TransitionGroup` 네 가지 컴포넌트를 제공한다고 나와있습니다.

이제부터 이 네가지 컴포넌트에 대해 하나씩 살펴보겠습니다.

## 1️⃣ `<Transition/>` : 이 요소를 지금 보여줄꺼야? 숨길꺼야?

`<Transition/>` 컴포넌트는 React Transition Group 의 가장 기본이 되는 컴포넌트 입니다. <br/>
이 컴포넌트는 자식 컴포넌트를 지금 보여줄꺼야? 숨길꺼야? 라는 상태를 `in` prop 으로 받아서, 컴포넌트의 라이프사이클을 상태머신으로 관리합니다.

### ⚙️ `in: boolean`

- `in` prop 은 boolean 타입으로, `true` 면 자식 컴포넌트를 보여주고, `false` 면 숨깁니다.
- 이 값을 기반으로 `<Transition/>` 은 내부적으로 `entering`, `entered`, `exiting`, `exited` 네 가지 상태로 전환됩니다.

### ⚙️ `mountOnEnter: boolean`, `unmountOnExit: boolean`

- `mountOnEnter` : `in` 이 처음으로 `true` 가 되기전에 컴포넌트를 마운트하지 않습니다.
- `unmountOnExit` : `in` 이 `false` 가 된 후에 컴포넌트를 언마운트합니다.

> 이 두 옵션을 사용하면, 컴포넌트가 화면에 보일 때만 마운트되고, 화면에서 사라질 때 언마운트 되도록 할 수 있습니다.

### ⚙️ `appear: boolean`

- 처음 마운트될 때도 등장 애니메이션을 적용할지 여부를 결정합니다. (기본값은 `false`)

### ⚙️ `enter: boolean`, `exit: boolean`

- 각 애니메이션을 아예 비활성화 할 수 있습니다
- `enter : false` 인 경우 들어올때 애니메이션 없이 바로 `entered` 상태로 전이됩니다.
- `exit : false` 인 경우 나갈때 애니메이션 없이 바로 `exited` 상태로 전이됩니다.

### ⚙️ `timeout: number` 와 `addEndListener`

- React Transition Group 은 애니메이션이 언제 끝났는지 알아야 다음 상태로 전이 할 수 있습니다
- `timeout : number` : 지정된 ms 이후에 애니메이션이 끝났다고 간주합니다.
- `addEndListener(node, done)` : DOM 노드의 실제 애니메이션 완료 이벤트를 잡아서 `done()` 을 호출해주는 방식이빈다.

```tsx
<Transition
    in={show}
    addEndListener={(node, done) => {
        node.addEventListener("transitioned", done);
    }}
/>
```

### 🔁 상태 전이

결국 `<Transition/>` 컴포넌트의 핵심은 각 props 에 따른 상태 전이입니다. <br/>
텍스트로만 설명하면 잘 이해가 안되니... 상태 전이 다이어그램을 보면 이해가 쉽습니다

~~사실 프론트같은거 좋아하는 이유도 이렇게 시각적으로 뭔가 정리하는게 이해가 쉽고 재밌어서 그렇습니다 ㅎㅎ~~

<img src="./img/react-transition-group/transition.webp" width="600px" alt="Transition 상태 전이 다이어그램"/>

:::details 🙋‍♂️ 상태 전이 다이어그램에서 `[]` 는 뭔가요? - Guard
`[]` 표시는 가드(Guard) 조건을 의미합니다. <br/>
가드 조건은 상태 전이가 발생하기 위한 추가적인 조건을 나타냅니다. <br/>
예를 들어, 가장 위에 보이는 `[mountOnEnter === true]` 는 초기 상태에서 `mountOnEnter` props 가 `true` 일 때만 `unmounted` 상태로 전이된다는 의미입니다. <br/>
:::

## 2️⃣ `<CSSTransition/>` : CSS 클래스 이름 알아서 붙여줄게 ~

`<CSSTransition/>` 컴포넌트는 `<Transition/>` 컴포넌트를 확장한 컴포넌트로, CSS 클래스 이름을 사용하여 애니메이션을 제어할 수 있도록 도와줍니다. <br/>
차이점은 하나입니다. `<Transition/>` 컴포넌트는 타이밍만 제어하고 스타일은 직접 `on*` 콜백 props 를 사용하여 직접 제어해야 하지만, `<CSSTransition/>` 컴포넌트는 각 상태에 맞는 CSS 클래스 이름을 자동으로 추가/제거 해준다는 점입니다.

개발자는 그냥 `classNames` prefix 를 기준으로 CSS 만 정의해두면 됩니다.

```tsx
<CSSTransition in={show} timeout={300} classNames="prefix" mountOnEnter unmountOnExit>
    <Component />
</CSSTransition>
```

이렇게만 써두면, 상태 전이에 따라 다음과 같은 클래스들이 자동으로 붙습니다

1. Enter 시

- `prefix-enter`
- 이후 바로 `prefix-enter-active`
- 완료 후 `prefix-enter-done`

2. Exit 시

- `prefix-exit`
- 이후 바로 `prefix-exit-active`
- 완료 후 `prefix-exit-done`

### ⚙️ `appear: boolean` 에 따른 classNames

`appear:true` 를 설정한 경우, 마운트 초기에도 `prefix-appear`, `prefix-appear-active`, `prefix-appear-done` 클래스가 적용 됩니다.

이를 통해 첫 등장 애니메이션은 쪼금 다르게 줄 수도 있습니다.

### 🤨 왜 클래스가 두번에 나눠서 붙지 (reflow 트릭)

애니메이션을 자연스럽게 시작하려면 `초기 상태 클래스` 와 `활성 상태 클래스` 를 서로 다른 프레임에 붙여야 합니다.

`<CSSTransition/>` 컴포넌트는 대략 이런식으로 동작합니다

1. `onEnter` 시점에 `prefix-enter` 클래스를 붙여둔다
2. 다음 프레임에서 강제로 한번 reflow 를 발생시킨다 (`node.offset*` 같은 코드로 강제로 layout 을 읽어 브라우저가 현재 스타일을 계산하게 만듭니다)
3. 그 다음에 `prefix-enter-active` 클래스를 붙인다 (최종 스타일)

:::info
두개의 클래스를 동시에 붙이면, 브라우저가 시작 상태를 못 잡고 그냥 최종 상태로 바로 넘어가 버리는 경우가 있어서 일부러 reflow 로 타이밍을 나눠줍니다!
:::

`exit` 도 동일한 방식으로 동작합니다

## 3️⃣ `<TransitionGroup/>` : 여러 컴포넌트의 입장과 퇴장을 관리해줭

`<Transition/>` 과 `<CSSTransition/>` 컴포넌트는 하나의 컴포넌트가 들어오고 나가는 순간을 관리합니다.

근데 실제 애니메이션에서는 여러 컴포넌트가 동시에 들어오고 나가는 경우가 많습니다. <br/>
여러 컴포넌트의 진입, 퇴장 타이밍을 관리해줘야 하는거죠

이걸 해결해주는 친구가 `<TransitionGroup/>` 컴포넌트입니다.

```tsx
<TransitionGroup component={null}>
    {items.map((item) => {
        return (
            <CSSTransition
                key={item.id}
                timeout={300}
                classNames="prefix"
                mountOnEnter={true}
                unmountOnExit={true}
            >
                <ItemComponent item={item} />
            </CSSTransition>
        );
    })}
</TransitionGroup>
```

### ⚙️ `key`

`<TransitionGroup/>` 컴포넌트는 key 를 기준으로 어떤 컴포넌트가 새로 들어왔는지, 어떤 컴포넌트가 나갔는지를 판단합니다. <br/>

1. TransitionGroup 은 children 의 key 목록을 기억해 둡니다.
2. 다음 렌더링시 key 의 목록이 바뀌었는지 비교합니다.
    - 새로 생긴 key : 새로운 children 컴포넌트가 들어온 것으로 판단하고 `in=true` 로 설정해서 enter 애니메이션을 시작합니다.
    - 없어진 key : 사라질 children 컴포넌트가 나간 것으로 판단하고 DOM 에서 바로 제거하지 않고, `in=false` 를 주면서 exit 애니메이션을 먼저 실행합니다. (사라지는 애를 바로 안지우고 퇴장 애니메이션을 실행할 시간을 줌)
3. exit 애니메이션이 끝나는 시점에만 state 에서 제거해서 실제 DOM 에서도 제거합니다.

### ⚙️ `component`

기본적으로 `<TransitionGroup/>` 컴포넌트는 `<div>` 래퍼를 사용합니다. <br/>
`null` 을 주면 자식만 렌더링할 수 있습니다.

## 4️⃣ `<SwitchTransition/>` : 한 번에 하나의 컴포넌트만 보여줄꺼양

`<SwitchTransition/>` 컴포넌트는 항상 딱 하나의 자식 컴포넌트가 존재하고 그걸 바꿀 때 애니메이션 하고 싶다는 상황에 쓰이는 컴포넌트입니다.

예를들어, 한장 사라지고 다른 한장이 나타나는 슬라이드쇼 같은 상황이 있겠네요

이 컴포넌트는 `mode` 라는 props 로 전환 순서를 결정합니다.

### ⚙️ `mode : "out-in" | "in-out"`

- `out-in`
    - 현재 컴포넌트의 exit 애니메이션을 완전히 끝내고
    - 다 사라진 다음 새로운 자식이 enter 애니메이션으로 등장합니다.
- `in-out`
    - 새로운 자식이 enter 애니메이션으로 먼저 들어오고
    - 다 자리잡은 다음에 기존 자식에게 exit 애니메이션을 실행합니다.

## 📲 (실험) 모바일 화면 전환 애니메이션을 만들어보자

이제까지 살펴본 내용을 바탕으로, 모바일 화면 전환 애니메이션을 구현해보겠습니다. <br/>

:::info 요구사항

- 새로운 화면은 오른쪽에서 왼쪽으로 슬라이드 인
- 기존 화면은 왼쪽으로 슬라이드 아웃
- 두 화면이 동시에 전환됨
  :::

여러 자식 컴포넌트가 동시에 들어오고 나가는 상황이므로 `<TransitionGroup/>` 컴포넌트를 사용하면 되겠네요

```tsx
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { Routes, Route, useLocation } from "react-router-dom";

function App() {
    const location = useLocation();

    return (
        <TransitionGroup className="page-wrapper">
            <CSSTransition
                key={location.key}
                classNames="slide"
                timeout={300}
                mountOnEnter
                unmountOnExit
            >
                <Routes location={location}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    {/* ... */}
                </Routes>
            </CSSTransition>
        </TransitionGroup>
    );
}
```

### ⚠️ 여기서 중요한 포인트

- `key={location.key}` : 라우팅 할때 마다 key가 바뀌므로, `<TransitionGroup/>` 입장에서 "이전 화면 하나", "새 화면 하나" 라는 두 컴포넌트를 동시에 관리 할 수 있게 합니다
- `mountOnEnter`, `unmountOnExit` : 현재 보여줄 화면만 DOM 에 남기고, 이전 화면은 애니메이션이 끝나는 순간 언마운트 되도록 합니다

### 🎨 CSS 를 작성해보자

이제 prefix 에 따른 CSS 만 작성해주면 됩니다

```css
/* 부모: 겹쳐서 보여줄 수 있도록 relative */
.page-wrapper {
    position: relative;
    overflow: hidden;
}

/* 각 페이지는 겹칠 수 있도록 absolute */
.page-wrapper > * {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

/* Enter (새 화면이 오른쪽에서 들어옴) */
.slide-enter {
    transform: translateX(100%); /* 시작: 오른쪽 바깥 */
}
.slide-enter-active {
    transform: translateX(0%);
    transition: transform 300ms ease;
}
.slide-enter-done {
    transform: translateX(0%);
}

/* Exit (이전 화면이 왼쪽으로 밀려나감) */
.slide-exit {
    transform: translateX(0%); /* 시작: 현재 위치 */
}
.slide-exit-active {
    transform: translateX(-100%); /* 왼쪽 바깥으로 나감 */
    transition: transform 300ms ease;
}
.slide-exit-done {
    transform: translateX(-100%);
}
```

### 🚀 어떻게 동작하나?

1. 라우트 변경 => `<CSSTransition key={...}>` 가 새로운 화면을 하나 더 렌더 (TransitionGroup이 이전 화면은 in={false}, 새 화면은 in={true} 상태로 관리)
2. 이전 화면에는 `.slide-exit` / 새 화면에는 `.slide-enter` 클래스가 각각 들어감
3. 다음 animation frame에서 `.slide-exit-active`, `.slide-enter-active` 클래스가 붙으면서
    - 이전 화면: translateX(-100%)로 왼쪽으로 밀려나가고
    - 새 화면: translateX(0)까지 오른쪽에서 슬라이드 인
4. 약 300ms 뒤 transition이 끝나면
    - 이전 화면은 onExited => 언마운트
    - 새 화면은 .slide-enter-done 상태로 정상적으로 남음

## 📖 참고 자료

- [React Transition Group 공식문서](https://reactcommunity.org/react-transition-group/)
- [React Transition Group 소스코드](https://github.com/reactjs/react-transition-group)
