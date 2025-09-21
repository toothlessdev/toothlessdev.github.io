---
title: JavaScript 비동기 프로그래밍
createdAt: 2024-03-20
category: JavaScript
description: JavaScript의 비동기 처리 방법들을 알아보겠습니다. Promise, async/await, fetch API 등을 활용한 비동기 프로그래밍 패턴을 다룹니다.
---

# 비동기 프로그래밍

JavaScript의 비동기 처리 방법들을 알아보겠습니다.

## Promise

```javascript
const fetchData = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("데이터 로드 완료");
        }, 1000);
    });
};
```

## async/await

```javascript
async function loadData() {
    try {
        const data = await fetchData();
        console.log(data);
    } catch (error) {
        console.error("에러 발생:", error);
    }
}
```

## fetch API

```javascript
async function getUsers() {
    const response = await fetch("/api/users");
    const users = await response.json();
    return users;
}
```
