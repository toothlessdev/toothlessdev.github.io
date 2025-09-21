---
title: React Hooks 기초
createdAt: 2024-04-05
category: React
description: React Hooks를 사용한 함수형 컴포넌트 개발을 알아보겠습니다. useState, useEffect 등 기본 Hooks의 사용법과 패턴을 다룹니다.
---

# React Hooks 기초

React Hooks를 사용한 함수형 컴포넌트 개발을 알아보겠습니다.

## useState

```jsx
import { useState } from "react";

function Counter() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>카운트: {count}</p>
            <button onClick={() => setCount(count + 1)}>증가</button>
        </div>
    );
}
```

## useEffect

```jsx
import { useState, useEffect } from "react";

function UserProfile({ userId }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchUser(userId).then(setUser);
    }, [userId]);

    return user ? <div>{user.name}</div> : <div>로딩중...</div>;
}
```
