---
title: 백준 Baekjoon 알고리즘 문제풀이 팁 for NodeJS, JavaScript
createdAt: 2026-01-22
category: ProblemSolving
description: NodeJS 환경에서 Baekjoon 온라인 저지 문제를 풀때, 자료구조나 입력/출력 처리가 익숙하지 않은 분들을 위해 유용한 팁들을 정리했습니다.
comment: true
head:
    - - meta
      - name: keywords
        content: NodeJS, Baekjoon, 알고리즘, 문제풀이, 팁, 백준, 온라인 저지, 백준에서 NodeJS, JavaScript
---

# ✍️ 입력 처리 꿀팁

## 기본 입력 처리 방법

NodeJS 환경에서 백준 알고리즘 문제를 풀 때, 표준 입력을 처리하는 기본적인 방법은 다음과 같습니다.

```javascript
const fs = require("fs");

let input = fs
    .readFileSync(process.platform === "linux" ? 0 : "./in.txt")
    .toString()
    .trim();
```

백준 온라인 저지에서는 리눅스 환경에서 실행되기 때문에, `process.platform` 을 사용하여 운영체제를 확인하고, 리눅스인 경우에는 `/dev/stdin` 에서 입력을 읽어옵니다. <br>

이렇게 하면 로컬 환경에서 실행할때 `./in.txt` 파일에서 입력을 읽어오도록 설정할 수 있습니다. <br>

:::details VSCode 로 백준 문제를 푸는 경우 ?

