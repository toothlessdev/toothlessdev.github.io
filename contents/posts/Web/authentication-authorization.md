---
title: Authentication, Authorization 인증과 인가
createdAt: 2024-05-12
category: Web
description: 웹 애플리케이션에서 인증(Authentication)과 인가(Authorization)의 개념과 차이점에 대해 알아봅니다. Session, JWT 등 다양한 인증방식과 CSRF 문제에 대해 알아봅니다
comment: true
---

# 인증과 인가가 필요한 이유

## REST API 의 Stateless 한 특성

우리는 웹 페이지를 개발할 때, REST API 를 이용해 서버와 통신을 진행합니다. <br />
이때 REST API 는 HTTP 프로토콜 위에서 동작하게 되는데, HTTP 는 Stateless 한 특성을 가지고 있습니다.

> `Stateless` : Stateless (무상태) 는 서버가 클라이언트의 이전 상태를 보존하지 않는다는 의미입니다

따라서 <br />
각각의 요청은 독립적으로 처리되고, 한번 요청에 대한 응답이 전송되면, 이전 상태를 기억하지 못합니다.

## 인증과 인가

이러한 HTTP 의 Stateless 한 특성 때문에, 각 요청은 사용자가 로그인했는지 여부를 서버에게 알려주어야 합니다. <br />
그렇지 않으면... 페이지를 이동하거나, 인증이 필요한 API 에 접근을 할 때 마다 로그인을 진행해야 합니다

> `인증 (Authentication)` : 인증은 사용자의 신원을 검증하는 절차입니다. 특정 사이트에 권한이 주어진 사용자임을 아이디와 비밀번호를 통해 인증을 받음
> `인가 (Authorization)` : 인증을 받은 사용자가 사이트의 서비스나 자원을 사용, 접근, 요청 등을 보낼 수 있는 권한이 있는지 확인하는 절차입니다.

따라서 사용자가 권한이 있는지 확인하거나, 인증된 사용자인지 확인하기 위해서는 Session 또는 Token 방식을 사용해서 인가를 구현해야합니다

이를통해 인증이 필요한 API 에 접근을 할 때 마다 로그인을 반복하지 않고 인증 상태를 유지할 수 있습니다

# 1️⃣ Session 방식의 인증인가

## Session?

SessionID 를 사용해서 어떤 사용자가 서버에 로그인되어 있음이 지속되는 상태를 말합니다 <br />
Session 은 서버에서 생성되며, 보통 클라이언트에 Cookie 를 통해 저장됩니다

## 🍪 Cookie?

서버가 사용자의 웹 브라우저에 전송하는 데이터로, 동일한 서버에 재요청시에 요청시 쿠키를 자동으로 함께 전송합니다.
서버가 클라이언트, 웹브라우저에 정보를 저장할 때 사용합니다.

