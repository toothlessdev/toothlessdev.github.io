---
title: Async Generator 로 협력적 스케쥴링 구현하기
createdAt: 2026-07-15
category: JavaScript
description: 대규모 DFS 순회로 멈춰버린 UI 를 Async Generator, Time Slicing, Macrotask 를활용해 순회시 취소가능하고 반응성 있게 동작하도록 구현한 방법을 소개합니다
comment: true
head:
    - - meta
      - name: keywords
        content: Async Generator, Time Slicing, Macrotask, JavaScript, 스케쥴링, 협력적 스케쥴링, JavaScript 비동기 프로그래밍, JavaScript 동기 프로그래밍, DFS, 트리순회, 성능최적화, UX, UI멈춤, React, TypeScript
---

## 🎬 들어가며

트리 구조의 데이터를 순회하면서, 각 노으데 특정 작업을 수행하는 코드를 만들고 있었습니다.

처음ㄷ는 단순한 재귀 DFS 로 구현했습니다.

작은 트리에서는 아무런 문제가 없었습니다. <br/>
노드가 몇십 개, 몇백 개 일 때는 실행하자마자 결과가 나왔고, 코드도 단순했습니다.

그러던중 "DFS 순회가 느려봐야 얼마나 느리겠어?" 라고 생각하며 노드가 수만 개 들어있는 트리를 실행해 봤습니다.

그리고 몇초 뒤, 화면이 그대로 멈췄습니다.

버튼을 눌러도 반응이 없고, 로딩 상태도 갱신되지 않았습니다. <br/>
작업을 중간에 중단하거나 취소할 수도 없었습니다.

사용자 입장에서는 지금 이 작업이 진행 중인지, 멈춘 것인지조차 알 수 없는 상태였습니다.

이번 글에서는 이 문제를 Async Generator와 협력적 스케줄링(Cooperative Scheduling)을 이용해 해결한 과정을 정리합니다.

## 😵‍💫 원인 : 전체 순회가 멈출수 없는 긴 작업이 된다...!

다음과 같은 트리 자료구조가 있다고 해보겠습니다.

```ts
interface TreeNode {
    id: string;
    children?: TreeNode[];
    // ...
}
```

각 노드를 방문하면서 특정 작업을 수행하기 위해서는 재귀 DFS 를 사용할 수 있습니다.

```ts
function traverse(node: TreeNode): void {
    processNode(node);

    for (const child of node.children ?? []) {
        traverse(child);
    }
}

button.addEventListener("click", () => {
    traverse(veryLargeTree);
});
```

코드는 단순하지만 중요한 문제가 하나 있습니다.

`traverse()` 가 호출된 뒤, 전체 트리 순회가 끝날 때 까지, JavaScript 런타임에 실행권을 반환하지 않는다는 점입니다.

JavaScript 의 메인 스레드는 코드 실행 뿐만 아니라, 사용자 입력처리와 화면 렌더링도 함께 담당합니다. <br/>
따라서 트리 순회가 하나의 긴 동기 작업으로 실행되는 동안에는 클릭이나 화면 갱신과 같은 다른 작업이 끼어들 수 없습니다.

`traverse(veryLargeTree)` 가 5초 동안 실행된다면, 그 5초동안 화면은 사실상 멈춥니다.

재귀 호출 자체가 반드시 문제인 것은 아닙니다. <br/>
재귀를 Stack 이나 반복문으로 바꿔도, 전체 작업을 하나의 동기 실행 흐름에서 처리한다면 화면은 여전히 멈춥니다.

문제의 핵심은 재귀가 아니라, **"많은 작업을 한 번의 동기 task 안에서 끝내려 한다는 것이었습니다"**

## 🤔 그냥 순회를 더 빠르게 만들면 되지 않을까?

가장 먼저 떠오르는 해결책은 순회 자체를 최적화하는 것입니다.

예를 들어 다음과 같은 방법을 적용할 수 있습니다.

- 동적계획법(Dynamic Programming) 으로 **반복해서 계산하는 값 캐싱**
- 불필요한 객체 생성 제거
- 노드당 실행되는 로직 단순화
- 중복 순회 제용
- 재귀 대신 명시적인 스택 사용

```ts
function traverse(node: TreeNode) {
    const stack = new Stack();

    while (!stack.isEmpty()) {
        const node = stack.pop();
        processNode(node);

        for (let i = (node.children?.length ?? 0) - 1; i >= 0; i--) {
            stack.push(node.children![i]);
        }
    }
}
```

