---
title: React Transition Group
createdAt:
category:
description:
---

:::warning
아직 작성중이거나 검토중인 글입니다. 내용이 부정확하거나 변경될 수 있습니다
:::

## 서론

디자인학과 졸업전시 웹사이트 프젝 진행 중

전체 페이지에 수평 아코디언 애니메이션을 넣으려고
처음엔 모든 페이지를 한 번에 마운트해서 max-width로 접음
근데 Lighthouse에서 DOM 요소 3,495개 경고 뜨고
TBT 높고 메모리 사용량도 계속 늘어남
언마운트 ?

## 문제 접근방법

React Transition Group으로 상태 전이에 따라 in=true/false로 애니메이션 시도
컴포넌트마다 enter/exit 애니메이션 끝나면 자동으로 언마운트 되도록 처리
switch transition도 고려했지만, 여러 페이지를 동시에 다뤄야 해서 transitionGroup 선택
CSS로 transform 기반 애니메이션 구현해서 reflow/repaint 최소화

## 해결방법

`<TransitionGroup><CSSTransition>` 구조로 전환 흐름 제어

전환 시 DOM에 둘 다 남겨두고, 퇴장 페이지는 exit 애니메이션 후 DOM에서 제거
새 페이지는 enter > entered 상태로 자연스럽게 등장
css transform: translateX()로 GPU 가속 유도
timeout 또는 transitionend 로 애니메이션 완료 감지 -> ,언마운트
