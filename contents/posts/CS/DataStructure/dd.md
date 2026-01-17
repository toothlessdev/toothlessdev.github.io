---
title: Temporary Post
createdAt: 2099-12-31
category: Etc
description: Temporary post for memo purposes.
comment: true
head:
    - - meta
      - name: keywords
        content:
---

2. CAS를 구성하는 자료구조들

CAS 자체는 “주소 규칙”에 가깝고, 실제 구현은 여러 자료구조의 조합이다.

2.1 기본형: Key-Value Store + 인덱스

가장 단순한 CAS는 아래처럼 보인다.

Key: H(content)

Value: content bytes (또는 내용이 저장된 위치 포인터)

여기서 핵심은 “키로 빠르게 찾는 인덱스”다.

메모리 캐시 레벨: Hash Map

디스크 레벨(대규모): LSM Tree / B-Tree 계열

실제 구현에서는 보통 value를 “바이트 자체”로 두기보다
(파일 오프셋, 길이, 압축 여부…) 같은 메타데이터를 저장하고,
진짜 데이터는 별도 파일(또는 object file)에 둔다.

2.2 Prefix Sharding: 해시 앞부분으로 디렉토리 쪼개기

해시를 파일명으로 바로 쓰면 한 폴더에 파일이 너무 많이 쌓여 성능이 나빠진다.
그래서 흔히 해시 prefix로 디렉토리를 쪼갠다.

ab12cd... → ab/12cd...

이건 자료구조라기보단 파일시스템 최적화 트릭이지만,
CAS 구현에서 거의 “기본 옵션”처럼 따라온다.

2.3 Chunking: 큰 파일을 잘게 쪼개서 저장하기

대형 파일을 통째로 해시하면 작은 수정에도 전체가 새 객체가 된다.
그래서 보통은:

파일을 chunk로 분할

chunk들을 각각 CAS에 저장

“chunk 목록”을 메타 객체로 저장

예를 들어 메타 객체는 이런 구조다.

{
"type": "file",
"chunks": ["hash1", "hash2", "hash3"]
}

이때 “chunk 목록을 어떻게 구조화할 것인가”에서
CAS의 진짜 꽃인 Merkle Tree / Merkle DAG가 나온다.

2.4 Merkle Tree / Merkle DAG: CAS의 ‘버전 관리 엔진’

Merkle Tree는 “부모 해시가 자식 해시들로부터 계산되는 트리”다.

Leaf: chunk의 해시

Internal: H(left_hash || right_hash) (혹은 N-way)

Root: 전체 파일/디렉토리를 대표하는 해시

이 구조가 좋은 이유:

부분 검증: 전체가 아니라 일부만 받아도 무결성 증명이 가능

부분 재사용: 변경된 chunk만 새로 저장하면 됨

스냅샷/버전: 디렉토리/커밋을 DAG로 표현할 수 있음(Git, IPFS)

즉, “CAS + Merkle DAG”는 단순 저장소를 넘어
검증 가능한 버전 그래프 저장소가 된다.

2.5 GC: Mark & Sweep (도달성 기반 삭제)

CAS는 immutable 성향이 강해서 객체가 계속 누적되기 쉽다.
그래서 “안 쓰는 객체”를 지우려면 도달성(reachability) 기반 GC가 필요하다.

대표 전략이 Mark & Sweep:

Root(예: 브랜치/태그/pin된 해시)에서 시작

참조 그래프(Merkle DAG)를 순회하며 mark

전체 객체를 스캔하며 mark되지 않은 객체를 sweep(삭제)

여기서 mark 단계 순회는 거의 그대로 그래프 탐색이다.
재귀는 콜스택이 터질 수 있으니 보통은 iterative DFS/BFS를 쓴다.

3. 해시(hash)와 해시 알고리즘: CAS에서 왜 중요한가

CAS에서 해시는 단순한 체크섬이 아니다.

해시는 “검증”이면서 동시에 “주소”다.

따라서 해시 알고리즘 선택은 CAS의 성격을 결정한다.

