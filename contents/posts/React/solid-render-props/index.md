---
title: "리액트에서도 의존성 주입으로 결합도를 낮춰보자! - Renderer Props 패턴 (feat.DIP)"
createdAt: 2025-11-01
category: React
description: 의존성 주입이 백엔드에서만 사용되는 패턴이라고? 리액트에서도 의존성 주입을 활용해 컴포넌트 간 결합도를 낮추고 재사용성을 높여보자! Renderer Props 패턴을 의존성 주입과 OCP, DIP 원칙과 연결지어 알아봅니다
comment: true
head:
    - - meta
      - name: keywords
        content: React, Renderer Props, 의존성 주입, DIP, OCP, SOLID 원칙, 리액트 디자인 패턴, 컴포넌트 재사용성
---

의존성 주입 (Dependency Injection, DI) 는 흔히 NestJS, Spring 같은 백엔드나 서버 프레임워크에서 많이 사용됩니다.

> "객체 간 결합도를 낮추기 위해, 의존성을 외부에서 주입한다"

그런데, 이 개념은 단순히 서버에서 객체를 생성하는 방식이 아니라, <br/>
`한 컴포넌트가 다른 컴포넌트의 구체적인 구현에 의존하지 않도록 분리하는 원리` 입니다.

React 에서도 이 원칙을 그대로 적용해서 컴포넌트 간 결합도를 낮추고 재사용성을 높일 수 있습니다<br/>
그렇다면 의존성, 의존성주입이 뭐고, 리액트에서 어떤식으로 활용할 수 있는지 살펴봅시당

## 🫨 의존성 (Dependency) 이 뭔데?

먼저 의존성이 뭔지 한번 짚고 넘어가겠습니다.

> A 가 B 를 사용한다면, A 는 B 에 의존하고 있다.

음... 좀 이해가 안가니 예시를 들어보겠습니다.

바리스타가 커피를 만드는 상황을 생각해봅시다. <br/>
위의 문장에 대입해보면 `바리스타(A)` 는 `커피 원두(B)` 를 사용해서 커피를 만듭니다. <br/>
즉, "`바리스타(A)` 는 `커피 원두(B)` 에 의존하고 있다" 고 할 수 있습니다.

### ☕️ 케냐산 원툴 바리스타

```ts
class Barista {
    coffeeBean: KenyaBean = new KenyaBean();

    makeCoffee() {
        this.coffeeBean.grind(); // 커피 원두를 분쇄합니다
        this.coffeeBean.brew(); // 커피 원액을 추출합니다
    }
}
```

바리스타는 커피를 만들기 전에, 직접 케냐산 커피원두를 직접 구매해서 사용하고 있습니다. <br/>

언뜻 보면 별 문제가 없어보이지만, 이 바리스타는 케냐산 커피원두만 사용해서 커피를 만들 수 있습니다. <br/>
만약 바리스타가 에티오피아산 커피원두로 바꾸고 싶다면, 코드를 수정해야 합니다. <br/>
즉, `Barista` 클래스가 `KenyaBean` 클래스의 **구체적인 구현에 의존**하고 있고, **강하게 결합**되어 있습니다. <br/>

:::info 정리하면,

- 이 바리스타는 "케냐 원두" 로만 커피를 만들 수 있는 (케냐산 원툴?) 바리스타 입니다.
- 다른 원두로 바꾸려면, 바리스타 자체를 다시 교육 (코드 수정) 해야 합니다
- 또 연습을 할 때도 꼭 비싼 케냐 원두를 사용해야 합니다.
  :::

<br/>

### 🧑‍🍳 의존성 주입으로 만능 바리스타를 만들어보자!

의존성 주입을 활용하면 바리스타가 특정 커피 원두에 의존하지 않도록 만들 수 있습니다! <br/>

> A 가 직접 의존 대상을 만들지 말고, 외부에서 주입(inject) 받아라 <br/>
> 즉, 필요한 것을 스스로 생성하지 말고 외부에서 받아서 쓰자!