참고 - HTTP Cookie (https://developer.mozilla.org/ko/docs/Web/HTTP/Cookies)

## Session 방식의 인증인가

![로그인(인증)](./img/authentication-authorization/session-1.png)

> 사용자가 로그인 (인증) 을 요청하면...
> (1) Client 가 ID , PW 를 이용해 로그인 요청을 보냅니다
> (2) 서버는 DB 에서 ID , PW 를 비교해 사용자 검증을 진행합니다
> (3) 올바른 사용자가 인증을 요청한 경우, Session 을 생성해 저장합니다
> (4) 마지막으로 서버는 Cookie 에 SessionID 를 담아 클라이언트에 전달합니다 (HTTP Only Cookie)

![인증된 사용자 요청](./img/authentication-authorization/session-2.png)

> 이후 인증이 필요한 API 를 요청하면...
> (1) 해당요청에는 자동으로 Cookie 가 함께 서버로 전송됍니다
> (2) 서버는 DB 에서 Session 을 검색해서 유효한 세션인지 확인합니다 (만료되거나 조작된 세션인지 확인!)
> (3) 유효한 세션인 경우 사용자 정보를 가져오고
> (4) 인증이 필요한 API 에 필요한 데이터를 가져와
> (5) 응답을 클라이언트에 전송합니다

![로그아웃](./img/authentication-authorization/session-3.png)

> 사용자가 로그아웃을 요청하면...
> (1) 로그아웃 엔드포인트로 API 요청을 날립니다. 이때 쿠키에 세션정보가 함께 전송됩니다.
> (2) 서버는 데이터베이스에서 세션정보를 검색하고 무효화합니다
> (3) 서버는 클라이언트에 리다이렉션 또는 데이터를 응답합니다.

## Session 방식의 장단점

> `장점`
> 세션은 Stateful, 모든 사용자의 정보를 기억하기 때문에, 기억하는 사용자의 상태를 언제든지 변경 할 수 있습니다.
> 예를들어, 모바일에서 재로그인시 PC 의 세션을 무효화 시켜 로그아웃 시킬 수 있습니다
> 서버에 데이터가 저장되기 때문에, 클라이언트에 사용자 정보가 노출 될 위험이 없습니다
>
> `단점`
> 세션은 서버에서 관리되므로, 동시에 많은 사용자가 접속하면 메모리가 부족 할 수 있습니다
> 서버의 복잡한 구성과 환경에서 어떤 상태를 기억하고 있어야 하므로, 확장이 어려울 수 있습니다. (Horizontal Scaling 이 어려움)
> 주로 인메모리에 저장되는 세션은 서버가 예기치 못한 상황에서 종료가 되면 세션정보가 날아갈 수 있습니다.
> SessionID 가 유출/탈취 되는 경우, 해당 세션으로 사용자의 정보에 접근 할 수 있습니다

이런 Session 방식의 단점을 극복하기 위해 Token 방식의 인증인가가 나오게 되었습니다

# 2️⃣ Token 방식의 인증인가

## JWT (JSON Web Token)

JWT 는 JSON 객체를 사용해 정보를 안전하게 전달하기 위한 개방형 표준 (RFC 7519) 입니다. <br />
JWT 는 주로 인증과 정보 교환에 사용됩니다.

![JWT 구조](./img/authentication-authorization/jwt.png)

JWT 는 Header, Payload, Signature 세 부분으로 구성됍니다.

> `Header`
> 헤더에는 해싱에 사용될 알고리즘과 토큰의 타입이 들어갑니다
>
> `Payload`
> 페이로드에는 토큰에 넣을 데이터가 들어갑니다
> 발급자에 대한 메타데이터, 토큰의 유효기간, 사용자 정보 등이 들어갑니다
> `Signature`
> Header, Payload, 비밀키를 이용해 서명값이 발급됩니다
> 서버는 발급시에 사용했던 비밀키를 이용해 계산된 서명값이 일치하는지 확인합니다
> 이를통해 토큰이 조작되었는지 확인 할 수 있습니다

## JWT 방식의 인증인가

![로그인(인증)](./img/authentication-authorization/jwt-1.png)

> 사용자가 로그인 (인증) 을 요청하면...
> (1) Client 가 ID , PW 를 이용해 로그인 요청을 보냅니다
> (2) 서버는 DB 에서 ID , PW 를 비교해 사용자 검증을 진행합니다
> (3) 올바른 사용자가 인증을 요청한 경우, 비밀키를 이용해 JWT 토큰을 발급합니다
> (4) 마지막으로 서버는 JWT 토큰을 응답으로 전송하고
> (5) 클라이언트는 LocalStorage, SessionStorage, ReduxPersist 등 클라이언트측 Storage 에 저장합니다

![인증된 사용자 요청](./img/authentication-authorization/jwt-2.png)

> 이후 인증이 필요한 API 를 요청하면...
> (1) 클라이언트에서 요청시, HTTP Header 의 Authorization 필드에 JWT 토큰을 삽입해 요청합니다.
> (2) 서버는 해당 비밀키를 이용해 Signature 서명값이 올바른지 확인합니다
> (3) JWT 를 디코딩하여 payload 의 값을 이용해 사용자를 식별하고, 해당 사용자를 기반으로 API 에 필요한 데이터를 DB로부터 불러옵니다
> (4) 응답을 클라이언트에 전송합니다

## JWT 방식의 장단점

> `장점`
> Signature 서명 값을 이용해 검증하고, 디코딩한 값으로 사용자 정보를 알 수 있어, 데이터베이스가 필요하지 않기 때문에 Horizontal Scaling 이 쉽다
>
> `단점`
> JWT 토큰이 클라이언트에 저장되고, 저장된 정보는 쉽게 디코딩될 수 있기 때문에 정보 유출의 위험이 있습니다
> 토큰이 탈취당하면, 토큰을 이용해 인증이 필요한 요청을 보낼 수 있습니다

## Access, Refresh Token 를 이용한 인증인가

JWT 토큰을 이용하면 토큰 탈취가 발생하는경우, 세션 방식처럼 서버측에서 무효화 할 수 없기 때문에, <br />
Access Token, Refresh Token 을 이용하여 인증 인가를 구현합니다.

두 토큰 모두 JWT 기반의 토큰이지만, Refresh Token 은 Access Token 을 재발급 받는 용도로 사용합니다. <br />
자주 사용되는 Access Token 은 유효기간을 짧게 하여 Token 이 탈취돼도 탈취자가 오래 사용하지 못하도록 방지할 수 있습니다.

![Access, Refresh Token](./img/authentication-authorization/jwt-access-refresh.png)

# CSRF (Cross-Site Request Forgery)

사용자의 인증정보를 탈취해 공격을 하는 CSRF 에 대해 살펴보겠습니다

## CSRF 공격?

CSRF (Cross Site Request Forgery) 는 한국어로 번역하면 사이트간 요청위조 입니다. <br />
다른 사용자의 권한을 도용해, 조작된 요청을 보내는 방식으로 공격을 시도하는데, 어떻게 다른 사용자의 권한을 도용할 수 있을까요?

CSRF 공격이 진행되려면 다음 두 조건을 만족해야 합니다.

> 사용자가 `로그인한 상태`로, 원본 사이트와 유사한 `피싱 사이트에 접속`

이해를 돕기위해 사용자가 A 에게 송금하는 상황을 가정해보겠습니다.

![CSRF 공격](./img/authentication-authorization/csrf.png)

사용자는 로그인 되어있는 상태이기 때문에, Session ID, Token 을 탈취해 조작된 요청을 보낼 수 있습니다.

## CSRF 공격 방어 방법

### 1. Referer 검증

Referer 검증은 Request 를 보내는 Referer 가 일치하는지 검사하는 방법입니다. <br />
Referer 헤더는 HTTP 요청의 일부로 전송되는 헤더로, 요청을 보내는 웹 페이지의 출처를 가지고 있습니다.

![Referer 검증](./img/authentication-authorization/csrf-defend.png)

Referer 헤더를 분석하여, 요청이 어디서 왔는지 확인하고, 다른 도메인에서의 요청을 제한하거나 보안을 강화할 수 있습니다.

### 2. CSRF 토큰

사용자가 로그인할 때 마다, CSRF 토큰을 생성해 세션에 저장하고, 요청시에 Form, URL Parameter, HTTP Header 와 함께 전송합니다.

```jsx
<form>
    <input type="text" placeholder="송금할 계좌번호" />
    <input type="hidden" name="_csrf" value={CSRF_TOKEN} />
</form>
```

서버측에서는 사용자의 요청을 받을 때 마다, CSRF 토큰을 비교해 일치하는지 검사합니다.

CSRF 공격자는 사용자의 세션정보를 알지 못하기 때문에, CSRF 토큰을 함께 포함시키지 않으면, 올바른 요청을 보낼 수 없습니다.

# 😊 여담

브라우저 쿠키는 왜 쿠키일까...? - 헨젤과 그레텔에서 쿠키를 이용해 경로를 기억한 행위에서 유래되었다고 합니다 ㅋㅋ <br />
https://cookiecontroller.com/internet-cookies/browser-cookies/

# 참고자료

- https://www.youtube.com/watch?v=UBUNrFtufWo&ab_channel=Fireship
- https://www.youtube.com/watch?v=1QiOXWEbqYQ&t=620s&ab_channel=%EC%96%84%ED%8C%8D%ED%95%9C%EC%BD%94%EB%94%A9%EC%82%AC%EC%A0%84
- https://www.loginradius.com/blog/engineering/guest-post/jwt-vs-sessions/
- https://docs.nestjs.com/security/authentication
- https://velog.io/@tosspayments/Basic-%EC%9D%B8%EC%A6%9D%EA%B3%BC-Bearer-%EC%9D%B8%EC%A6%9D%EC%9D%98-%EB%AA%A8%EB%93%A0-%EA%B2%83
- https://datatracker.ietf.org/doc/html/rfc7234#section-3.2
- https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Authorization
- https://nordvpn.com/ko/blog/xss-attack/
- https://nordvpn.com/ko/blog/csrf/
