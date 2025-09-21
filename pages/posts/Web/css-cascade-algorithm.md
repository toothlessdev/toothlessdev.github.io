---
title: CSS Cascade Algorithm 이란? (Feat. Cascade Layer)
createdAt: 2025-04-13
category: WEB
pinned: true
description: CSS Cascade Algorithm 은 브라우저에서 스타일을 적용하는 방법을 정의합니다. CSS Cascade Algorithm 을 이해하면 CSS 스타일 우선순위를 이해할 수 있습니다.
---

# 📖 스타일 충돌을 해결하는 방법, 무엇이 문제일까 ?

CSS 를 사용할 때, 종종 스타일이 예기치 않게 덮어씌워지는 문제를 겪습니다. <br/>
특히, 여러 개발자와 함께 협업하는 프로젝트에서는 스타일 충돌이 더욱 빈번하게 발생합니다.

이러한 스타일 충돌 문제를 해결하기 위해 **BEM(Block-Element-Modifier)** 나 **CSS Modules**, **CSS-in-JS** 와 같은 다양한 접근 방식이 등장했습니다.

하지만, **CSS 스타일의 적용방식 (우선순위)** 가 어떻게 결정되는지 이해하지 못하면, 근본적인 해결책을 찾기 어렵습니다

<br />

# 🎨 CSS Cascade Algorithm 이란?

CSS 는 Cascading Style Sheets 의 약자로, **스타일 우선순위** 를 결정하는 방식을 정의합니다.

> **Cascade** : 폭포 또는 위에서 아래로 떨어지는, 흐르는

CSS는 요소에 여러 스타일이 적용되었을 때 다음과 같은 우선순위 규칙에 따라 최종 스타일을 결정합니다. <br/>

우선순위는 다음과 같은 순서로 적용됩니다

> 1. 중요도 (`!important`)
> 2. 스타일의 유래 (origin)
> 3. Cascade Layer (sub-origin)
> 4. Selector 의 구체성 (specificity)
> 5. 선언 순서 (order)
> 6. 상속 (inheritance)

## 1. 중요도 (`!important`)

CSS 에서 `!important` 키워드를 사용하면 해당 스타일의 우선순위가 가장 높아집니다.

```css
div {
    color: red !important;
}
```

하지만, `!important` 를 남발하면 코드의 유지보수가 어려워지고, 스타일 충돌 문제가 더욱 복잡해집니다. 따라서, `!important` 를 사용하는 것은 지양해야 합니다.

## 2. 스타일의 유래 (origin)

CSS 는 다양한 origin 에서 선언될 수 있으며, 어떤 스타일이 우선적으로 적용되는지는 origin 에 따라 달라집니다.

| Origin               | 설명                           | 우선순위 |
| -------------------- | ------------------------------ | -------- |
| User Agent           | 브라우저의 기본 스타일         | 0        |
| User                 | 사용자가 지정한 스타일         | 1        |
| Author               | 개발자가 작성한 스타일         | 2        |
| CSS Animation        | CSS 애니메이션 스타일          | 3        |
| Inline               | HTML 요소에 직접 작성한 스타일 | 4        |
| User && !important   | 사용자가 설정한 !important     | 5        |
| Author && !important | 개발자가 설정한 !important     | 6        |

> ‼️ **Author vs User** <br />
> Author : 개발자가 작성한 스타일 <br />
> User : 웹사이트를 보는 사용자가 설정한 스타일로 주로 접근성을 위한 사용자 정의 스타일 <br />
> 예) 웹페이지 폰트 크기 강제로 키우기, 고대비 모드 등..

그렇다면 개발자는 origin 을 변경할 수도 없고, `!important` 를 남발할 수도 없으니, 어떻게 해야 할까요? <br/>

## 3. Cascade Layer (sub-origin) ⭐️

개발자는 그럼 정말로 origin 을 변경할 수 없을까요? <br/>

Cascade Layer는 CSS의 origin 내에서 스타일 우선순위를 세부적으로 제어하는 방법입니다. 같은 origin에서 동일한 specificity를 가진 스타일 간에 Layer 순서가 우선순위를 결정합니다. <br/>
최근 브라우저(Chrome99+, Firefox97+, Safari TP 및 iOS Safari)는 @layer 키워드를 지원합니다.<br />

각 origin 레벨에 대해 여러개의 cascade layer 가 있을 수 있고, <br/>
각 레벨의 cascade layer 는 만들어진 순서에 따라 서로 다른 우선순위를 가집니다. <br/>

기본적으로 Layer 의 우선순위는 선언 순서로 결정됩니다.

```css
@layer a, b, c;

@layer a {
}
@layer b {
}
@layer c {
}
```

Layer `c` 가 가장 나중에 선언되었으므로 `c` 에 있는 스타일이 우선적으로 적용됩니다. <br/>

