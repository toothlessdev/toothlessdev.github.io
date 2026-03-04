---
title: 엥? Modal 그거 z-index:99999 박으면 되는거 아님? (feat. createPortal과 Stacking Context)
createdAt: 2025-06-27
category: React
description: React 에서 Modal 컴포넌트를 구현할때 단순히 z-index 를 높게 줬을때 발생하는 문제와 createPortal 을 이용해 해결하는 방법에 대해 알아봅니다.
comment: true
head:
    - - meta
      - name: keywords
        content: React, Modal, createPortal, Stacking Context, z-index
---

웹 개발을 하다보면 **Modal** 컴포넌트를 구현해야 하는 순간이 자주 찾아옵니다.

> 회원 가입시 약관 동의 <br/>
> 게시글 삭제 전 "정말 삭제하시겠습니까?" <br/>
> 결제 진행전 마지막 확인 ...

모달은 중요한 의사결정 직전에 모달은 사용자의 행동을 한번 더 되짚어주는 역할을 합니다. <br/>

:::details [토스는 모달을 언제, 어떻게 띄울까? (feat. 모달 경험 잘 설계하기)](https://medium.com/@beomsu/%ED%86%A0%EC%8A%A4%EB%8A%94-%EB%AA%A8%EB%8B%AC%EC%9D%84-%EC%96%B8%EC%A0%9C-%EC%96%B4%EB%96%BB%EA%B2%8C-%EB%9D%84%EC%9A%B8%EA%B9%8C-841e97dda1eb)

모달은 크게 Alert와 Sheet로 구분됩니다. <br/>

- Alert는 화면 정중앙에 위치하고 투명한 검은색을 배경으로 가집니다. 주로 사용자에게 즉시 필요한 중대한 정보를 담을 때 쓰입니다.
- Sheet는 화면 하단부에 위치하고 투명한 검은색을 배경으로 가집니다. 주로 사용자가 현재 맥락과 밀접한 관련이 있는 특정한 작업을 수행하게 할 때 쓰입니다.
- 토스가 Alert를 쓰는 경우는 아래의 4가지입니다.<br/>
  ① 기기 또는 시스템 설정에 접근해야 하는 경우, <br/>
  ② 입력했던 정보를 파괴하는 행동을 하려는 경우,<br/>
  ③ 시스템상 오류가 발생한 경우,<br/>
  ④ 다음 화면으로 진행하는 데 피요한 작업을 요구하는 경우입니다.<br/>
  ①, ②, ③은 Alert를 적절히 사용했지만 ③은 새로운 화면, ④는 Sheet라는 대안이 가능합니다.
- 토스가 Sheet를 쓰는 경우는 아래의 4가지입니다. <br/>
  ① 다음 화면으로 진행하는 데 필요한 작업을 요구하는 경우 <br/>
  ② 현재 화면에 영향을 미치는 작업을 요구하는 경우<br/>
  ③ 현재 화면과 관련된 정보를 전달하는 경우,<br/>
  ④ 기기 또는 시스템 설정에 접근해야 하는 경우입니다.<br/>
  ①, ②, ③은 Sheet를 적절히 사용했지만 ④는 Alert라는 대안이 가능합니다.

:::

모달은 단순한 UI 컴포넌트가 아니라, 사용자의 실수를 줄이고, 중요한 액션에 집중하게 만드는 중요한 역할을 합니다.

그만큼 사용자 경험 (UX) 에서 중요한 역할을 하는데, <br/>
개발자의 입장에서는 "어떻게 화면 위에 모달을 띄우지?" 라는 고민이 생깁니다.

## 🤓 엥? Modal 그거 z-index:99999 박으면 되는거 아님?

```css
.modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 99999; /* 화면에서 가장 위에 위치 */
}
```

처음 모달을 구현할 때 대부분 이렇게 생각합니다 <br/>
저도 그랬습니다 😅

하지만 z-index 를 높게 주는 것만으로는 모달이 항상 화면 위에 위치한다는 보장이 없습니다. <br/>
왜냐하면 z-index 는 `Stacking Context` 에 영향을 받기 때문입니다.

## 🤨 Stacking Context 가 뭔데 ?

> [StackingContext (쌓임맥락)](https://developer.mozilla.org/ko/docs/Web/CSS/CSS_positioned_layout/Stacking_context)은 가상의 Z축을 사용한 HTML 요소의 3차원 개념화입니다. Z축은 사용자 기준이며, 사용자는 뷰포트 혹은 웹페이지를 바라보고 있을 것으로 가정합니다. 각각의 HTML 요소는 자신의 속성에 따른 우선순위를 사용해 3차원 공간을 차지합니다.

간단히 말해, 브라우저는 화면 전체를 한 단위로만 쌓는게 아니라, Stacking Context 를 여러개 만들고, 각 Stacking Context 안에서 `z-index` 를 비교 합니다

Stacking Context 관련해서는 이미 잘 정리된 글이 있어서 한번 읽어보시는걸 추천드립니다 <br/>

[z-index와 쌓임 맥락 정리 - 왜 z-index가 위로 안올라갈까? - velog 최원빈](https://velog.io/@zad1264/z-index%EC%99%80-%EC%8C%93%EC%9E%84-%EB%A7%A5%EB%9D%BD-%EC%A0%95%EB%A6%AC-%EC%99%9C-z-index%EA%B0%80-%EC%9C%84%EB%A1%9C-%EC%95%88%EC%98%AC%EB%9D%BC%EA%B0%88%EA%B9%8C)

## 🪄 Portal 을 써야하는 이유

Portal 을 사용하면, 컴포넌트 트리 상으로는 자식이지만 실제 DOM 트리 상으로는 외부로 렌더링할 수 있습니다

React 입장에서는 부모 컴포넌트 안에 있는것 처럼 동작하지만, DOM 기준으로는 `<body/>` 나 `<div id="modal-root"/>` 같은 최상위 노드에 위치하기 때문에 **Stacking Context** 에 영향을 받지 않습니다.

| 상황                      | Portal 미사용                 | Portal 사용                 |
| ------------------------- | ----------------------------- | --------------------------- |
| 부모가 `transform` 있음   | 모달이 잘림 / 위치 어긋남     | 정상 표시                   |
| 부모가 `overflow: hidden` | 모달이 잘림                   | 정상 표시                   |
| 부모가 `z-index` 낮음     | 모달이 뒤에 가려짐            | 항상 위에 표시              |
| 렌더 트리 유지            | 부모 상태와 props 동기화 가능 | 그대로 유지                 |
| 접근성 (focus trap 등)    | 별도 관리 필요                | Portal 내부에서도 관리 가능 |

## 📖 결론

- `z-index: 99999` 는 만능이 아니다
- Stacking Context 에 갇히면 z-index 가 아무리 높아도 소용없다
- `createPortal`을 사용하면 루트 외부로 렌더링되어 Stacking Context의 제약에서 벗어날 수 있다
- 따라서 모달, 토스트, 툴팁, 드롭다운, 오버레이, 바텀CTA 등은 Portal로 렌더링하는 것이 좋다!