[Competitive Programming Helper](https://marketplace.visualstudio.com/items?itemName=DivyanshuAgrawal.competitive-programming-helper) Extension 을 사용하면 따로 `process.platform` 을 확인하지 않고도 여러 테스트케이스에 대해 출력값을 쉽게 확인할 수 있습니다.

![alt text](./img/baekjoon-tip-for-nodejs/image.png)

:::

## 공백으로 구분된 입력 처리하기

공백으로 구분된 여러 값들을 한 줄에서 입력받아야 하는 경우가 있습니다. 이때, `split("\n")` 이 아닌 정규표현식을 사용해서 `개행문자` 와 `공백문자` 모두를 기준으로 나눌 수 있습니다.

```javascript
let input = fs
    .readFileSync(process.platform === "linux" ? "/dev/stdin" : 0)
    .toString()
    .trim()
    .split(/\s+/); // 개행문자와 공백문자 모두를 기준으로 분리
```

`/\s+/` 정규표현식은 하나 이상의 공백문자(스페이스, 탭, 개행 등)를 기준으로 문자열을 나누어 줍니다. 이를 통해 한 줄에 여러 값이 공백으로 구분되어 있을 때도 쉽게 처리할 수 있습니다.

## 여러 줄 입력 처리하기

백준 알고리즘 문제를 풀때, 문제에서 테스트케이스의 크기가 주어지는경우 또는 특정입력횟수(N)에 대해 반복적으로 입력을 받아야하는 경우가 있습니다.

이때, `next()` 헬퍼 함수를 미리 구현해두면 편리합니다.

```javascript
let input = fs
    .readFileSync(process.platform === "linux" ? "/dev/stdin" : 0)
    .toString()
    .trim()
    .split("\n");

let _cursor = 0;
let next = () => input[_cursor++];
```

이렇게 하면 `next()` 함수를 호출할 때마다 다음 줄의 입력을 쉽게 가져올 수 있습니다.

```javascript
const N = parseInt(next());

for (let n = 0; n < N; n++) {
    const line = next();
    // line을 이용한 다음줄 파싱
}
```

<br><br>

# ✍️ 출력 처리 꿀팁

## 1. 출력 빠르게 하기

가끔 출력이 많은 문제에서 `console.log()`를 여러번 호출하면 시간초과가 발생할 수 있습니다. 이럴 때는 출력값을 배열에 모아두었다가 한 번에 출력하면 시간초과가 발생하지 않습니다.

```javascript
let output = [];

for (let i = 0; i < N; i++) {
    output.push(solution());
}

// 출력 값을 배열에 저장 후 출력
console.log(output.join("\n"));
```

이렇게 하면 출력 횟수를 줄여서 성능을 향상시킬 수 있습니다.

<br><br>

# ✍️ 자료구조

## 배열 메서드 체이닝 줄이기

JavaScript에서 배열 메서드를 체이닝하여 사용하는 경우, 불필요한 중간 배열이 생성되어 TLE가 발생하거나 메모리가 터질수 있습니다.

```javascript
let result = array
    .filter(condition)
    .map(transformation)
    .reduce(aggregation)
    .sort(comparison)
    .slice(start, end);
```

때문에 `for` 문을 사용하여 한 번에 처리하는 것이 더 효율적일 수 있습니다.

## 배열 초기화

JavaScript에서 배열을 초기화할 때, `Array(length).fill(value)` 을 사용할 수 있습니다.

```javascript
let arr = Array(5).fill(0);
console.log(arr); // [0, 0, 0, 0, 0]
```

:::danger

`Array(length).map()` 을 사용하여 초기화하면 내부적으로 배열이 비어있기 때문에 순회가 되지 않습니다.

```javascript
let arr = Array(5).map(() => 0); // 잘못된 방법
console.log(arr); // [ <5 empty items> ]
```

:::

## 2차원 배열 복사하기

`Array.prototype.slice()` 는 얕은 복사를 수행합니다. <br>
때문에, 2차원 배열을 그냥 `slice()` 로 복사하면 내부 배열들은 여전히 원본 배열을 참조하게 됩니다.

:::danger

```javascript
let original = [
    [1, 2],
    [3, 4],
];
let copy = original.slice(); // 얕은 복사
copy[0][0] = 99;
console.log(original); // [[99, 2], [3, 4]] - 원본 배열도 변경됨
```

:::

때문에 2차원 배열을 복사할 때는 `Array.prototype.map()` 을 사용하여 각 행을 개별적으로 복사해야 합니다.

```javascript
let original = [
    [1, 2],
    [3, 4],
];
let copy = original.map((row) => row.slice()); // 깊은 복사
copy[0][0] = 99;
console.log(original); // [[1, 2], [3, 4]] - 원본 배열은 변경되지 않음
```

## 2차원 배열 초기화하기

JavaScript에서 2차원 배열을 초기화할 때, `Array.prototype.fill()` 메서드를 사용하면 같은 참조를 모든 행에 할당하게 됩니다.

:::danger

```javascript
let matrix = Array(rows).fill(Array(cols).fill(0)); // 잘못된 방법
```

이렇게 하면 모든 행이 동일한 배열을 참조하게 되어 특정 한 행의 값을 변경하면 모든 행에 영향을 미치게 됩니다.
:::

```javascript
let matrix = Array.from({ length: rows }, () => Array(cols).fill(0));
```

이 방법을 사용하면 각 행이 독립적인 배열로 생성되어 원하는 대로 2차원 배열을 초기화할 수 있습니다.

## Stack 구현하기

JavaScript 에서 기본적으로 제공하는 `Array` 는 Stack 자료구조로 활용할 수 있습니다. `push` 와 `pop` 메서드를 사용하여 스택의 삽입과 삭제를 $O(1)$ 의 시간복잡도로 처리할 수 있습니다.

```javascript
let stack = [];
stack.push(1); // 스택에 값 추가
let top = stack.pop(); // 스택에서 값 제거 및 반환
```

단, 스택의 최상단 값을 확인하고 싶을때 `stack[stack.length - 1]` 로 접근해야 합니다. <br>
`stack.at(-1)` 는 ES2022 에서 지원하기 때문에 백준 환경에서 ReferenceError 가 발생할 수 있습니다.

## Queue 구현하기

JavaScript 에서 기본적으로 제공하는 `Array` 는 Queue 자료구조로 활용할 수 있는것 처럼 보입니다.
하지만, `Array.prototype.shift()` 메서드는 배열의 맨 앞 요소를 제거할 때마다 나머지 요소들을 한 칸씩 앞으로 이동시키기 때문에 시간복잡도가 $O(n)$ 입니다.

따라서 JavaScript로 Queue를 구현할 때는 `Array` 대신 `Queue` 를 직접 만들어 사용하는 것이 좋습니다.

```javascript
class Queue {
    constructor() {
        this.q = {};
        this.head = 0;
        this.tail = 0;
    }
    push(v) {
        this.q[this.tail++] = v;
    }
    pop() {
        const v = this.q[this.head];
        delete this.q[this.head++];
        return v;
    }
    size() {
        return this.tail - this.head;
    }
    isEmpty() {
        return this.size() === 0;
    }
}
```

따로 `LinkedList` 를 구현하지 않고, 객체를 사용하여 큐를 구현할 수 있습니다. 이렇게 하면 `push` 와 `pop` 모두 $O(1)$ 의 시간복잡도로 동작합니다.

객체에 숫자 키를 사용한 방식은 배열의 `shift()` 없이 head / tail 포인터로 인덱스를 관리할 수 있어 모든 연산을 O(1)로 처리할 수 있습니다.

## Deque 구현하기

JavaScript 에서 Deque(양방향 큐)를 구현할 때도 `Array` 대신 객체를 사용하여 효율적으로 만들 수 있습니다.

```javascript
class Deque {
    constructor() {
        this.dq = {};
        this.head = 0;
        this.tail = 0;
    }
    pushFront(v) {
        this.dq[--this.head] = v;
    }
    pushBack(v) {
        this.dq[this.tail++] = v;
    }
    popFront() {
        const v = this.dq[this.head];
        delete this.dq[this.head++];
        return v;
    }
    popBack() {
        const v = this.dq[--this.tail];
        delete this.dq[this.tail];
        return v;
    }
    size() {
        return this.tail - this.head;
    }
    isEmpty() {
        return this.size() === 0;
    }
}
```

## PriorityQueue (우선순위 큐) 구현하기 (Min-Heap, Max-Heap)

NodeJS 에서는 기본적으로 우선순위 큐를 제공하지 않기 때문에, 최소힙(Min-Heap) 또는 최대힙(Max-Heap)을 직접 구현해야 합니다. 🥵

:::details MaxHeap 구현 예시

```javascript
class MaxHeap {
    constructor() {
        this.heap = [null];
    }
    swap(idx1, idx2) {
        [this.heap[idx1], this.heap[idx2]] = [this.heap[idx2], this.heap[idx1]];
    }
    push(element) {
        this.heap.push(element);
        let idx = this.heap.length - 1;

        while (idx !== 1) {
            let parent = Math.floor(idx / 2);

            if (this.heap[parent] < this.heap[idx]) {
                this.swap(parent, idx);
                idx = parent;
            } else {
                break;
            }
        }
    }
    pop() {
        if (this.heap.length === 1) return 0;
        if (this.heap.length === 2) return this.heap.pop();

        const element = this.heap[1];
        this.heap[1] = this.heap.pop();

        let idx = 1;

        while (true) {
            let left = idx * 2;
            let right = idx * 2 + 1;
            let max = idx;

            if (left < this.heap.length && this.heap[left] > this.heap[max]) {
                max = left;
            }
            if (right < this.heap.length && this.heap[right] > this.heap[max]) {
                max = right;
            }
            if (idx === max) {
                break;
            }

            this.swap(idx, max);
            idx = max;
        }
        return element;
    }
}
```

:::

::: details MinHeap 구현 예시

```javascript
class MinHeap {
    constructor() {
        this.heap = [null];
    }
    swap(idx1, idx2) {
        [this.heap[idx1], this.heap[idx2]] = [this.heap[idx2], this.heap[idx1]];
    }
    push(element) {
        this.heap.push(element);

        let idx = this.heap.length - 1;

        while (idx !== 1) {
            let parent = Math.floor(idx / 2);

            if (this.heap[parent] > this.heap[idx]) {
                this.swap(parent, idx);
                idx = parent;
            } else {
                break;
            }
        }
    }
    pop() {
        if (this.heap.length === 1) return null;
        if (this.heap.length === 2) return this.heap.pop();

        const element = this.heap[1];
        this.heap[1] = this.heap.pop();

        let idx = 1;

        while (true) {
            let left = idx * 2;
            let right = idx * 2 + 1;
            let min = idx;

            if (left < this.heap.length && this.heap[left] < this.heap[min]) {
                min = left;
            }
            if (right < this.heap.length && this.heap[right] < this.heap[min]) {
                min = right;
            }
            if (min === idx) {
                break;
            }

            this.swap(min, idx);
            idx = min;
        }
        return element;
    }
}
```

:::

각각의 Heap 이 모두 사용되는 문제가 있는 경우, 생성자로 `compare` 함수를 받아서 Min-Heap 과 Max-Heap 을 하나의 클래스에서 처리할 수도 있습니다.

```javascript
class Heap {
    constructor(compare) {
        this.heap = [null];
        this.compare = compare;
    }
    swap(idx1, idx2) {
        [this.heap[idx1], this.heap[idx2]] = [this.heap[idx2], this.heap[idx1]];
    }
    push(e) {
        this.heap.push(e);
        let idx = this.heap.length - 1;

        while (idx > 1) {
            let parent = Math.floor(idx / 2);

            if (this.compare(this.heap[idx], this.heap[parent])) {
                this.swap(parent, idx);
                idx = parent;
            } else break;
        }
    }
    pop() {
        if (this.heap.length <= 1) return null;
        if (this.heap.length === 2) return this.heap.pop();

        let element = this.heap[1];
        this.heap[1] = this.heap.pop();

        let idx = 1;

        while (true) {
            let left = idx * 2;
            let right = idx * 2 + 1;
            let target = idx;

            if (left < this.heap.length && this.compare(this.heap[left], this.heap[target])) {
                target = left;
            }
            if (right < this.heap.length && this.compare(this.heap[right], this.heap[target])) {
                target = right;
            }
            if (idx !== target) {
                this.swap(idx, target);
                idx = target;
            } else break;
        }
        return element;
    }
    peek() {
        if (this.heap.length <= 1) return null;
        return this.heap[1];
    }
}

const minHeapCompareFn = (a, b) => a < b;
const maxHeapCompareFn = (a, b) => a > b;

let minHeap = new Heap(minHeapCompareFn);
let maxHeap = new Heap(maxHeapCompareFn);
```

최소힙, 최대힙, 우선순위큐 문제를 구현을 보지않고 풀어보면서 익숙해지는 것이 중요합니다.

## Set 활용하기

어떤 값이 존재하는지 빠르게 확인해는 경우 `Array.prototype.includes()` 메서드를 사용하는 것보다 `Set` 자료구조를 사용하는 것이 더 효율적입니다.

`Set` 은 내부적으로 해시 테이블을 사용하기 때문에 평균적으로 $O(1)$ 의 시간복잡도로 값의 존재 여부를 확인할 수 있습니다.

```javascript
let set = new Set();

set.add(value); // 값 추가
set.has(value); // 값 존재 여부 확인
set.delete(value); // 값 삭제
```

Set 은 Iterable 이기 때문에 `for...of` 문, `[...]` 스프레드 연산이나 `Array.from()` 등을 사용하여 순회하거나 배열로 변환할 수 있습니다.

```javascript
for (let value of set) {
    console.log(value);
}
for (const [v1, v2] of set.entries()) {
    // v1 === v2
}
let arr = [...set]; // 스프레드 연산으로 배열 변환
let arr = Array.from(set); // Array.from() 으로 배열 변환
```

아쉽게도
`Set.prototype.union()`, `Set.prototype.intersection()`, `Set.prototype.difference()` 같은 메서드는 ES2024 에서 추가된 기능이기 때문에 백준 환경에서 ReferenceError 가 발생할 수 있습니다. 따라서 직접 구현해서 사용해야 합니다. 🥵

1. `union` (합집합)

$$
A \cup B = \{ x | x \in A \lor x \in B \}
$$

```javascript
const union = new Set(Array.from(A).concat(Array.from(B)));
```

2. `intersection` (교집합)

$$
A \cap B = \{ x | x \in A \land x \in B \}
$$

```javascript
const intersection = new Set(Array.from(A).filter((element) => B.has(element)));
```

3. `difference` (차집합)

$$
A - B = \{ x | x \in A \land x \notin B \}
$$

```javascript
const difference = new Set(Array.from(A).filter((element) => !B.has(element)));
```

4. `symmetric difference` (대칭차집합)

대칭차집합은 두 집합에서 공통으로 존재하는 원소를 제외하고, 각각에만 존재하는 원소들로 이루어진 집합입니다.

$$
A \triangle B = (A - B) \cup (B - A)
$$

```javascript
const symmetricDifference = new Set(
    Array.from(A)
        .filter((element) => !B.has(element))
        .concat(Array.from(B).filter((element) => !A.has(element))),
);
```

:::details Set 에 참조형 타입 저장시 주의사항

Set 으로 참조형 타입(객체, 배열 등) 을 저장할 때는 주의가 필요합니다. <br>
Set 은 참조값을 기준으로 동일성을 판단하기 때문에, 내용이 동일하더라도 서로 다른 참조를 가진 객체나 배열은 서로 다른 원소로 간주됩니다.

```javascript
let set = new Set();

let obj1 = { a: 1 };
let obj2 = { a: 1 };

set.add(obj1);
set.add(obj2);
console.log(set.size); // 2 - obj1과 obj2는 서로 다른 참조를 가지므로 별개의 원소로 간주됨
```

때문에, 좌표와 같은 참조형 타입을 Set 에 저장할 때는 문자열로 변환하여 저장하는 방법을 사용할 수 있습니다.

```javascript
let set = new Set();
let coord1 = { x: 1, y: 2 };
let coord2 = { x: 1, y: 2 };

set.add(`${coord1.x},${coord1.y}`);
set.add(`${coord2.x},${coord2.y}`);
console.log(set.size); // 1 - 동일한 좌표를 문자열로 변환하여 저장했기 때문에 하나의 원소로 간주됨
```

:::

## Map 활용하기

`Map` 자료구조는 키-값 쌍으로 데이터를 저장하며, 키를 통해 빠르게 값을 조회할 수 있습니다. 특히, 키로 객체나 배열 등 다양한 타입을 사용할 수 있어 유용합니다.

```javascript
let map = new Map();
map.set(key, value); // 키-값 쌍 추가
let value = map.get(key); // 키로 값 조회
map.has(key); // 키 존재 여부 확인
map.delete(key); // 키-값 쌍 삭제
```

`Map` 도 Iterable 이기 때문에 `for...of` 문, `[...]` 스프레드 연산이나 `Array.from()` 등을 사용하여 순회하거나 배열로 변환할 수 있습니다.

```javascript
for (let [key, value] of map) {
    console.log(key, value);
}
for (let [key, value] of map.entries()) {
    // key, value
}
let arr = [...map]; // 스프레드 연산으로 배열 변환 [[key, value], ... ]
let arr = Array.from(map); // Array.from() 으로 배열 변환 [[key, value], ... ]
```

:::tip `Object` 와 `Map` 의 차이점

- `Object` 는 문자열과 심볼만 키로 사용할 수 있지만, `Map` 은 객체, 배열 등 모든 타입을 키로 사용할 수 있습니다.
- `Map` 은 삽입된 순서를 유지하기 때문에 순회할 때 삽입된 순서대로 요소를 반환합니다. (이점을 활용하면 LRU 캐시 등을 구현할 때 유용합니다.)

:::

<br><br>

# ✍️ 문자열

## 아스키코드 ASCII 처리하기

JavaScript 에서 `==` 연산자는 타입 변환 후 값을 비교하지만, 문자를 아스키코드 값으로 치환해주지는 않습니다.

```javascript
console.log("A" == 65); // false
console.log("A" === 65); // false
```

따라서 문자의 아스키코드 값을 얻거나, 아스키코드 값을 문자로 변환할 때는 `charCodeAt()` 메서드와 `String.fromCharCode()` 메서드를 사용합니다.

```javascript
// 문자 <-> 아스키코드 변환
const ascii = "A".charCodeAt(0); // 'A'의 아스키코드 값 65

// 아스키코드 값 65를 문자로 변환
const char = String.fromCharCode(65); // 'A'
```

'A' 는 65, 'a' 는 97, '0' 은 48 의 아스키코드 값을 가집니다.

문자의 범위를 비교할때 `/\/[A-Z]/` 같은 정규표현식 대신 아스키코드 값을 비교하는 방법이 더 빠릅니다.

```javascript
const A = "A".charCodeAt(0);
const Z = "Z".charCodeAt(0);
const a = "a".charCodeAt(0);
const z = "z".charCodeAt(0);

const code = ch.charCodeAt(0);

if (code >= A && code <= Z) {
    // 대문자
} else if (code >= a && code <= z) {
    // 소문자
}
```

## 문자열 누적하기

문자열을 여러 번 이어붙여야 하는 경우, `+` 연산자를 사용하면 비효율적일 수 있습니다. 대신 배열에 문자열을 모아두었다가 `join()` 메서드를 사용하여 한 번에 합치는 것이 더 효율적입니다.

:::danger

```javascript
let str = '';
for (...) str += x;
```

:::

```javascript
let chars = [];
for (...) chars.push(x);
let str = chars.join('');
```

```javascript

```

<br><br>

# ✍️ 정렬

## sort() 메서드 사용하기

JavaScript의 `Array.prototype.sort()` 메서드는 기본적으로 문자열 기준으로 정렬을 수행하고, 원본 배열을 변경합니다. <br>

기본적으로 $O(n \log n)$ 의 시간복잡도를 가지며, 안정 정렬(stable sort)을 보장합니다. <br>
(stable sort: 동일한 값의 상대적인 순서가 유지되는 정렬 방식)

따라서 숫자 배열을 오름차순 또는 내림차순으로 정렬하려면 비교 함수를 제공해야 합니다.

```javascript
let arr1 = [2, 3, 1, 4, 5];
arr1.sort((e1, e2) => e1 - e2); // 오름차순 정렬
console.log(arr1); // [1, 2, 3, 4, 5]

let arr2 = [2, 3, 1, 4, 5];
arr2.sort((e1, e2) => e2 - e1); // 내림차순 정렬
console.log(arr2); // [5, 4, 3, 2, 1]
```

<br><br>

# ✍️ 다른 유용한 팁들

## 최댓값 출력하기

JavaScript에서 최대값을 출력할때, 실수로 `Infinity` 를 출력하는 경우가 있습니다. <br>
때문에 문제에서 요구하는 최대값으로 바꿔 출력해야 합니다.

```javascript
let ans = Infinity;

console.log(ans === Infinity ? -1 : ans); // 문제에서 요구하는 최대값으로 출력
```

## 재귀 대신 Stack 사용하기

NodeJS 는 재귀 호출의 깊이에 제한이 있기 때문에, 깊은 재귀가 필요한 문제에서는 스택을 사용하여 반복문으로 구현하는 것이 좋습니다.

```javascript
let stack = [];
stack.push(initialState);

while (stack.length > 0) {
    let state = stack.pop();
    // 상태 처리 및 다음 상태 스택에 추가
}
```

## JSON.stringify 는 느리다

`JSON.stringify()` 메서드는 객체를 문자열로 변환해서 참조형 타입의 값을 비교할때 사용할 수 있지만, $O(N)$ 의 시간복잡도를 가지기 때문에 성능에 민감한 문제에서는 사용을 피하는 것이 좋습니다. <br>
($N$ 은 객체, 배열 내부에 포함된 모든 값의 총 개수)

또한, `JSON.stringify()` 는 객체 키 속성에 의존합니다.

```javascript
JSON.stringify({ a: 1, b: 2 }) === JSON.stringify({ b: 2, a: 1 }); // false
```

`undefined`, `function` 값은 사라지며, `NaN`, `Infinity` 값은 `null` 로 변환되는 등 예상치 못한 동작을 할 수 있습니다. <br>

```javascript
JSON.stringify({ key: undefined }); // '{}'
JSON.stringify({ key: function () {} }); // '{}'
JSON.stringify({ key: NaN }); // '{"key":null}'
JSON.stringify({ key: Infinity }); // '{"key":null}'
```

### 비트마스킹시 주의사항

비트마스킹을 사용하면 집합을 효율적으로 표현하고, 비트 연산을 통해 빠르게 집합 연산을 수행할 수 있습니다.

```javascript
if (mask & (1 << i)) {
    // i번째 비트 체크
}
// i번째 비트 켜기
mask |= 1 << i;
// i번째 비트 끄기
mask &= ~(1 << i);
```

JavaScript에서는 비트 연산자(`|`, `&`, `^`, `<<`, `>>`, `~`)를 사용하면
모든 값이 내부적으로 32비트 signed integer로 변환됩니다.

실제 Number는 64비트 부동소수점이더라도, 비트 연산 시에는 강제로 32비트 정수로 변환됩니다. (0 ~ 31번 비트만 사용가능)

```javascript
// 최상위 비트는 부호 비트
1 << 30; // 정상
1 << 31; // 음수 됨
1 << 32; // 1 << 0 과 같아짐

1 << 32 === 1 << 0; // true
```

때문에 31 개 이상의 집합원소를 비트마스크로 표현하려면 `Array<boolean>`, `Set`, `BigInt 비트마스킹` 을 사용해야 합니다.

```javascript
// BigInt 비트마스킹 예시
let mask = 0n;

mask |= 1n << 40n;
```