아까의 상황에 대입해서 의존성을 주입해보겠습니다. <br/>
`바리스타(A)` 가 `커피 원두(B)` 를 직접 만들지 않고, 외부에서 주입받도록 바꿔보겠습니다.

```ts
class Barista {
    constructor(private readonly coffeeBean: CoffeeBean) {}

    makeCoffee() {
        this.coffeeBean.grind(); // 커피 원두를 분쇄합니다
        this.coffeeBean.brew(); // 커피 원액을 추출합니다
    }
}
```

이제 `Barista` 클래스는 `CoffeeBean` 인터페이스에만 의존하게 되었습니다. <br/>
바리스타는 "원두가 있다" 라는 사실만 알고, 어떤 종류의 원두인지는 신경쓰지 않습니다! <br/>
즉, `Barista` 클래스는 어떤 종류의 커피 원두가 주입되든 상관없이 커피를 만들 수 있습니다. <br/>

```ts
interface CoffeeBean {
    grind(): void;
    brew(): void;
}

class KenyaBean implements CoffeeBean {
    /* ... */
}

class EthiopiaBean implements CoffeeBean {
    /* ... */
}

const kenyaBean = new KenyaBean();
const ethiopiaBean = new EthiopiaBean();

const kenyaBarista = new Barista(kenyaBean); // 케냐 원두로 커피 제작
kenyaBarista.makeCoffee();

const ethiopiaBarista = new Barista(ethiopiaBean); // 에티오피아 원두로 커피 제작
ethiopiaBarista.makeCoffee();
```

:::info 정리하면,
이제 이 바리스타는

- 어떤 원두가 들어오든 상관없이 커피를 만들 수 있고, (이제 원툴 아님)
- 새로운 원두가 추가되어도 바리스타를 재교육 할 필요가 없으며, (코드 수정 X)
- 연습할 때도 저렴한 원두로 연습할 수 있습니다. (비싼 케냐 원두 안써도 됨)
  :::

### ✍️ 의존성 주입 (DI) 와 의존성 역전 (DIP)

의존성 주입 (Dependency Injection, DI) 은 의존성 역전 원칙 (Dependency Inversion Principle, DIP) 을 구현하는 한 가지 방법입니다. <br/>

즉, 의존성 역전 원칙 (DIP) = 원칙 이고, <br/>
의존성 주입 (DI) = 구현 방법 입니다.

| 개념                                 | 뜻                                                    | 관계                                 |
| ------------------------------------ | ----------------------------------------------------- | ------------------------------------ |
| DIP (Dependency Inversion Principle) | 의존 관계의 방향을 "구체 → 추상"으로 뒤집는 설계 원칙 | "어떻게 의존해야 하는가"에 대한 철학 |
| DI (Dependency Injection)            | 의존 대상을 외부에서 주입(inject) 하는 구현 방법      | DIP를 실행에 옮기는 수단             |

의존성 주입은 크게 3가지 방법을 통해 이루어질 수 있습니다.

| 방식            | 예시                                          | 설명                                |
| --------------- | --------------------------------------------- | ----------------------------------- |
| 생성자 주입     | `constructor(private coffeeBean: CoffeeBean)` | 가장 일반적, 불변성 보장            |
| Setter 주입     | `setBean(coffeeBean: CoffeeBean)`             | 런타임 교체 가능                    |
| 인터페이스 주입 | `implements ICoffeeBeanAware`                 | 특정 프레임워크(Spring 등)에서 사용 |

:::details 🙋‍♂️ 잘 이해가 안돼요

1. 생성자 주입

- 바리스타가 커피를 만들 때, 처음부터 원두를 받아서 그 원두로만 커피를 만듭니다.
- 원두는 한 번 정해지면 바뀌지 않으므로 가장 안정적이고 불변성이 보장됩니다.

2. Setter 주입

- 바리스타가 일하다가 "오늘은 에티오피아 원두로 바꿔볼까?" 하고 중간에 원두를 교체할 수 있는 방식입니다.
- 유연하지만, 잘못하면 맛이 들쭉날쭉할 수 있습니다.

