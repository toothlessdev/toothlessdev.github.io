---
title: ES6 기본 문법
createdAt: 2024-03-15
category: JavaScript
description: ES6에서 새로 추가된 기본 문법들을 알아보겠습니다. let, const, 화살표 함수, 템플릿 리터럴 등 모던 JavaScript의 핵심 기능들을 다룹니다.
---

# ES6 기본 문법

ES6에서 새로 추가된 기본 문법들을 알아보겠습니다.

## let과 const

```javascript
let name = "John";
const age = 25;
```

### 특징

- `let`: 블록 스코프를 가지는 변수
- `const`: 상수, 재할당 불가

## 화살표 함수

```javascript
const add = (a, b) => a + b;
const greet = (name) => `Hello, ${name}!`;
```

## 템플릿 리터럴

```javascript
const message = `안녕하세요, ${name}님! 나이는 ${age}세입니다.`;
```