이런 최적화는 분명히 필요합니다.

하지만 문제를 완전히 해결하지는 못합니다.<br/>
재귀를 반복문으로 바꿔 호출 스택 문제를 피하더라도, 전체 순회가 하나의 동기 작업으로 실행되는 것은 동일하기 때문입니다.

처리 속도를 2배로 개선해 10초짜리 작업을 5초로 줄이더라도, 사용자는 여전히 5초동안 멈춘 화면을 보게 됩니다. <br/>
데이터 크기가 계속 커진다면 언젠가는 다시 같은 문제가 발생합니다.

따라서 문제를 다르게 정의해야 했습니다.

> 더 빠르게 실행하는게 아니라, 실행 중에도 다른 작업이 끼어들 수 있어야 한다

작업을 한 번에 끝내는 대신, **시간 단위로 나누고,**
중간 중간 **메인 스레드에 실행권을 돌려주는 구조**가 필요했습니다.

## ♻️ Generator - 멈췄다가 다시 시작할 수 있는 함수

일반 함수는 호출하면 `return` 문을 만나 반환할 때 까지 실행됩니다.

반면 generator 는 실행 도중 `yield` 에서 멈췄다가, 호출자가 `next()` 를 호출했을 때 다시 이어서 실행할 수 있습니다.

```ts
function* count() {
    yield 1;
    yield 2;
    yield 3;
}

const iterator = count();

console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: 3, done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```

`yield` 는 값을 반환하는 지점인 동시에, <br/>
함수의 실행을 잠시 멈추고 호출자에게 제어권을 돌려주는 시점입니다.

이를 이용하면 DFS 순회도 **한번에 끝내지 않고, 노드 단위로 진행**할 수 있습니다.

```ts
function* traverse(node: TreeNode): Generator<TreeNode> {
    processNode(node);
    yield node;

    for (const child of node.children ?? []) {
        yield* traverse(child);
    }
}
```

이제 호출자는 순회 속도를 직접 제어할 수 있습니다.

```ts
const iterator = traverse(veryLargeTree);

iterator.next();
iterator.next();
iterator.next();
```

다만, Generator 를 사용했다는 사실만으로 화면 멈춤이 해결되는 것은 아닙니다.

```ts
for (const node of traverse(root)) {
    processNode(node);
}
```

위 코드도 결국 전체 순회를 하나의 동기 작업으로 실행합니다.

Generator 는 단지 중단할 수 있는 경계를 제공합니다.

실제로 메인 스레드에 제어권을 양보하려면, 그 경계에서 비동기적으로 기다리는 과정이 필요합니다.

## ♻️ Async Generator 로 작업 나누기

먼저 일정한 수의 노드를 처리할 때 마다 실행권을 양보해봤습니다.

```ts
interface Progress {
    processedNodes: number;
}

let processedNodes = 0;

async function* traverseByNodeCount(node: TreeNode): AsyncGenerator<Progress> {
    processNode(node);
    processedNodes++;

    if (processedNodes % 1_000 === 0) {
        yield { processedNodes };
        await yieldToMainThread();
    }

    for (const child of node.children ?? []) {
        yield* traverseByNodeCount(child);
    }
}
```

호출자는 for await...of를 사용해 순회 진행 상황을 받을 수 있습니다

```ts
for await (const progress of traverseByNodeCount(root)) {
    updateProgress(progress.processedNodes);
}
```

이제 1,000개의 노드를 처리할 때마다 작업이 잠시 중단되고, UI가 갱신될 기회가 생깁니다 <br/>
하지만 노드 개수를 기준으로 자르는 방식에는 문제가 있었습니다.

## 🤯 모든 노드의 처리 비용은 같지 않다

노드 하나를 처리하는 비용이 항상 동일하다면, 1,000개 단위로 작업을 나눠도 괜찮습니다

하지만 실제 작업은 그렇지 않은 경우가 많습니다 <br/>
어떤 노드는 단순한 값 비교만 수행하지만, 어떤 노드는 여러 속성을 계산하거나 추가 데이터를 조회할 수 있습니다.

그 결과 같은 1,000개라도 처리 시간은 크게 달라집니다.

- 단순 노드 1,000개: 3ms
- 복잡한 노드가 포함된 1,000개: 40ms
- 매우 무거운 노드가 포함된 1,000개: 100ms 이상

