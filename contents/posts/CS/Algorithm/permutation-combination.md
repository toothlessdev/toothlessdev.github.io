---
title: Javascript 재귀함수로 풀어보는 순열(Permutation)
createdAt: 2025-12-22
category: CS
description: 재귀함수를 활용하여 순열(Permutation) 을 구현하는 방법에 대해 알아봅니다. SWAP 기반 방식과 DFS 기반 방식을 비교해봅니다.
comment: true
head:
    - - meta
      - name: keywords
        content: 순열, 조합, Permutation, Combination, 재귀함수, Javascript
---

# 📚 순열 (Permutation)

순열(Permutation) 은 서로 다른 여러 개의 원소를 순서 있게 나열하는 방법입니다.

예를들어, `{A,B,C}` 라는 3개의 원소가 있을 때, 이 원소들로 만들 수 있는 모든 순열은 다음과 같습니다:

- `{A,B,C}`
- `{A,C,B}`
- `{B,A,C}`
- `{B,C,A}`
- `{C,A,B}`
- `{C,B,A}`

위 예시에서 볼 수 있듯이, 3개의 원소로 만들 수 있는 순열의 개수는 6개입니다. <br/>
일반적으로 n개의 원소로 만들 수 있는 순열의 개수는 n! (n 팩토리얼)로 계산됩니다.

<center>

$n! = n \times (n-1) \times (n-2) \times ... \times 1$

</center>

## 일부만 뽑아 순열 만들기

경우에 따라서는 전체 원소 중 일부만을 뽑아 순열을 만들기도 합니다. <br/>
예를 들어, `{A,B,C}` 라는 3개의 원소 중에서 2개를 뽑아 만들 수 있는 순열은 다음과 같습니다:

- `{A,B}`
- `{B,A}`
- `{A,C}`
- `{C,A}`
- `{B,C}`
- `{C,B}`

위 예시에서 볼 수 있듯이, 3개의 원소 중 2개를 뽑아 만들 수 있는 순열의 개수는 6개입니다. <br/>
일반적으로 n개의 원소 중 r개를 뽑아 만들 수 있는 순열의 개수는 다음과 같이 계산됩니다.

<center>

$P(n, r) = {n!} / {(n-r)!}$

</center>

## JavaScript SWAP 과 재귀함수를 활용한 순열 구현하기

Swap 을 통해 원소의 위치를 바꾸고, 재귀함수를 활용하여 순열을 구현할 수 있습니다. <br/>

![](./img/permutation-swap.gif)

현재 `depth` 부터 끝까지의 원소를 앞자리(`depth`) 와 swap 하는 방식을 통해 경우의수를 만들어냅니다. <br/>
한 번 선택한 뒤에는 재귀로 다음 자리를 채우고, 재귀가 끝나면 다시 원래 상태로 swap 하여 복원합니다.

```js
function permutation(n, r, depth = 0) {
    if (r === depth) {
        // 원하는 r개를 뽑았을 때의 처리
        return;
    }
    for (let i = depth; i < n; i++) {
        [arr[i], arr[depth]] = [arr[depth], arr[i]];
        permutation(n, r, depth + 1);
        [arr[i], arr[depth]] = [arr[depth], arr[i]];
    }
}
```

## JavaScript DFS 와 재귀를 활용한 순열 구현하기

DFS와 재귀함수를 활용하여 순열을 구현할 수도 있습니다. <br/>

![alt text](./img/permutation-dfs.gif)

`depth` 마다 아직 사용하지 않은 원소를 하나 선택해 `path` 에 추가하고, 재귀로 다음 자리를 채우는 방식을 통해 경우의 수를 만들어냅니다. <br/>
`isVisited` 로 이미 선택한 원소의 재사용을 막아서 중복 없는 순열을 만들고, `depth === r` 이 되면 하나의 순열이 완성됩니다. <br/>
재귀가 끝나고 돌아오면 `pop` 과 `isVisited = false` 를 통해 상태를 복원하고 다음 선택지를 탐색합니다.

```js
const path = [];
const isVisited = new Array(n).fill(false);

function permutation(r, depth = 0) {
    if (r === depth) {
        // 원하는 r개를 뽑았을 때의 처리
        return;
    }
    for (let i = 0; i < n; i++) {
        if (isVisited[i]) continue;

        isVisited[i] = true;
        path.push(arr[i]);

        permutation(r, depth + 1);

        isVisited[i] = false;
        path.pop();
    }
}
```

## 🤔 두개 뭐가 다른데 ??

순열을 구현하는 방법에는 SWAP 기반 방식과 DFS 기반 방식이 있으며, <br/>
두 방식은 같은 결과를 만들지만 접근 방식과 활용 상황이 다릅니다.

### 1️⃣ 상태 관리 방식의 차이

SWAP 방식은 배열 자체를 직접 변경하며 순열을 만들어갑니다.
현재 depth 위치에 어떤 값을 둘지 결정하기 위해 원소를 swap 하고, 재귀가 끝나면 다시 되돌립니다.

DFS 방식은 원본 배열을 유지한 채, path 배열과 isVisited 배열로 선택 상태를 명시적으로 관리합니다.

### 2️⃣ 출력 순서와 문제 적합성

SWAP 방식은 순열 생성 자체에 집중한 방식으로,
출력 순서(사전순 등)를 보장하기 어렵고 후처리 정렬이 필요한 경우가 많습니다.

DFS 방식은 입력 배열을 정렬한 뒤 작은 값부터 탐색하므로,
자연스럽게 문제에서 요구하는 사전순 출력에 적합합니다.