3. 인터페이스 주입

- 바리스타가 "나는 어떤 원두가 들어오든 만들 수 있으니까, 커피 원두 공급 시스템이 알아서 나에게 원두를 넣어줘" 라고 말하는 구조입니다.
- 즉, 바리스타가 ICoffeeBeanAware 라는 계약(인터페이스)을 구현하면, 외부의 커피 공급 기계(컨테이너) 가 자동으로 적절한 원두를 넣어주는 방식입니다.
  :::

## ⚛️ 리액트 관점으로 보면...

리액트를 개발하면서도 알게 모르게 의존성 주입을 활용하고 있을 때가 많습니다. <br/>
위의 의존성 주입 방법 3가지를 리액트에서 찾아보겠습니다.

| 개념            | React에서는??                                           | 설명                                             |
| --------------- | ------------------------------------------------------- | ------------------------------------------------ |
| 생성자 주입     | `function Component({ service }: { service: Service })` | props를 통해 주입받는 패턴 (가장 일반적)         |
| Setter 주입     | `useEffect(() => setFetcher(newFetcher), [deps])`       | 훅이나 상태를 통해 런타임에 교체 가능            |
| 인터페이스 주입 | `Context.Provider` / `useContext()`                     | Context 시스템이 내부적으로 "주입자 역할"을 수행 |

즉, OOP 에서의 생성자, Setter, 인터페이스 주입은 <br/>
리액트에서는 각각 props, 상태/훅, Context 로 대응된다고 볼 수 있습니다.

## 💉 Renderer Props 패턴?