노드 개수만 기준으로 삼으면 두 가지 문제가 발생합니다

1. 처리 비용이 작은 구간에서는 필요 이상으로 자주 양보하게 됩니다. 양보 자체에도 비용이 있으므로 전체 실행 시간이 불필요하게 늘어납니다.
2. 처리 비용이 큰 구간에서는 너무 늦게 양보하게 됩니다. 작업을 나눴음에도 화면이 여전히 버벅일 수 있습니다.

즉, 노드 개수는 작업량을 정확히 나타내는 기준이 아니었습니다

## ⏱️ 프레임 예산을 기준으로 작업 나누기

브라우저가 초당 60개의 프레임을 표시하려면, 한 프레임을 처리하는 데 사용할 수 있는 시간은 대략 16.7ms입니다

노드를 1개씩 처리하는 대신, **16ms 이내로 처리할 수 있는 만큼만 처리하고,**
남은 시간은 메인 스레드에 양보하면 어떨까요?

```ts
const TIME_SLICE_MS = 8;

interface TraverseProgress {
    processedNodes: number;
    done: boolean;
}

let processedNodes = 0;
let sliceStartedAt = performance.now();

async function* traverseByTimeSlice(node: TreeNode): AsyncGenerator<TraverseProgress> {
    processNode(node);
    processedNodes++;

    const elapsed = performance.now() - sliceStartedAt;

    if (elapsed >= TIME_SLICE_MS) {
        yield { processedNodes, done: false };

        await yieldToMainThread();
        sliceStartedAt = performance.now();
    }

    for (const child of node.children ?? []) {
        yield* traverseByTimeSlice(child);
    }
}
```

이렇게 하면, 호출하는 쪽에서는 진행 상황을 UI에 반영할 수 있습니다

```ts
for await (const progress of traverseByTimeSlice(root)) {
    progressElement.textContent = `${progress.processedNodes}개 처리`;

    if (progress.done) {
        statusElement.textContent = "완료";
    }
}
```

이 방식의 핵심은 한 번에 처리하는 노드의 개수가 매번 달라도 괜찮다는 점입니다

노드 처리 비용이 작으면 한 슬라이스에서 많은 노드를 처리하고, <br/>
노드 처리 비용이 크면 적은 노드를 처리하고 일찍 양보합니다

운영체제의 선점형 스케줄러처럼 외부에서 실행 중인 작업을 강제로 중단하는 것이 아니라, 작업 코드 스스로 적절한 시점에 실행권을 양보하게 됩니다. <br/>
이게 바로 **협력적 스케줄링**입니다

## ⚠️ Promise.resolve() 로 양보하면 안될까?

양보하는 방식도 여러가지가 있습니다

```ts
async function yieldToMainThread() {
    await Promise.resolve();
}
```

콜 스택이 비워지므로 얼핏 보면 실행권을 양보한 것처럼 보이지만, <br/>
화면이 실제로 렌더링되거나 사용자 입력이 처리될 기회를 충분히 제공하지 못할 수 있습니다

`Promise.resolve()` 이후의 코드는 microtask로 등록되게 되는데, <br/>
브라우저는 현재 task가 끝난 후 microtask queue를 먼저 비운 다음 렌더링 기회를 판단합니다

새로운 microtask를 계속 이어서 등록하면, 브라우저가 paint나 입력 이벤트를 처리하기 전에 작업이 다시 시작될 수 있습니다

```ts
async function run() {
    for (let i = 0; i < 100_000; i++) {
        doWork();

        await Promise.resolve();
    }
}
```

코드가 비동기로 보이더라도, 사용자 입장에서는 화면이 계속 멈춰 있을 수 있습니다 <br/>
ㄷ때문에, 실제로 다음 task로 실행을 넘겨야 이벤트 루프가 렌더링과 입력 처리를 수행할 기회를 얻을 수 있습니다

가장 단순한 방법은 setTimeout()을 사용하면 됩니다

```ts
function yieldToMainThread(): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, 0);
    });
}
```

Promise가 즉시 resolve되지 않고, 타이머 task가 실행된 뒤 resolve 되어, <br/>
이벤트 루프가 렌더링과 입력 처리를 수행할 기회를 얻을 수 있습니다

## 🛑 취소 가능한 순회 만들기

브라우저 표준인 `AbortSignal` 을 사용하면, 작업 중간에 실행권을 반환할 수 있게 되면 취소 기능도 자연스럽게 추가할 수 있습니다