### 3.1 `@layer` 기본 사용법

캐스케이드 레이어는 다음과 같이 선언할 수 있습니다

```css
@layer layer-name {
}
```

`@layer` 를 사용하여 레이어를 선언한 후, 해당 레이어에 스타일을 작성하면 됩니다. <br/>

또, `@import` 를 사용하여 외부 CSS 파일을 가져올 때도 레이어를 지정할 수 있습니다.

```css
@import url("style.css") layer-name;
```

이렇게 하면 `style.css` 파일 전체가 `layer-name` 레이어에 포함됩니다. <br/>

### 3.2 중첩 레이어는

중첩 레이어를 사용하면 레이어의 이름 충돌을 방지하고 계층적으로 레이어를 구성할 수 있습니다. <br/>

다음과 같이 `@layer` 를 중첩해서 구성하거나,

```css
@layer a {
    @layer b {
        @layer c {
        }
    }
}
```

`@import` 를 사용할 수 있습니다.

```css
@import url("style.css") layer(layerA.layerB);
```

이렇게 하면 layerA 내부에 layerB 레이어가 생성되고, `style.css` 에 선언된 레이어는 `layerA.layerB` 레이어에 포함됩니다. <br/>

### 3.3 Layer 는 origin 내부의 우선순위 서브 시스템이다

위에서 언급했던것 처럼, CSS의 origin은 다음과 같은 순서로 적용됩니다.

> 1. User Agent
> 2. User
> 3. Author
> 4. Inline Style
> 5. Author !important
> 6. User !important

여기서 Cascade Layer는 Author, Author !important 범위 내에서만 적용됩니다.

```css
@layer base {
    .btn {
        color: red;
    }
}
@layer theme {
    .btn {
        color: blue;
    }
}
```

여기서,

두 스타일 모두 Author origin에 속하므로, <br/>

이 경우 우선순위는 **Cascade Layer 순서(base → theme)**를 따르게 됩니다.<br/>

따라서 theme가 나중에 선언되었기 때문에 `.btn { color: blue }`가 최종 적용됩니다.<br/>

즉, 같은 origin에서 동일한 specificity를 가진 스타일 간에, layer 순서가 우선순위를 결정합니다.

## 4. Selector 의 구체성

셀렉터는 더 구체적일수록 더 우선적으로 고려되어 스타일이 적용되기 때문에, <br/>
셀렉터를 구체적으로 작성하여 스타일의 우선순위를 높일 수 있습니다.

<br />

CSS 는 다음과 같은 우선순위를 따릅니다

> 인라인 스타일 (inline style) > id 셀렉터 > class 및 가상 셀렉터 > 태그 셀렉터 > 전체 셀렉터 > 상위 요소에 의해 상속된 속성

이때, 동일한 우선순위의 셀렉터가 있다면, `셀렉터의 숫자가 더 많은 선언이 우선순위가 높아집니다`

## 5. 선언 순서

CSS 에서 동일한 우선순위의 스타일이 여러 개 선언된 경우, **선언된 순서**에 따라 마지막에 선언된 스타일이 우선적으로 적용됩니다.

```css
div {
    color: red;
}
div {
    color: blue;
}
```

위의 예시에서 `div` 요소는 `blue` 색상이 적용됩니다. <br/>

또, link 태그를 통해 css 파일을 로드할 때도 나중에 쓰인 link 태그의 스타일이 우선적으로 적용됩니다.

```html
<link rel="stylesheet" href="style1.css" />
<link rel="stylesheet" href="style2.css" />
<link rel="stylesheet" href="style3.css" />
```

위의 예시에서 `style3.css` 의 스타일이 `style1.css`, `style2.css` 의 스타일보다 우선적으로 적용됩니다.

<br />

## 6. 상속

CSS 에서는 부모 요소의 스타일이 자식 요소에 상속되는 경우가 있습니다. <br/>
`color` `font-*` `text-*` `visibility` `white-space` `list-style` `border` 등과 같은 속성은 상속되는 반면에,
`margin` `padding` `background` `width` `height` `position` 등과 같은 속성은 상속되지 않습니다.

상속은 CSS 의 기본적인 동작 방식이므로, 상속을 활용하여 스타일을 일관되게 적용할 수 있습니다. <br/>
또한, `inherit` 키워드를 사용하여 부모 요소의 스타일을 자식 요소에 강제로 상속시킬 수 있습니다.

| inherit                   | initial           | unset                       |
| ------------------------- | ----------------- | --------------------------- |
| 부모 요소의 스타일을 상속 | 기본값으로 초기화 | 상속 또는 기본값으로 초기화 |

# 🔗 참고자료

- [MDX Cascade Layer](https://developer.mozilla.org/ko/docs/Learn_web_development/Core/Styling_basics/Cascade_layers)