리액트에서 의존성 주입을 활용하는 대표적인 디자인 패턴 중 하나가 [Renderer Props 패턴](https://patterns-dev-kr.github.io/design-patterns/render-props-pattern/)입니다. <br/>
Renderer Props 패턴은 컴포넌트가 렌더링할 UI를 외부에서 주입받는 방식입니다. <br/>

이름에서도 유추할 수 있듯이, `render` 라는 prop을 통해 렌더링할 내용을 주입받습니다.

### 🫘 Renderer Props 의존성 주입으로 만능 바리스타 만들기

그럼 다시 바리스타 예시로 돌아가서, Renderer Props 패턴을 활용해봅시다. <br/>
비슷하게 추상화된 "커피원두" 인터페이스를 먼저 정의해 보겠습니다.

```ts
interface CoffeeBean {
    origin: string;
    grind(): Promise<void>;
    brew(): Promise<void>;
}
```

그리고 해당 추상화된 커피 원두를 사용하는 `Barista` 컴포넌트를 만들어보겠습니다. <br/>
(추상화된 커피원두 인터페이스에 의존하기 때문에 DIP 원칙을 지키고 있습니다)

```tsx
type 커피상태 = "대기" | "분쇄중" | "추출중" | "완료";

interface BaristaProps {
    bean: CoffeeBean;
    render: (bean: CoffeeBean, status: 커피상태) => React.ReactNode;
}

function Barista({ bean, render }: BaristaProps) {
    const [status, setStatus] = useState<커피상태>("대기");

    useEffect(() => {
        async function makeCoffee() {
            setStatus("분쇄중");
            await bean.grind();
            setStatus("추출중");
            await bean.brew();
            setStatus("완료");
        }
        makeCoffee();
    }, [bean]);

    return (
        <div>
            <p>☕️ 바리스타가 {bean.origin} 원두로 커피를 만듭니다.</p>
            <p>{render(bean, status)}</p>
        </div>
    );
}
```

이제 `Barista` 컴포넌트는 `bean` prop을 통해 어떤 커피 원두가 들어오든 상관없이 커피를 만들 수 있습니다. <br/>
또한, `render` prop을 통해 커피 상태에 따른 **UI**를 외부에서 주입받을 수 있습니다.

```tsx
const kenyaBean = {
    origin: "케냐산",
    async grind() {
        console.log("케냐 원두 분쇄 완료");
    },
    async brew() {
        console.log("케냐 커피 추출 완료");
    },
};

function Cafe() {
    return (
        <Barista
            bean={kenyaBean}
            render={(bean, status) => (
                <span>
                    손님 지금 {bean.origin} 원두로 만든 커피가 {status} 상태입니다!
                </span>
            )}
        />
    );
}
```

:::details 🙋‍♂️ 케냐산 원두 (kenyaBean) 가 CoffeeBean 인터페이스를 구현하지 않았는데도 되는 이유가 뭔가요? - Duck Typing

TypeScript 에서는 덕 타이핑(Duck Typing) 이라는 개념이 있어서, 객체가 특정 인터페이스의 모든 속성과 메서드를 가지고 있으면 해당 인터페이스를 구현한 것으로 간주합니다. <br/>

```ts
interface Duck {
    quack(): void;
}

const duck: Duck = {
    quack() {
        console.log("꽥꽥");
    },
};

const person: Duck = {
    quack() {
        console.log("꽥! ☠️ (대충 사람 죽을때 나는 소리)");
    },
};
```

쉽게 말해, 사람이지만 꽥 소리를 냈으니까 TypeScript 입장에서도 얘도 오리로 인정해주는거죠!
:::

이제 바리스타가 어떤 원두가 들어오든 상관없이 커피를 만들 수 있고, <br/>
커피 상태에 따라 어떤 말을 할지 (UI) 도 외부에서 주입받을 수 있게 되었습니다! <br/>

```tsx
function Cafe() {
    return (
        <Barista
            bean={kenyaBean}
            render={(bean, status) => (
                <span>
                    매니저님 지금 {bean.origin} 원두로 만든 커피가 {status} 상태입니다!
                </span>
            )}
        />
    );
}
```

## 🥲 그런데 왜 Renderer Props 패턴은 요즘 덜 쓸까?

Renderer Props 패턴은 의존성 주입(DI), DIP, OCP를 전부 만족시킬 수 있는 멋진 패턴이지만, <br/>
실전에서는 몇 가지 단점 때문에 요즘은 예전만큼 자주 쓰이지 않습니다.

1. Renderer Props Hell
    - 중첩된 Renderer Props 로 인해 코드가 복잡해지고 가독성이 떨어질 수 있습니다.

2. 재렌더링 전파
    - `render={(bean, status) => {...}}` 같은 익명 함수가 매 렌더링마다 새로 만들어 넘기기 때문에 부모가 재렌더링시 자식도 불필요하게 재렌더링될 수 있습니다.
    - 이를 방지하려면 `useCallback` 등으로 함수를 메모이제이션 해야 합니다.

3. 의도가 한 눈에 안보임
    - 함수 호출부만 보면 이 컴포넌트가 "무슨 데이터를 제공하는지", "상태가 어디서 오는지" 파악이 어렵습니다

4. 몇가지 대안 등장
    - 커스텀 훅, Context, Suspense 등 리액트 생태계에 다양한 대안이 등장하면서 Renderer Props 패턴의 필요성이 줄어들었습니다

## ⚙️ 결론!

1. "의존성 주입" 이란, 컴포넌트(혹은 함수)가 필요한 자원을 스스로 만들지 않고, 외부에서 전달받는 설계 방식이다.
2. 의존성 주입은 DIP (의존성 역전 원칙) 을 구현하는 한 가지 방법이다.
3. 3가지 의존성 주입 방식 (생성자 주입, Setter 주입, 인터페이스 주입) 이 있으며, 리액트에서는 각각 props, 상태/훅, Context 로 대응된다.
4. Renderer Props 패턴은 리액트에서 의존성 주입을 활용하는 대표적인 디자인 패턴으로 UI도 어떻게 렌더링할지 외부에서 주입받을 수 있다.
5. 사람이 죽을때 꽥! 소리를 내도 TypeScript 입장에서는 오리로 인정해준다 (덕 타이핑)
