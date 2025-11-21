---
title: "[번역] 왜 React Context 는 상태 관리 도구가 아니며 Redux 를 대체하지 않는가"
createdAt: 2025-11-19
category: React
description: 이 글은 Mark Erikson의 "Why React Context is Not a 'State Management' Tool (and Why It Doesn't Replace Redux)" 을 기반으로 번역 및 보완한 글입니다. 저작권은 원문 저자에게 있습니다. 다소 의역이 포함되어 있을 수 있습니다.
comment: true
head:
    - - meta
      - name: keywords
        content: React, Redux, Context API, 상태 관리, State Management, 전역 상태, React Context
---

:::warning
이 글은 Mark Erikson의 ["Why React Context is Not a 'State Management' Tool (and Why It Doesn't Replace Redux)"](https://blog.isquaredsoftware.com/2021/01/context-redux-differences/)을
기반으로 번역 및 보완한 글입니다.
저작권은 원문 저자에게 있습니다.
:::

# 소개

"Context vs Redux"는 React의 현재 Context API가 출시된 이후 지금까지 React 커뮤니티에서 가장 많이 논쟁되는 주제 중 하나입니다. <br/>
아쉽게도 이 “논쟁”의 대부분은 두 도구의 목적과 사용 사례에 대한 혼란에서 비롯됩니다. 저는 인터넷 곳곳에서 수백 번이나 Context와 Redux에 대한 다양한 질문에 답해왔습니다. 하지만 혼란은 오히려 더 커지고 있습니다.

이 주제에 대한 질문이 너무 많이 반복되기 때문에, 이번 글을 통해 Context와 Redux가 실제로 무엇인지, 어떻게 쓰는 게 맞는지, 서로 어떻게 다르며, 언제 어떤 것을 사용해야 하는지 명확하게 설명해보겠습니다.

:::details TL;DR (요약)

1. Context와 Redux는 같은 도구인가?
    - 아니요. 역할도 다르고, 해결하려는 문제도 다릅니다.
2. Context는 “상태 관리 도구”인가?
    - 아니요. 단지 값을 전달하는 의존성 주입(Dependency Injection) 메커니즘일 뿐입니다.
    - 상태 관리 자체는 useState나 useReducer 같은 React 기능이 담당합니다.
3. Context + useReducer가 Redux를 대체할 수 있는가?
    - 비슷한 구조는 맞지만, 기능 차이가 큽니다. 특히 규모가 커질수록 한계가 드러납니다.
4. 언제 Context를 써야 할까?
    - Prop drilling 방지가 필요할 때 (같은 값을 여러 자식에게 내려주고 싶을 때)
5. 언제 Context + useReducer 조합을?
    - 특정 UI 영역 안에서 적당히 복잡한 상태를 관리할 때
6. 언제 Redux를 선택해야 할까?
    - 아래 상황이 하나라도 해당하면 Redux가 훨씬 낫습니다:
        - 전역에서 쓰이는 상태가 많다
        - 상태 변경이 자주 일어난다
        - 로직이 복잡하다
        - 코드베이스가 크고 협업 인원이 많다
        - 상태 변화 "추적(언제/왜/어떻게)"이 필요하다
        - 비동기/사이드이펙트/상태 영속화 등 고급 기능이 필요하다

:::

# Context 와 Redux 를 이해해야하는 이유

기술을 제대로 사용하려면 먼저

- 이 도구의 목적이 무엇인지
- 어떤 문제를 해결하려고 만든 것인지
- 지금 내 앱이 어떤 문제를 해결해야 하는지

이걸 정확이 알아야 합니다.

"남들이 쓰니깐", "유명하니까" 가 아니라 내 상황에 최적화된 도구를 선택해야 하죠.

`Context vs Redux` 논쟁이 사라지지 않는 이유도 대부분 둘이 해결하는 문제가 다르다는 사실을 모른 채 비교하기 때문입니다.

## React Context 란? - "상태관리" 가 아니다

React 공식문서에서의 Context 정의는 다음과 같습니다:

> Context 는 컴포넌트 트리를 통해 데이터를 전달할 수 있는 방법을 제공합니다. <br/>
> 모든 레벨에서 수동으로 props 를 전달할 필요 없이 데이터를 전달 할 수 있습니다.

일반적인 React 앱에서는 데이터가 props 를 통해 부모에서 자식으로 전달되지만, 어떤 종류의 props 들은 이 방식으로 처리하기가 번거로울 수 있습니다. (예. 테마)

Context 는 이러한 값들을 트리의 모든 레벨을 통해 명시적으로 props 를 전달하지 않고도 컴포넌트들 사이에서 공유할 수 있는 방법을 제공합니다.

여기에는 "값을 관리(managing) 한다" 는 내용은 전혀 없다는 점이 중요합니다 - 오직 **값을 전달하고, 공유하는것**에 대해서만 말하고 있습니다.

<br/>

현재의 React Context API (`React.createContext()`) 는 React 16.3에 처음 도입되었습니다. <br/>
많은 컴포넌트가 성능 최적화를 위해 `shouldComponentUpdate` 에 의존했기 때문에, 이것은 단순한 데이터를 전달하는데 어려움을 겪던 기존의 `context` 기능을 대체하기 위해 만들어졌습니다.

`createContext()` 는 이 문제를 해결하기 위해 설계되었으며, 따라서 중간의 컴포넌트가 렌더링을 건너뛰더라도 어떤 값의 업데이트라도 자식 컴포넌트에서 접근할 수 있도록 해줍니다.

:::details 🧐 Legacy Context 는 어떻게 처리했길래 ...

React 16.3 이전의 legacy context 는 "숨겨진 props 전달" 처럼 동작했습니다. <br/>
부모가 `context` 를 제공하면, 깊은 자식이 그 값을 몰래 가져다 쓰는 형태였습니다.

```ts
class Root extends React.Component {
    state = { isDarkMode: true };

    switchTheme = () => {
        this.setState((state) => ({ isDarkMode: !state.isDarkMode }));
    };
    getChildContext() {
        return { isDarkMode: this.state.isDarkMode };
    }
    render() {
      return <Parent/>;
    }
}

class Parent extends React.Component {
    render() {
        return <Child/>;
    }
}

class Child extends React.Component {
  render() {
    const {isDarkMode} = this.context;
    return <p>다크모드 : {isDarkMode}</p>;
  }
}
```

하지만 중간에 `shouldComponentUpdate` 에 의해서 `Parent` 컴포넌트가 렌더링을 건너뛰면, `Child` 컴포넌트는 `isDarkMode` 의 변경사항을 감지하지 못했습니다. <br/>

```ts
class Parent extends React.Component {
    shouldComponentUpdate() {// [!code focus]
        return false; // [!code focus]
    }// [!code focus]
    render() {
        return <Child/>;
    }
}
```

React 16.3 이후의 Context API 는 어디서든 업데이트가 발생하면 중간 컴포넌트가 렌더링을 건너뛰더라도 자식 컴포넌트가 최신 값을 받을 수 있도록 개선되었습니다.

즉, ❗️ Legacy Context 는 절대 상태공유에 쓰일 수 없었습니다. ❗️

:::

### Context 사용하기

React Context 를 사용하려면 몇가지 단계가 필요합니다:

1. `const MyContext = React.createContext()` 로 Context 객체를 생성합니다.
2. 부모 컴포넌트에서 `<MyContext.Provider value={...}>` 로 Context 값을 제공합니다.
3. 그런 다음, 해당 Provider 내부에 중첩된 어느 컴포넌트에서든 `const value = useContext(MyContext)` 를 사용하여 Context 값을 읽을 수 있습니다.
4. 부모 컴포넌트가 재렌더링되며 Context Provider 에 새로운 참조값을 전달하게 되면, 해당 Context 값을 읽는 모든 컴포넌트들은 강제로 재렌더링됩니다.

일반적으로 Context 에 전달되는 값은 아래와 같은 방식으로 React state 에서 가져온 값입니다.

```tsx
function ParentComponent() {
    const [counter, setCounter] = useState(0);

    const contextValue = { counter, setCounter };

    return (
        <MyContext.Provider value={contextValue}>
            <SomeChildComponent />
        </MyContext.Provider>
    );
}
```

자식 컴포넌트는 `useContext` 를 호출해서 값을 읽을 수 있습니다.

```tsx
function NestedChildComponent() {
    const { counter, setCounter } = useContext(MyContext);
}
```

### Context 의 목적과 사용사례

위 내용을 기반으로 보면 Context 는 실제로 어떠한것도 관리하지 않습니다. <br/>
다만 Context 는 마치 파이프나 웜홀과 같습니다.

`<MyContext.Provider>` 를 사용하여 어떤 값을 그 파이프의 윗 부분에 넣으면, 그 값은 파이프를 따라 내려가서 `useContext(MyContext)` 를 호출하는 컴포넌트에서 읽을 수 있게 됩니다.

따라서 Context 를 사용하는 주 목적은 `Prop Drilling 방지` 에 있습니다. <br/>
값이 필요한 컴포넌드들이 트리 깊숙한 곳에 있다고 해도, 레벨마다 props 를 명시적으로 전달하지 않고도, `<MyContext.Provider>` 내부에 있는 모든 컴포넌트는 `useContext(MyContext)` 를 통해 필요할 때 값을 가져올 수 있습니다.

이는 불필요한 props 전달 로직을 작성하지 않아도 되므로 코드를 단순화합니다.

## Redux 란?

비교를 위해 Redux 문서의 `Redux Essentials` 튜토리얼에 있는 설명을 살펴보겠습니다.

> Redux 는 `action` 이라 불리는 이벤트를 사용하여 애플리케이션 상태를 관리하고 업데이트하기 위한 패턴이자 라이브러리 입니다. <br/>
> 애플리케이션 전체에서 사용될 필요가 잇는 상태를 중앙 집중화된 저장소 (store) 에 보관하며, 상태가 예측 가능한 방식으로만 업데이트될 수 있도록 규칙을 제공합니다.
> <br/><br/>
> Redux 는 애플리케이션의 여러 부분에서 필요로 하는 전역 상태를 관리하는데 도움을 줍니다.
> <br/><br/>
> Redux 가 제공하는 패턴과 도구들은 애플리케이션의 상태가 언제, 어디서, 왜, 어떻게 업데이트 되는지, 그리고 그 변경이 발생했을 때 애플리케이션 로직이 어떻게 동작할지를 더 쉽게 이해할 수 있도록 합니다.

이 설명에서

- 명확히 **상태관리** 를 한다고 언급하고 있으며,
- Redux 의 목적은 상태가 시간이 지남에 따라 어떻게 변화하는지 이해하도록 돕는 것입니다.

역사적으로 Redux 는 2014년 React 가 출시된지 1년 후에 Facebook 이 제안했던 **Flux 아키텍쳐** 를 구현하기 위해 처음 만들어졌습니다. <br/>
그 발표 이후 커뮤니티는 다양한 방식의 Flux 개념을 적용한 수십 개의 라이브러리를 만들어 냈습니다.

Redux 는 2015년에 등장했고, 가장 뛰어난 설계, 사람들이 해결하고자 했던 문제와의 높은 적합성, React 와의 뛰어난 호환성 덕분에 "Flux 전쟁" 에서 빠르게 승리했습니다.

아키텍쳐적으로 Redux 는 함수형 프로그래밍 원칙을 강조합니다. <br/>
가능한 많은 코드를 예측가능한 `Reducer` 함수로 작성하도록 하고, "어떤 이벤트가 발생했는가?" 라는 개념과 "그 이벤트가 발생했을 때 상태가 어떻게 업데이트되는가?" 라는 로직을 분리해 둡니다.

또한 Redux 는 `미들웨어(middleware)` 를 사용하여 사이드 이펙트 처리를 포함한 Redux 저장소의 기능을 확장할 수 있도록 설계되었습니다.

Redux 는 또한 `Redux Devtools` 를 제공합니다. 애플리케이션에서 시간이 지남에 따라 dispatch 된 액션의 기록과 상태 변화의 이력을 확인할 수 있습니다.

### Redux 와 React

Redux 자체는 UI 라이브러리에 종속되지 않습니다. React Angular Vue 등 어떤 UI 와도 함께 사용할 수 있으며, 심지어 UI 없이도 사용할 수 있습니다.

그렇긴 하지만, Redux 는 대부분 React 와 함께 사용됩니다. <br/>
`react-redux` 라이브러리는 공식 UI 바인딩 레이어로서, React 컴포넌트가 Redux 상태 값을 읽고 액션을 디스패치하여 Redux 스토어와 상호작용할 수 있게 해줍니다. <br/>
그래서 대부분 사람들이 Redux 라고 말할 때 실제로는 `Redux Store` + `react-redux` 라이브러리를 함께 사용하는 것을 의미합니다.

`react-redux` 는 애플리케이션 내 어떤 React 컴포넌트라도 Redux 스토어와 통신할 수 있도록 해줍니다. <br/>
이는 `react-redux` 가 내부적으로 Context 를 사용하기 때문에 가능합니다.

하지만! 여기서 중요한 점은 `react-redux` 가 현재 상태 값을 전달하지 않고, ‼️ redux store 인스턴스 ‼️ 만 전달합니다. <br/>
이는 위에서 언급했던 것 처럼, Context 를 의존성 주입 (Dependency Injection) 용도로 사용하는 좋은 예시입니다.

Redux 에 연결된 React 컴포넌트는 Redux 스토어와 상호작용해야 한다는 것은 알고 있지만, 그 컴포넌트를 정의할 때 어떤 redux 스토어인지는 알 필요도 없고 신경쓸 필요도 없습니다.

실제 Redux Store 는 `<Provider/>` 컴포넌트를 사용하여 런타임에 트리에 주입됩니다.

이러한 이유로 `react-redux` 는 내부적으로 Context 를 사용하기 때문에, prop-drilling 을 방지하는 데에도 사용할 수 있습니다. <br/>
직접 `<MyContext.Provider>` 에 새로운 값을 넣는 대신, 그 데이터를 Redux 스토어에 넣고 어디서든 접근할 수 있습니다.

### React-Redux 의 목적과 사용 사례

Redux를 사용하는 주된 목적은 Redux 문서에 잘 나와 있습니다.

> Redux 가 제공하는 패턴과 도구들은 애플리케이션의 상태가 **언제, 어디서, 왜, 어떻게** 업데이트 되는지, 그리고 그런 변화가 발생했을 때 애플리케이션 로직이 어떻게 동작할지를 이해하기 쉽게 만들어줍니다.

Redux 를 사용하고 싶을 만한 추가적인 이유들도 있습니다. <br/>
그 중 하나가 바로 `prop drilling 방지` 입니다. <br/>
많은 사람들은 초기부터 prop drilling 을 방지하기 위해 Redux 를 사용했습니다. <br/>
React 의 Legacy Context 는 고장나 있었고, `react-redux`는 제대로 동작했기 때문입니다.

또한 다음과 같은 이유들로 redux 를 사용할 수 있습니다

- 상태 관리 로직을 UI 레이어와 완전히 분리하고 싶을 때
- AngularJS 에서 React 로 이관중인 애플리케이션 처럼 서로 다른 UI 레이어 간에 상태 관리 로직을 공유하고 싶을 때
- action 이 dispatch 될 때 middleware 의 강력한 기능으로 추가적인 로직을 실행하고 싶을 때
- redux 상태의 일부를 영구적으로 저장 하고 싶을 때
- 재현 가능한 (replayable) 버그 리포트를 가능하게 하고 싶을 때
- 개발 중에 로직과 UI 를 더 빠르게 디버깅하고 싶을 때

Dan Abramov 는 2016년에 작성한 글 [You Might Not Need Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367) 에서 이러한 사용 사례들 중 여러 가지를 언급했습니다.

## 왜 Context 는 "상태 관리 도구" 가 아닌가?

`State(상태)` 란 애플리케이션의 동작을 설명하는 어떠한 데이터입니다. <br/>
상태를 `서버 상태`, `위치 상태`, `통신 상태` 같은 범주로 나눌 수 있지만 핵심은 데이터가 **저장되고, 읽히고, 업데이트되고, 사용된다** 는 점입니다.

XState 라이브러리의 저자이자 상태머신 전문가인 David Khourshid 는

> State Management (상태관리) 란 시간이 지남에 따라 상태가 어떻게 변하는지 다루는 것이다

라고 했습니다.

또 State Management (상태관리) 는 다음과 같은 기능을 수행 할 수 있어야 한다고 했습니다

- 초기 값을 저장할 수 있어야 하고
- 현재 값을 읽을 수 있어야 하고
- 값을 업데이트할 수 있어야 하며
- 값이 변경되었음을 알 수 있어야 한다

React 의 `useState` 와 `useReducer` 훅은 상태 관리의 좋은 예라고 할 수 있습니다.

두 훅은 모두

- 훅을 호출해서 초기 값을 저장하고
- 값을 읽고
- `setState` 나 `dispatch` 를 통해 값을 업데이트하며
- 컴포넌트가 리렌더링됨으로써 값의 변경을 알 수 있습니다.

마찬가지로 `Redux` 와 `MobX` 도 명확히 상태 관리 도구입니다.

- Redux 는 root reducer 를 호출해서 초기 값을 저장하고, `store.getState()` 로 값을 읽으며, `store.dispatch(action)` 으로 업데이트 하고, `store.subscribe(listener)` 로 업데이트를 구독합니다
- MobX 는 스토어 클래스의 필드에 값을 할당해 초기 값을 저장하고, 필드를 읽거나 다시 값을 할당해 업데이트 하고, `autorun()` 과 `computed()` 를 통해 변경을 알립니다.

React Query, SWR, Apollo, Urql 같은 서버 상태 캐싱 라이브러리도 상태 관리의 정의에 해당한다고 볼 수 있습니다.

이들은 데이터를 가져와 초기 값을 저장하고, 훅을 통해 현재 값을 반환하며, 서버 mutation 을 통한 업데이트를 허용하고, 컴포넌트 리렌더링으로 변경을 알립니다.

그러나 React Context는 이런 기능을 제공하지 않습니다. <br/>
‼️ 따라서 Context 는 상태관리도구가 아닙니다 ‼️

앞서 설명한것과 같이 Context 는 스스로 아무것도 저장하지 않고, `<MyContext.Provider>` 를 렌더링하는 부모 컴포넌트가 어떤 값을 전달할지 결정하며, 그 값은 일반적으로 React state 에서 가져옵니다. <br/>
실제 상태 관리는 `useState` 나 `useReducer` 에서 일어납니다.

David Khourshid 는

> Context 는 이미 존재하는 상태를 컴포넌트 트리 전체에 전달하는 메커니즘일 뿐이다. <br/>
> Context 자체는 상태 관리와는 관련이 없다.

라고 했고, 최근 트윗에서

> Context 는 추상화된 상태라기 보다는 숨겨진 props 에 더 가깝다

고 했습니다.

결국 동일한 `useState`, `useReducer` 코드를 작성한 뒤, 데이터와 업데이트 함수를 prop drilling 으로 트리를 따라 아래로 전달할 수 있었던 것을 Context 로 생략 할 수 있게 된 것 뿐입니다.

# Context 와 Redux 의 비교

| 구분               | **React Context**                                         | **React + Redux**                             |
| ------------------ | --------------------------------------------------------- | --------------------------------------------- |
| 상태 저장/관리     | 아무것도 저장하거나 관리하지 않음                         | 하나의 값(일반적으로 객체)을 저장하고 관리    |
| UI 의존성          | React 컴포넌트 안에서만 동작                              | 어떤 UI에서도 사용 가능 (React 외부 포함)     |
| 값 전달 방식       | 단일 값만 전달<br>(원시값, 객체, 클래스 등 무엇이든 가능) | 스토어에 저장된 전체 상태 객체 접근 가능      |
| 값 읽기            | 현재 Context 값 읽기 가능                                 | 현재 스토어 상태 읽기 가능                    |
| Prop Drilling 방지 | 가능                                                      | 가능                                          |
| 상태 업데이트 방식 | 직접 상태 업데이트 기능 없음                              | 액션 디스패치 + 리듀서로 상태 업데이트        |
| DevTools 지원      | 현재 값만 표시<br>변경 **이력 추적 불가**                 | 모든 액션/상태 변화 **시간순 이력 추적 가능** |
| 성능 관리          | 값 변경 시 모든 소비자 강제 리렌더<br> 최적화 불가        | 특정 상태 조각만 구독, 필요한 경우에만 리렌더 |
| 사이드 이펙트 처리 | 관련 기능 없음 (렌더링만 담당)                            | 미들웨어를 통한 사이드 이펙트 처리 지원       |

공통점은 단 하나, 둘 다 `prop drilling` 을 방지하는 데 사용할 수 있다는 점입니다.

## Context 와 useReducer

Context vs Redux 논쟁에서 흔히 발생하는 문제 중 하나는, 사람들이 실제로는 `useReducer` 로 상태를 관리하고, Context 로 그 값을 전달하고 있다 라는 의미로 말하면서도 그걸 명시하지 않는다는 점입니다. <br/>
그냥 Context 를 사용하고 있어요 라고 말하죠. <br/>
이것이 제가 흔히 보는 혼란의 주요 원인이고, Context 가 상태를 관리한다는 잘못된 인식을 퍼뜨리는데 큰 역할을 합니다.

그래서 이번에는 Context + `useReducer` 조합을 구체적으로 살펴보겠습니다.

Context + `useReducer` 는 Redux + ReactRedux 와 매우 비슷해 보입니다. <br/>
두 방식 모두 아래의 기능을 갖고 있습니다.

- 저장된 값
- reducer 함수
- action dispatch 기능
- 그 값을 하위 컴포넌트에서 전달하고 읽는 방법

하지만, Context + `useReducer` 와 Redux + ReactRedux 기능과 동작방식에는 큰 차이점들이 존재합니다. 제가 앞서 쓴 글 [React, Redux 와 Context 의 동작](https://blog.isquaredsoftware.com/2020/01/blogged-answers-react-redux-and-context-behavior/) 과 [React Rendering 원리](https://blog.isquaredsoftware.com/2020/05/blogged-answers-a-mostly-complete-guide-to-react-rendering-behavior/) 에서 핵심 내용을 다뤘습니다.

요약하자면 다음과 같습니다.

Context + `useReducer` 는 현재 상태 값 전체를 Context 로 전달합니다. <br/>
반면 React Redux 는 Redux 스토어 인스턴스 자체를 Context 로 전달합니다. <br/>
즉, `useReducer` 가 새로운 상태 값을 생성하면, 그 Context 를 구독하는 모든 컴포넌트들은 강제로 재렌더링됩니다.

즉, `useReducer` 가 새로운 상태 값을 생성하면, 그 Context 를 구독하는 모든 컴포넌트들은 강제로 재렌더링됩니다. <br/>
심지어 그 값의 일부만 필요로 하는 컴포넌트들도 재렌더링됩니다.

이는

- 상태 크기가 얼마나 큰지
- 상태를 읽는 컴포넌트의 수
- 상태가 얼마나 자주 변경되는지

에 따라 성능 문제를 유발할 수 있습니다.

반면, React Redux 에서는 컴포넌트가 스토어 상태의 특정 부분만 구독할 수 있고, 해당 부분이 변경될 때만 재렌더링 됩니다.

추가적인 차이점들도 있습니다. <br/>

- Context + `useReducer` 는 리액트의 기능이기 때문에 React 외부에서 사용할 수 없는 반면에, Redux 는 UI 라이브러리와 독립적이어서 React 외부에서도 사용할 수 있습니다.
- React Devtools 는 Context 값을 표시할 수 있지만, 값의 변경 이력을 추적할수는 없습니다. Redux Devtools 는 dispatch 된 모든 액션과 상태 변경 이력을 추적할 수 있습니다.
- `useReducer` 는 사이드 이펙트 처리를 위한 별도의 middleware 가 존재하지 않습니다.

React Core 팀 아키텍트인 Sebastian Markbage 는 Context 에 대해

> Context는 업데이트가 거의 없는 값(locale/theme 등)에 적합합니다.
> 예전에 Context 가 쓰인 방식과 비슷하게 정적인 값을 위한 용도입니다.
> Flux 스타일의 상태 전파 전체를 대체할 준비는 되지 않았습니다

많은 글들이 큰 상태를 나누기 위해 여러개의 Context 를 생성하고, `useMemo`, `memo` 를 사용하며, 데이터와 업데이트 함수를 위한 Context 를 분리하는 등의 방식을 소개하지만..

그렇게 하면 결국 React-Redux 를 다시 만들게 되는 셈입니다.

그래서, Context + `useReducer` 는 언뜻 보면 Redux + ReactRedux 를 대체할 수 있어 보이지만, 기능적으로는 결코 완전한 대체제가 될 수 없습니다.

# 올바른 도구 선택하기

앞서 말했듯이, 어떤 도구가 어떤 문제를 해결하는지 이해하고 해결하려는 문제가 무엇인지 아는것이 문제를 해결할 수 있는 올바른 도구를 선택하는데 필수적입니다.

## 사용 사례

| 도구                     | 사용 사례                                                                                                                                                                                                                                                                                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Context**              | Prop-drilling 없이, 중첩된 컴포넌트들에게 값을 전달                                                                                                                                                                                                                                                                                              |
| **useReducer**           | 리듀서 함수를 사용하는, 적당히 복잡한 React 컴포넌트 상태 관리                                                                                                                                                                                                                                                                                   |
| **Context + useReducer** | 리듀서 기반 적당히 복잡한 컴포넌트 상태 관리 + 해당 상태 값을 prop-drilling 없이 전달                                                                                                                                                                                                                                                            |
| **Redux**                | 리듀서 기반 **중간 ~ 고도 복잡도 상태 관리**<br/>상태가 **언제, 왜, 어떻게** 변경되었는지 추적<br/>UI 레이어와 **완전히 분리된** 상태 관리 로직<br/>여러 UI 레이어 간 **상태 공유**<br/>Redux 미들웨어로 액션 시 **추가 로직 처리**<br/>Redux 상태 **부분적 영속 저장** 가능<br/>**재현 가능한 버그 리포트** 가능<br/>개발 중 **더 빠른 디버깅** |
| **Redux + React-Redux**  | Redux의 모든 사용 사례 + React 컴포넌트에서 Redux 스토어 상호작용                                                                                                                                                                                                                                                                                |

다시 말하지만, 이것들은 서로 다른 문제를 해결하는 서로 다른 도구들입니다.

## 추천!

그렇다면, Context / Context + useReducer / Redux + React-Redux 중
어떤 것을 선택해야 할까요?

해결하려는 문제에 가장 잘 맞는 도구를 선택해야 합니다!

- Prop-drilling만 피하면 되는 상황 : Context
- 적당히 복잡한 상태가 있고, 외부 라이브러리를 쓰고 싶지 않다면 : Context + useReducer
- 시간 흐름에 따른 상태 변경 추적, 특정 상태 조각만 리렌더, 강력한 사이드 이펙트 처리 등이 필요하면 : Redux + React-Redux

제 개인적인 의견은, 애플리케이션에서 상태 관련 Context가 2~3개를 초과하기 시작하면, 이미 약화된 React-Redux를 재개발하고 있는 것이므로 그냥 Redux로 전환해야 한다는 것입니다.

"Redux는 보일러플레이트가 많다" 는 말도 있는데, 그런 불만은 이제 매우 구식입니다. <br/>
현대의 Redux는 훨씬 쉽습니다:
공식 **Redux Toolkit(RTK)**이 보일러플레이트 문제를 해결하고 <br/>
React-Redux hooks API는 Redux 사용을 훨씬 단순하게 해줍니다.

최근 어떤 사용자가 이렇게 말했습니다:

> 우리는 Context + Hooks에서 RTK로 전환했습니다.
> 이 서비스는 연간 10억 달러 이상 처리합니다.
> RTK는 팀을 설득할 수 있게 해 준 멋진 도구였습니다.
> 보일러플레이트를 분석해보니, Context 디스패치 패턴보다
> RTK가 더 적은 보일러플레이트였습니다.
> 데이터 처리도 훨씬 쉬워졌습니다.

물론 RTK와 React-Redux는
Context + `useReducer` 보다 번들 크기를 조금 증가시킵니다.

하지만 그에 따른 이점인

- 더 나은 상태 변경 추적
- 더 단순하고 예측 가능한 로직
- 개선된 리렌더링 성능

을 고려하면, 충분히 가치 있는 트레이드오프입니다.

또한, 이 도구들은 상호 배타적이지 않습니다!
Redux, Context, useReducer를 동시에 사용할 수 있습니다.

- "전역 상태(global state)"는 Redux
- "지역 컴포넌트 상태(local state)"는 React state
- 반정적(semi-static) 값은 Context

한 앱에서도 목적에 따라 함께 사용할 수 있습니다.

명확하게 말하자면, <br/>
모든 앱이 Redux를 써야 한다는 말이 아닙니다. <br/>
항상 Redux가 더 낫다는 뜻도 아닙니다. <br/>

하지만 Redux는 여전히 유효한 선택지이고 많은 경우 그 가치 있는 선택이라는 것입니다.

그리고 Context와 Redux가 전부도 아닙니다!

다양한 상태 관리 도구들이 존재합니다:

- MobX — OOP 및 옵저버블 기반 자동 종속성 업데이트
- Jotai, Recoil, Zustand — 가벼운 로컬 상태 관리 방식
- React Query, SWR, Apollo, Urql — 서버 상태 캐싱 최적화
- RTK Query — Redux Toolkit용 서버 상태 도구

다시 말해:

도구마다 목적과 사용 사례가 다르고, 내 상황에 맞춰 선택하는 것이 중요합니다

# 결론

솔직히 말해서, 이 글이 "Context vs Redux?!?!?!?!?" 라는 끝이 없어 보이는 논쟁을 멈추게 하지는 못할 것이라는 걸 알고 있습니다.
너무 많은 사람들이 있고, 너무 많은 상반된 생각들이 있으며, 잘못된 소통과 잘못된 정보가 너무 많습니다.

그렇긴 해도, 이 글이 이러한 도구들이 실제로 무엇을 하는지,
그들이 어떻게 다르고,
언제 실제로 사용을 고려해야 하는지에 대해
명확하게 설명하는 데 도움이 되었기를 바랍니다.
(그리고 어쩌면 ... 아주 어쩌면 ...
이 글을 읽은 몇몇 분들은 이미 백만 번은 나왔던 동일한 질문을
굳이 다시 올릴 필요성을 느끼지 않을지도 모르겠습니다...)

:::info
다소 의역이 포함되어 있을 수 있습니다. 잘못된 부분이나 오해의 소지가 있는 부분이 있다면 언제든지 알려주세요.
:::
