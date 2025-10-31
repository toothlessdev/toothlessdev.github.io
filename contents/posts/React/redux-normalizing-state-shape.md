---
title: "[Redux 공식문서 번역] Normalizing State Shape"
createdAt: 2025-10-31
category: React
description: "Redux 애플리케이션에서 상태 구조를 정규화하는 방법에 대해 알아봅니다. 이 글은 Redux 공식 번역이 아니며, 개인 학습 및 공유 목적으로 작성된 비공식 번역입니다. (원문 : https://redux.js.org/usage/structuring-reducers/normalizing-state-shape)"
comment: true
head:
    - - meta
      - name: keywords
        content: Redux, Normalizing State Shape, Redux 공식문서 번역, 전역상태관리, React, ReduxJS, Redux 공식문서 번역, ReduxToolkit 공식문서 번역
---

:::warning ⚠️ 이 글은 Redux 공식 번역이 아니며, 개인 학습 및 공유 목적으로 작성된 비공식 번역입니다.

본 글은 Redux 공식문서의
[Normalizing State Shape 섹션](https://redux.js.org/usage/structuring-reducers/normalizing-state-shape)을 비공식 번역한 내용입니다. <br/>
원문 저작권은 Dan Abramov 및 Redux 기여자들에게 있으며, MIT License 에 따라 사용되었습니다.
:::

얼마전, Redux 를 사용하면서 상태를 업데이트하는 reducer 로직을 작성했는데, <br/>
상태가 점점 깊게 중첩되고, 해당 상태를 업데이트하기위해 순회를 반복하는 코드가 많아지는 것을 발견했습니다. <br/>

```ts
// 해당 아이템과 카테고리에 속한 아이템을 찾아서 업데이트하는 예시
// 시간복잡도 = O(n)
export function updateItem(
    state: State,
    action: PayloadAction<{ itemId: string; newValue: string }>,
) {
    const { itemId, newValue } = action.payload;
    return produce(state, (draft) => {
        const category = draft.categories.find((cat) =>
            cat.items.some((item) => item.id === itemId),
        );
        if (category) {
            const item = category.items.find((item) => item.id === itemId);
            if (item) {
                item.value = newValue;
            }
        }
    });
}
```

아이템의 개수가 작을때는 문제가 없겠지만, 아이템이 많아지면 매번 순회하면서 찾아야 하므로 성능에 문제가 생길 수 있겠다는 생각이 들었습니다. <br/>

> 상태를 업데이트 할 때 마다 $O(n)$ 의 시간복잡도가 발생하기 때문이죵..

백엔드 친구랑 이야기하다가, 데이터베이스에서 데이터를 정규화(Normalization) 하는 개념이 떠올랐고, <br/>
Redux 상태도 정규화된 형태로 관리하면 좋겠다는 생각이 들어 공식문서를 찾아보게 되었습니다. <br/>

실제로 Redux 공식문서에서도 상태를 정규화하는 방법을 권장하고 있었고, <br/>
이번 포스트에서는 해당 내용을 정리해보았습니다. <br/>

## Normalizing State Shape

많은 애플리케이션은 중첩되거나 관계형 구조의 데이터를 다룹니다. <br/>
예를 들어, 블로그 편집기에는 여러 게시글(Post) 이 있을 수 있고, 각 게시글에는 여러 댓글(Comment) 이 달릴 수 있으며, 게시글과 댓글 모두 사용자(User) 가 작성합니다. <br/>
이런 종류의 애플리케이션 데이터는 다음과 같은 형태를 가질 수 있습니다.

```js
const blogPosts = [
    {
        id: "post1",
        author: { username: "user1", name: "User 1" },
        body: "......",
        comments: [
            {
                id: "comment1",
                author: { username: "user2", name: "User 2" },
                comment: ".....",
            },
            {
                id: "comment2",
                author: { username: "user3", name: "User 3" },
                comment: ".....",
            },
        ],
    },
    {
        id: "post2",
        author: { username: "user2", name: "User 2" },
        body: "......",
        comments: [
            {
                id: "comment3",
                author: { username: "user3", name: "User 3" },
                comment: ".....",
            },
            {
                id: "comment4",
                author: { username: "user1", name: "User 1" },
                comment: ".....",
            },
            {
                id: "comment5",
                author: { username: "user3", name: "User 3" },
                comment: ".....",
            },
        ],
    },
    // and repeat many times
];
```

데이터 구조가 다소 복잡하고, 일부 데이터가 중복되어 있다는 점에 주목하세요.
이런 문제는 다음과 같은 문제가 있습니다

#### 1. 데이터 중복 문제

- 동일한 데이터가 여러 곳에 복제되어 있으면, 해당 데이터가 변경될 때 모든 복제본을 올바르게 업데이트하기가 어렵습니다.

#### 2. 중첩 구조로 인한 복잡성 증가

- 데이터가 중첩되어 있으면, 그에 따른 리듀서(reducer) 로직도 더 깊고 복잡해집니다.
- 특히 깊이 중첩된 필드를 업데이트하려 할 때 코드가 매우 지저분해지고 유지보수가 어려워질 수 있습니다.

#### 3. 불변성 (Immutability) 으로 인한 성능 문제

- Redux 상태는 불변성을 유지해야 하므로, 중첩된 데이터를 업데이트할 때는 해당 데이터뿐만 아니라 그 상위(ancestor) 객체들도 모두 복사 및 갱신해야 합니다.
- 이렇게 새로운 객체 참조가 생성되면, 실제로 데이터가 바뀌지 않은 UI 컴포넌트까지 불필요하게 리렌더링될 수 있습니다.

이러한 이유로 Redux에서는 관계형(relational) 또는 중첩된(nested) 데이터를 다룰 때,
스토어의 일부를 데이터베이스처럼 취급하고, 데이터를 정규화(normalized) 형태로 관리하는 것이 권장됩니다.

## Designing a Normalized State (정규화된 상태 설계)

데이터를 정규화(Normalizing) 하는 기본 개념은 다음과 같습니다

#### 1. 각 데이터 유형별로 "테이블" 을 분리합니다.

예를들어, `users`, `posts`, `comments` 처럼 각 엔티티마다 독립된 테이블을 만듭니다.

#### 2. 각 "데이터 테이블" 은 객체 형태로 아이템을 저장합니다.

키는 해당 아이템의 ID, 값은 실제 아이템 객체로 구성합니다

```js
{
    posts: {
        1: { id: 1, title: "첫 게시글" },
        2: { id: 2, title: "Redux 소개" },
    }
}
```

#### 3. 다른 데이터를 참조할 때는 ID만 저장합니다.

예를들어, 댓글(comment) 에서 작성자(user) 를 직접 포함하지 않고, 작성자의 `userId` 만 저장합니다.

```js
{
    comments: {
        1: { id: 1, userId: 2, comment: "멋진 글이네요!" },
        2: { id: 2, userId: 3, comment: "많은 도움이 되었습니다." },
    }
}
```

#### 4. 배열은 ID들의 순서를 표현하는 용도로 사용합니다.

예를들어, 특정 게시물의 댓글 순서를 `[5, 7, 9]` 같은 ID 배열로 표현합니다.

```js
{
    postComments: {
        1: [5, 7, 9], // 게시물 ID 1의 댓글 ID 배열
        2: [10, 11],  // 게시물 ID 2의 댓글 ID 배열
    }
}
```

#### 블로그 예제의 정규화

블로그 예제에 대한 정규화된 상태 구조는 다음과 같이 나타날 것입니다.

```js
{
    posts: {
        byId: {
            post1: {
                id: "post1",
                author: "user1",
                body: "......",
                comments: ["comment1", "comment2"]
            },
            post2: {
                id: "post2",
                author: "user2",
                body: "......",
                comments: ["comment3", "comment4", "comment5"]
            }
        },
        allIds: ["post1", "post2"]
    },
    comments: {
        byId: {
            comment1: {
                id: "comment1",
                author: "user2",
                comment: "....."
            },
            comment2: {
                id: "comment2",
                author: "user3",
                comment: "....."
            },
            comment3: {
                id: "comment3",
                author: "user3",
                comment: "....."
            },
            comment4: {
                id: "comment4",
                author: "user1",
                comment: "....."
            },
            comment5: {
                id: "comment5",
                author: "user3",
                comment: "....."
            }
        },
        allIds: ["comment1", "comment2", "comment3", "comment4", "comment5"]
    },
    users: {
        byId: {
            user1: {
                username: "user1",
                name: "User 1"
            },
            user2: {
                username: "user2",
                name: "User 2"
            },
            user3: {
                username: "user3",
                name: "User 3"
            }
        },
        allIds: ["user1", "user2", "user3"]
    }
}
```

이 상태 구조는 전체적으로 훨씬 Flat(평평)합니다. <br/>
기존의 중첩된 구조에 비해 여러 면에서 개선된 형태입니다.

#### 1. 데이터 일관성 유지

각 항목이 오직 한 곳에서만 정의되어 있기 때문에, <br/>
어떤 데이터가 변경될 때 여러 위치를 동시에 수정할 필요가 없습니다.

#### 2. Reducer 로직 단순화

데이터가 깊이 중첩되어 있지 않으므로, <br/>
Reducer 가 깊은 단계까지 접근하거나 복사할 필요가 없어집니다. <br/>
즉, 상태 업데이트 로직이 훨씬 단순하고 명확해집니다.

#### 3. 일관된 데이터 접근 방식

특정 아이템을 가져오거나 수정할 때, 그 아이템의 타입(type)과 ID만 알면 됩니다. <br/>
다른 객체 속을 파고들 필요 없이, `state[entityType].entities[id]` 처럼 일관된 접근이 가능합니다.

#### 4. 불필요한 리렌더링 최소화

데이터 타입이 분리되어 있기 때문에, <br/>
예를들어 댓글(Comment)의 내용을 바꾸더라도, `comments > byId > comment` 부분만 새로 복사하면 됩니다.

즉, 전체 트리의 일부분만 변경되므로, 실제로 변경된 데이터와 관련된 컴포넌트만 리렌더링됩니다.

<br/>

반면, 원래의 중첩 구조에서는 댓글 하나를 수정하더라도 <br/>

- 댓글 객체 (Comment)
- 부모 게시글 (Post)
- 게시글 배열 전체 (Posts[])

가 모두 업데이트되어야 하고, 결과적으로 모든 `Post`, `Comment` 컴포넌트가 불필요하게 다시 렌더링되었을 것입니다.

#### 5. 컴포넌트 연결 구조의 변화와 성능 향상

정규화된 상태 구조를 사용하면, 일반적으로 더 많은 컴포넌트가 직접 store 에 연결되고, <br/>
각 컴포넌트가 자신의 데이터만 조회하게 됩니다.

즉, 상위 컴포넌트가 대량의 데이터를 조회하여 자식에게 전부 내려주는 방식 대신, <br/>
상위 컴포넌트는 `ID` 만 전달하고, 자식 컴포넌트는 `자신의 ID 기반으로 데이터를 직접 구독`합니다.

이 패턴은 React Redux 애플리케이션에서 UI 성능 최적화에 매우 효과적이며, <br/>
결국 상태를 정규화 하는것이 성능 개선의 핵심적인 역할을 하게 됩니다.

## Organizing Normalized Data in State (정규화된 데이터를 상태로 구성하기)

일반적인 애플리케이션은 관계형 데이터와 비관계형 데이터가 섞여 있습니다. <br/>
이 서로 다른 데이터 타입을 정확이 어떻게 구성해야 한다는 규칙은 없지만, 흔히 쓰는 패턴 중 하나는 관계형 "테이블"들을 `entities` 같은 공통 상위 키 아래에 모으는 방식입니다.

이 접근을 활용한 상태 구조 예시는 다음과 같습니다.

```js
{
  simpleDomainData1: { .... },
  simpleDomainData2: { .... },
  entities: {
    entityType1: { .... },
    entityType2: { .... }
  },
  ui: {
    uiSection1: { .... },
    uiSection2: { .... }
  }
}
```

이 구조는 여러 방식으로 확장할 수 있습니다. <br/>
예를들어 엔티티 편집 기능이 수많은 애플리케이션이라면, 상태에 "테이블" 을 두번 두는 전략이 유용할 수 있습니다. <br/>

하나는 `current` (현재 값), 다른 하나는 `work-in-progress` (편집 중인 값) 용도로 사용하는 것입니다.

항목을 편집할 때는 해당 값을 `work-in-progress` 영역으로 복사하고, 이후의 업데이트 액션은 `work-in-progress` 복사본에만 적용합니다. <br/>
이렇게 하면 편집 폼은 편집본을 기준으로 제어되는 동안, UI 의 다른 부분은 원본을 계속 참조 할 수 있습니다.

- Reset(초기화) : `work-in-progress` 에서 해당 항목을 제거하고, `current` 의 원본 데이터를 다시 `work-in-progress`로 복사합니다.
- Apply(적용) : `work-in-progress`의 값을 `current` 영역으로 복사하여 편집 내용을 실제 값으로 반영합니다.

## Relationship and Tables (관계와 테이블 구조)

Redux 스토어의 일부를 "데이터베이스" 처럼 다루기로 했기 때문에, 데이터베이스 설계의 원칙들이 이곳에도 동일하게 적용됩니다.

예를들어 Many-To-Many 관계가 존재하는 경우, 두 엔티티 간의 연결을 표현하기 위해 별도의 `조인 테이블(join table)` 을 만들어야 할 수도 있습니다. <br/>

### 예시 : `authors`와 `books` 의 Many-To-Many 관계

```js
{
  entities: {
    authors: {
      byId: {},
      allIds: []
    },
    books: {
      byId: {},
      allIds: []
    },
    authorBook: {
      byId: {
        1: { id: 1, authorId: 5, bookId: 22 },
        2: { id: 2, authorId: 5, bookId: 15 },
        3: { id: 3, authorId: 42, bookId: 12 }
      },
      allIds: [1, 2, 3]
    }
  }
}
```

#### 조회 쿼리 예시 : 특정 작가의 모든 책 조회

이제 "이 작가가 쓴 모든 책을 조회" 하는 쿼리를 작성할때, `authorBook` 테이블을 한번 순회하는 것만으로 가능합니다.

```js
const getBooksByAuthor = (state, authorId) => {
    return state.entities.authorBook.allIds
        .map((id) => state.entities.authorBook.byId[id])
        .filter((rel) => rel.authorId === authorId)
        .map((rel) => state.entities.books.byId[rel.bookId]);
};
```

일반적인 클라이언트 애플리케이션의 데이터 양과 현대 JavaScript 엔진의 처리 속도를 고려하면, <br/>
이러한 방식의 관계 탐색은 대부분의 상황에서 충분히 빠르게 동작합니다.

즉, Redux 스토어를 데이터베이스처럼 설계하는 것은 <br/>
`데이터 일관성 유지`, `쿼리 단순화`, `성능 최적화` 측면에서 모두 합리적인 접근입니다.

## Normalizing Nested Data (중첩 데이터 정규화)

대부분의 API 는 데이터를 중첩된 형태(Nested Form) 으로 반환합니다. <br/>
이 데이터를 그대로 Redux 상태 트리에 넣으면 관리와 업데이트가 어렵기 때문에, <br/>
Store 에 포함시키기 전에 정규화(Normalization) 작업을 수행하는 것이 좋습니다.

~~이 작업에는 일반적으로 `Normalizr` 라이브러리가 사용됩니다~~

::: info 💬 NOTE
하지만.. deprecated 되었으므로, ReduxToolkit 에서 제공하는 `createEntityAdapter` 를 활용하는게 좋아 보입니다.
:::
