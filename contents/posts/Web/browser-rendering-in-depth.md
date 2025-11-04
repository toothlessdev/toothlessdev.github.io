---
title: 그림으로 한눈에 보는 브라우저 렌더링 과정
createdAt: 2024-12-13
category: Web
description: 웹 브라우저에서 주소창에 URL을 입력하고 화면에 페이지가 실제로 그려지기까지의 과정과 각 과정에서 개입되는 프로세스, 스레드를 그림으로 쉽게 알아봅시다
comment: true
head:
    - - meta
      - name: keywords
        content: 브라우저 렌더링, 렌더링 과정, 브라우저 아키텍처, 렌더링 파이프라인, 웹 페이지 로드, HTML 파싱, CSS 파싱, JavaScript 실행, 레이아웃 계산, 페인팅, 컴포지팅, VRAM, VSync, GPU, BrowserProcess, UIThread, NetworkThread, RendererProcess, MainThread, RasterThread, CompositorThread
---

## 🎨 그림으로 한눈에 보는 브라우저 렌더링과정

<img src="./img/browser-rendering-in-depth/chrome-browser-rendering.svg"/>

## ✍️ 참고자료

- [최신 브라우저의 내부 살펴보기 1 - CPU, GPU, 메모리 그리고 다중 프로세스 아키텍처](https://d2.naver.com/helloworld/2922312)
- [최신 브라우저의 내부 살펴보기 2 - 내비게이션 과정에서 일어나는 일](https://d2.naver.com/helloworld/9274593)
- [최신 브라우저의 내부 살펴보기 3 - 렌더러 프로세스의 내부 동작](https://d2.naver.com/helloworld/5237120)
- [최신 브라우저의 내부 살펴보기 4 - 컴포지터가 사용자 입력을 받았을때](https://d2.naver.com/helloworld/6204533)
- [Chrome for Developers - 최신 웹브라우저 자세히 살펴보기 (1부)](https://developer.chrome.com/blog/inside-browser-part1?hl=ko)
- [Chrome for Developers - 최신 웹브라우저 자세히 살펴보기 (2부)](https://developer.chrome.com/blog/inside-browser-part2?hl=ko)
- [Chrome for Developers - 최신 웹브라우저 자세히 살펴보기 (3부)](https://developer.chrome.com/blog/inside-browser-part3?hl=ko)
- [Chrome for Developers - 최신 웹브라우저 자세히 살펴보기 (4부)](https://developer.chrome.com/blog/inside-browser-part4?hl=ko)