```ts
interface TraverseOptions {
    signal?: AbortSignal;
    timeSliceMs?: number;
}

let processedNodes = 0;
let sliceStartedAt = performance.now();

async function* traverseCooperatively(
    node: TreeNode,
    options: TraverseOptions = {},
): AsyncGenerator<TraverseProgress> {
    const { signal, timeSliceMs = 16 } = options;
    if (signal?.aborted) throw new TraversalAbortedError();

    processNode(node);
    processedNodes++;

    if (performance.now() - sliceStartedAt >= timeSliceMs) {
        yield { processedNodes, done: false };

        await yieldToMainThread();

        if (signal?.aborted) throw new TraversalAbortedError();
        sliceStartedAt = performance.now();
    }

    for (const child of node.children ?? []) {
        yield* traverseCooperatively(child, options);
    }
}
```

동기 DFS에서는 전체 순회가 끝나기 전까지 클릭 이벤트가 처리되지 않으므로 취소 버튼 자체가 동작하지 않습니다

하지만 time slice 사이에 메인 스레드로 실행권을 반환하면, <br/>
브라우저가 클릭 이벤트를 처리하고 AbortSignal의 상태를 변경할 수 있습니다

## 😊 하나의 양보 지점으로 해결되는 세 가지 문제

협력적 스케쥴링의 양보 지점을 통해

1. 반응성 : 메인 스레드에 실행권을 반환해 렌더링과 사용자 입력이 처리될 수 있게 합니다
2. 진행률 : 현재까지 처리한 노드 수를 호출자에게 전달할 수 있습니다
3. 취소 : 양보 이후 다음 슬라이스를 시작하기 전에 취소 신호를 확인할 수 있습니다

반응성, 진행률, 취소는 서로 다른 기능처럼 보이지만, 실제로는 모두 같은 조건에 의존합니다.

> 긴 작업 안에 호출자가 다시 제어권을 얻을 수 있는 경계가 존재해야 한다

Async Generator는 이 경계를 코드 구조 안에 자연스럽게 표현할 수 있게 해줍니다

## 🤔 언제 사용하면 좋을까?

이 방식은 정적 분석, 린트 뿐만 아니라, 메인 스레드에서 많은 데이터를 순차적으로 처리해야 하는 작업에 적용할 수 있습니다.

예를 들어,

- 대규모 DOM 또는 가상 트리 분석
- 파일 목록 검사
- 검색 인덱스 생성
- 많은 데이터를 단계적으로 변환하는 작업
- 복잡한 문서 구조 탐색
- 클라이언트에서 수행하는 배치 검증
- 대량 데이터의 점진적 렌더링

하지만, 모든 작업에 Async Generator를 적용할 필요는 없습니다 <br/>
작업이 충분히 짧거나, Web Worker로 완전히 분리할 수 있거나, 서버에서 처리하는 편이 적절하다면 다른 방법이 더 단순할 수 있습니다

또한 협력적 스케줄링은 병렬 처리가 아니고 <br/>
전체 계산량을 줄여주지도 않습니다. 오히려 중간 양보 비용 때문에 총 실행 시간은 조금 늘어날 수도 있습니다

얻는 것은 절대적인 실행 속도가 아니라 실행 중의 **반응성**입니다

## 🧑‍🎓 배운점

이번 문제를 해결하며 배운점은 다음과 같습니다

1. 절대적인 속도 최적화만으로는 큰 입력에서 발생하는 blocking 문제를 완전히 없앨 수 없습니다. 작업량이 계속 증가한다면 언젠가는 다시 긴 동기 작업이 됩니다.
2. 작업을 나누는 기준으로 처리 개수보다 실제 경과 시간이 더 안정적입니다. 각 항목의 처리 비용이 다르더라도 일정한 시간 간격으로 실행권을 반환할 수 있습니다
3. Generator 자체가 메인 스레드를 양보하는 것은 아닙니다. Generator는 중단 가능한 경계를 제공하고, 실제 양보는 setTimeout()이나 scheduler.yield() 같은 스케줄링 수단이 담당합니다
4. 협력적 스케줄링은 작업을 강제로 중단하지 못합니다. 개별 작업 단위가 너무 크다면 그 단위 자체도 더 작게 나눠야 합니다
5. 하나의 양보 지점은 반응성뿐 아니라 취소와 진행률 표시를 함께 가능하게 합니다
