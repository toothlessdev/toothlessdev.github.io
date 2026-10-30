---
title: REST API 의 REST 는 무엇인가?
createdAt: 2024-10-25
category: CS
description: REST API 는 REpresentational State Transfer API 로, 웹 서비스에서 통신하는데 사용되는 소프트웨어 인터페이스입니다.
comment: true
---

# 📖 REST API ?

REST API 는 REpresentational State Transfer API 로, <br/>
웹 서비스에서 통신하는데 사용되는 소프트웨어 인터페이스입니다.

## ✏️ API 란 ?

> API 는 Application Programming Interface 로 애플리케이션을 만들고 통합하기 위한 프로토콜 입니다

정보를 제공하는 Provider 와 제공받는 Consumer 사이 규칙이라고 할 수 있습니다.

애플리케이션 / 컴퓨터 / 시스템 ... 과 상호작용하여 기능을 만들거나 수행할때,<br/>
API 를 통해 해당 시스템에 원하는 내용, 요청을 전달하고 응답을 받을 수 있습니다.

## ✏️ REST ?

**자원 Resource 를 이름으로 구분** 하여, 해당 자원의 상태를 주고 받는것을 의미합니다.

모든 자원은 고유한 식별자를 가지고 있고, 이런 자원은 URI 를 통해 식별됩니다.

> REST is a set of architectural constraints, not a protocol or a standard <br/>
> REST 는 프로토콜이나 표준이 아닌 아키텍쳐 제약조건입니다.

따라서 개발자는 REST API 를 다양한 방식으로 구현할 수 있는데,<br/>
RESTful API 를 통해 클라이언트의 요청을 받으면,<br/>
HTTP (JSON, HTML, XML, TEXT ... ) 를 통해 엔드포인트로 전송됩니다.

## ✏️ RESTful API ?

API 가 RESTful 하려면 <br/>

> 1. 요청이 HTTP 를 통해 관리되는 Client-Server 아키텍쳐이어야 합니다. <br/>
> 2. Client-Server 통신 사이에 상태는 **Stateless** 해야합니다. 즉 요청 사이에 Client 정보는 저장되지 않고, 각 요청이 별도로 연결되지 않습니다. (서버가 클라이언트의 상태를 저장하지 않는다는 의미)
>    서버는 각 요청을 독립적으로 처리할 수 있어 확장성이 향상됩니다.<br/>
> 3. Client-Server 사이에 상호작용을 줄일 수 있는 **Cacheable 한 데이터**이어야 합니다. <br/>
> 4. 시스템의 각 구성 요소 간에 **일관된 인터페이스 Uniform Interface 를 유지**해야합니다.<br/>
>    (Client-Server 통신에서 데이터 형식 등이 일관되게 유지되어야 한다는 의미)
> 5. RESTful API 의 시스템은 **계층화 Layered System** 되어, 독집적으로 구현될 수 있어야 합니다.

# 📖 REST API 의 구성요소

## ✏️ Resource (자원)

HTTP URI 식별자로 구성됩니다.

## ✏️ Verb (자원에 대한 행위)

HTTP Method 로 식별됩니다.
GET, POST, PUT, PATCH, DELETE 가 있습니다.

## ✏️ Representation (자원에 대한 행위의 내용)

HTTP Message Payload 즉 Body 로 식별됩니다.

# ❗️ 정리

REST ? : HTTP URI를 통해 자원을 명시하고, HTTP Method 를 통해 해당 자원에 대한 CRUD 를 적용하는 것

# ❓ 의문점

Q. RESTful API 는 Stateless 해야하는데, 즉 서버가 클라이언트의 상태를 저장하지 않는다. 그렇다면 토큰을 사용하지 않고 Session 을 사용한 인증은 RESTful API 가 아닌가 ?
A. Session 을 사용한 인증 방식은 Stateless 하지 않다. 따라서 Session 보다 Token 을 사용하는 방식이 확장성에 용이하다.

# 🔗 참고자료

[What Is REST API? : Rest API 가 무엇인가](https://www.redhat.com/en/topics/api/what-is-a-rest-api)

[REST API란](https://khj93.tistory.com/entry/%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC-REST-API%EB%9E%80-REST-RESTful%EC%9D%B4%EB%9E%80)