3.1 해시에 기대하는 성질

CAS에 해시를 쓸 때 중요한 성질:

Deterministic: 같은 입력 → 같은 출력

균등 분포: 키가 고르게 퍼져야 샤딩/인덱싱이 안정적

충돌 저항(collision resistance): 서로 다른 입력이 같은 출력이 되기 어려움

(보안 필요 시) preimage / second-preimage resistance

여기서 3)~4)는 “보안 모델이 있느냐”에 따라 중요도가 달라진다.

3.2 암호학적 해시 vs 비암호학적 해시
✅ 암호학적 해시 (Cryptographic Hash)

예: SHA-256, SHA-512, BLAKE2, BLAKE3

공격자가 의도적으로 충돌을 만들기 어렵게 설계

원격 저장/배포/공급망(artifact)처럼 “신뢰”가 걸리면 사실상 표준

CAS가 신뢰 경계(trust boundary)를 넘는다면(예: 네트워크/클라우드/서드파티)
암호학적 해시가 맞는 선택인 경우가 많다.

✅ 비암호학적 해시 (Non-cryptographic)

예: xxHash, MurmurHash 등

매우 빠름

하지만 공격자가 충돌을 유도할 수 있는 환경에선 위험할 수 있음

그래서 보통 이렇게 쓴다.

내부 캐시 키(보안 필요 없음)

CDC 경계 탐지용(rolling hash 등)

또는 “1차 필터 → 최종은 SHA-256” 같은 하이브리드

3.3 충돌(collision)은 얼마나 걱정해야 하나?

“충돌이 나면 CAS는 망하는 거 아냐?”라는 질문이 자연스럽다.

우연 충돌: 충분히 긴 해시(예: 256-bit)에서는 현실적으로 거의 무시 가능

의도적 충돌: 공격자가 일부러 충돌을 만드는 모델이면 이야기가 달라짐 → 암호학적 해시 필요

핵심은 이거다.

CAS에서 충돌 리스크는 “수학”의 문제이기도 하지만
더 자주 “시스템이 어떤 공격 모델을 갖고 있냐”의 문제다.

4. 실제 시스템으로 매핑: Git은 CAS를 어떻게 쓰나

Git은 CAS를 이해하는 최고의 예시다.

Git의 주요 객체는 대략 이런 구조를 가진다.

blob: 파일 내용(bytes)

tree: 디렉토리(파일명 → blob/tree 해시)

commit: 스냅샷(tree 해시) + parent commit 해시들

즉, Git은 객체들이 해시로 서로를 참조하는 Merkle DAG다.

commit → tree → blob

commit → parent commit (히스토리 그래프)

그리고 Git GC는 “refs(브랜치/태그)”를 루트로 해서
도달 가능한 객체만 남기는 방식으로 동작한다(개념적으로 Mark & Sweep).

5. CAS가 더 강해지는 조합: Canonicalize → Hash → CAS

여기서 실무에서 자주 맞닥뜨리는 함정이 있다.

“의미는 같은데 표현이 달라서 해시가 달라지는 문제”

예: OpenAPI/JSON/YAML 문서에서 키 순서가 바뀌면 내용의 바이트가 달라진다.
그러면 “의미는 같은데 주소가 다른” 문제가 생기고, dedup도 깨진다.

그래서 보통은:

Canonicalization(정규화): 의미가 같으면 바이트도 같게 만들기

그 결과를 hash해서 CAS에 저장

이 조합이 CAS를 “텍스트 스냅샷 저장소”가 아니라
의미 기반 스냅샷 저장소로 바꿔준다.

6. 최소 구현 모델 (의사코드)

아래는 CAS의 핵심을 가장 작게 표현한 모델이다.

// put
bytes = serialize(canonicalize(doc))
key = sha256(bytes)

if (!store.has(key)) store.write(key, bytes) // dedup
return key

// get
bytes = store.read(key)
if (sha256(bytes) !== key) throw CorruptionError
return deserialize(bytes)

chunking/Merkle로 확장하면 “bytes”가 “chunks + meta
