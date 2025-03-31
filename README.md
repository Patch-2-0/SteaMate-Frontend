# SteaMate : 친구처럼 게임을 추천해주는 AI 웹 페이지

<div align="center">

<img src="https://img.shields.io/badge/python-%233776AB.svg?&style=for-the-badge&logo=python&logoColor=white" />
<img src="https://img.shields.io/badge/django-%23092E20.svg?&style=for-the-badge&logo=django&logoColor=white" />
<img src="https://img.shields.io/badge/openai-%23412991.svg?&style=for-the-badge&logo=openai&logoColor=white" />
<img src="https://img.shields.io/badge/docker-%232496ED.svg?&style=for-the-badge&logo=docker&logoColor=white" />
<img src="https://img.shields.io/badge/nginx-%23269539.svg?&style=for-the-badge&logo=nginx&logoColor=white" />
<img src="https://img.shields.io/badge/celery-%2337814A.svg?&style=for-the-badge&logo=celery&logoColor=white" /><br>
<img src="https://img.shields.io/badge/postgresql-%23336791.svg?&style=for-the-badge&logo=postgresql&logoColor=white" />
<img src="https://img.shields.io/badge/redis-%23DC382D.svg?&style=for-the-badge&logo=redis&logoColor=white" />
<img src="https://img.shields.io/badge/amazon%20aws-%23232F3E.svg?&style=for-the-badge&logo=amazon%20aws&logoColor=white" />
<img src="https://img.shields.io/badge/vercel-%23000000.svg?&style=for-the-badge&logo=vercel&logoColor=white" />
<img src="https://img.shields.io/badge/github%20actions-%232088FF.svg?&style=for-the-badge&logo=github%20actions&logoColor=white" />
<img src="https://img.shields.io/badge/react-%2361DAFB.svg?&style=for-the-badge&logo=react&logoColor=black" />


<br>

![Image](https://github.com/user-attachments/assets/0e85527b-666c-4201-aff4-777f02b50aa0)

| 개발 기간 | 팀명 |SA 문서 | Frontend 레포지토리 |
| :----------:| :-----: | :-------: | ------------------- |
| 2025년 02월 27일 ~ 2025년 03월 31일 | Patch 2.0 | [SA 문서 바로가기](https://www.notion.so/teamsparta/SA-V-3-0-0-1ad2dc3ef514808e9d6ed92aa3f33c77?pvs=4) | [SteaMate-Backend](https://github.com/hzi09/SteaMate-Backend) | 

</div>

## 목차
- [1. 프로젝트 개요](#1-프로젝트-개요)
- [2. 서비스 설명](#2-서비스-설명)
- [3. 주요 기능](#3-주요-기능)
- [4. 기여 가이드라인](#4-기여-가이드-라인)

## 1. 프로젝트 개요
### 아이디어 및 배경
> Steam에는 약 22만 개의 게임이 있습니다. 하지만 그중에서 나에게 딱 맞는 게임을 찾는 건 쉽지 않죠. 수많은 게임을 스크롤하며 고민해본 적 있으신가요? 이런 고민을 해봤다면 SteaMate를 사용해보세요!

### SteaMate 소개
- **SteaMate**는 사용자의 선호 장르, 플레이 스타일, 과거 플레이 데이터를 분석하고, 게임 리뷰 및 메타 데이터를 활용하여 개인 맞춤형 게임 큐레이션을 제공합니다. 이를 통해 사용자가 더 쉽고 빠르게 새로운 게임을 발견할 수 있도록 돕습니다.
- 또한, 추천 이유와 함께 비슷한 유저들의 플레이 경향, 게임 리뷰, 메타 데이터를 제공하여 추천 이유를 확인할 수 있습니다.
- 결과적으로, Steamate는 개인화된 추천을 통해 사용자가 새로운 게임을 더 많이 발견하고, 더욱 재미있게 즐길 수 있도록 도와줍니다. 🎮

### 기존 추천 시스템과의 차별점
- **대화를 통한 추천**
    - 기존의 시스템 : 사용자가 검색을 통해 찾거나, 리스트 중에서 스스로 선택해야 하는 일방향 추천 방식
    - **Steamate** :“구스구스덕 같은 게임 없나요?”, “밤에 하기 좋은 감성적인 게임 추천해주세요” 같은 모호하거나 주관적인 질문에도 대화를 통해 이해하고 상황에 맞는 맞춤형 추천을 제공
- **데이터 활용** 
    - 기존의 시스템 : 단순히 게임의 장르나 플레이 스타일에 맞는 게임을 추천
    - **SteaMate** : 게임에 대한 장르, 태그, 댓글 등의 정보를 통해 추천하여 추천 성능을 높임
- **단순 추천을 넘어선 분석**
    - 기존의 시스템 : 기존의 추천 시스템은 단순히 게임을 추천해줌
    - **SteaMate** : 각 게임에 대한 소개와 왜 사용자가 이 게임을 좋아할지에 대한 분석을 포함

### 팀원 구성

|  항목  |  이현지 | 이수관  |  박종관 | 노호성  |
| :----: | :-----: | :-----: | :-----: | :-----: |
| GitHub | <img src="https://github.com/user-attachments/assets/9e4487ed-8030-4125-a52b-7d274ec7a417" height="150" width="150"><br><a href="https://github.com/hzi09">@hzi09 | <img src="https://github.com/user-attachments/assets/4e18241e-2924-447d-8745-7a05556c0fee" height="150" width="150"><br><a href="https://github.com/sugwanlee">@Orange_00</a> | <img src="https://github.com/user-attachments/assets/d7475b1d-8720-4813-a0bc-57f55e283bbc" height="150" width="150"><br><a href="https://github.com/jonggwanpark">@jonggwanpark</a> | <img src="https://github.com/user-attachments/assets/d5c4499e-4cdf-438f-81ca-f8ebdb3cf4ee" height="150" width="150"><br><a href="https://github.com/bubpen">@bubpen</a>|
| Email | <a href="hzi284914@gmail.com">hzi284914@gmail.com</a> | <a href="austinlee.devv@gmail.com">austinlee.devv@gmail.com</a> | <a href="ds3hfj2@gmail.com">ds3hfj2@gmail.com</a> | <a href="shghtjd711@gmail.com">shghtjd711@gmail.com</a> |
| 역할  | ML, BE Follow, <br> FE Lead(AI기반) | LLM, BE Follow, <br> FE Follow(AI기반) | 서버 구축 Lead, <br> CI/CD, 배포 | BE Lead, DB 관리 <br> 서버 구축 Follow |



<br>


## 2. 서비스 설명
### 서비스 아키텍처

![Image](https://github.com/user-attachments/assets/158852d2-ffb8-4c90-b635-d6645445047b)

<details>
<summary>기술적 의사결정</summary>
<div markdown="1">

### 🔧 Backend - Django REST Framework (DRF)

- Django 기반 프로젝트인 만큼 DRF를 사용하는 것이 자연스럽고 효율적이라 판단
- 인증, 직렬화, 필터일 등 API 구현에 필요한 기능들을 내장하고 있어 개발 속도와 유지보수 측면에서 유리
- 팀 전체가 Django에 익숙하고, DRF에 대한 학습 부담이 적어 DRF로 결정

<details>
<summary>후보군</summary>

- **FastAPI**
    - 비동기 처리에 강점이 있으며 성능이 우수함.
    - 빠른 응답 속도, Swagger UI 등 자동 문서화 기능 제공
    - 하지만 Django와의 통합성은 떨어짐
- **Django REST Framework (DRF)**
    - Django와 완벽하게 통합됨
    - 인증, 권한, 직렬화 등 다양한 기능을 기본 제공
    - 프로젝트 구성원 대부분이 Django에 익숙함
    - 대규모 커뮤니티와 풍부한 자료 존재

</details>

---

### 🎨 Frontend - React
- Docker-Compose를 사용하여 개발 환경을 구성하는 과정에서 React와 백엔드 서버 간의 연결을 효율적으로 설정 가능
- React는 다양한 오픈 소스 라이브러리와 플러그인을 제공하기 때문에 빠르게 UI를 개발 가능하며 유지 보수가 유리하기 때문에 선정

<details>
<summary>후보군</summary>

- **vanilla JS/HTML/CSS**
    - 별도의 라이브러리나 프레임워크 없이 순수하게 웹의 기본적인 동작 원리를 이해할 수 있음
    - 가벼운 웹 페이지 및 간단한 애플리케이션 개발에 적합
    - 코드 중복, 유지보수 어려움이 발생

- **React**
    - 빠르고 효율적인 렌더링 및 코드 재사용성을 높이고, 컴포넌트 기반 개발이 가능
    - 다양한 라이브러리 및 툴 생태계가 풍부

</details>

---

### 🛢️ Database - PostgreSQL
- PostgreSQL이 ORDBMS로 Django를 사용하는 우리 프로젝트에 적합할 것이라 판단
- 읽기 기능은 물론 쓰기 기능도 사용하는 것에 있어 PostgreSQL로 결정

<details>
<summary>후보군</summary>

- **MySQL**
  - 데이터 읽기에 적절하며, Django ORM에 적용 제한이 있음
- **PostgreSQL**
  - 다방면으로 Python과 호환이 좋으며, Django와 융합이 좋음.
  - ORDBMS : 객체 지향 개념을 지원하는 데이터 베이스라 Django와 호환성이 아주 좋음
  - PostgreSQL이 ORDBMS로 Django를 사용하는 우리 프로젝트에 적합할 것이라 판단
  - 읽기 기능은 물론 쓰기 기능도 사용하는 것에 있어 PostgreSQL로 결정

</details>

---

### 📐 Vector DB - pgVector
- PostgreSQL을 사용하는 현재 프로젝트에서 PostgreSQL의 확장 모듈로 vector 테이블을 저장하여 사용이 가능
- 무료이며 Django와도 호환성이 좋아 채택

<details>
<summary>후보군</summary>

- **pinecone**
  - 클라우드 기반 vectorDB로 많은 양의 데이터를 사용할 때 좋으며, 유지보수가 간단
  - 무료에는 제한이 있고, 유료로 사용이 가능한 기능이 존재
  - 빠른 유사성 검색, 하나의 DB 안에서 여러 개의 독립적인 벡터 공간을 가질 수 있음
- **FAISS**
  - GPU 가속 지원
  - Python 인터페이스 지원
  - 로컬에서 벡터 검색을 수행하는데 최적화
  - 성능은 뛰어나나, 데이터 영속성을 직접 관리해야하고 분산 처리가 어려움
- **pgVector**
  - PostgreSQL에서 벡터 데이터를 저장하고 검색할 수 있도록 지원하는 확장 기능
  - PostgreSQL과 완벽하게 통합되어, 별도의 벡터 데이터베이스를 사용하지 않고도 벡터 유사성 검색을 수행 가능

</details>

---

### 🧠 LLM - gpt-4o-mini
- gpt-4o 보다 훨씬 저렴하지만 성능 차이는 가격에 비해 크지않음
- 가성비와 안정성면에서 가장 좋다 생각되어서 채택

<details>
<summary>후보군</summary>

- **gpt-4o**
  - 대량의 파라미터를 가지고 있고 openAI사에서 만든 강력한 LLM 모델
- **gpt-4o-mini**
  - gpt-4o의 개량형
  - 가볍고 빠르며 비용이 더 저렴한 SLM(Large Language Model) 모델
- **deepseek-chat**
  - 계산량을 줄이고, 효율을 늘린게 특징, 오픈소스로 기용 가능
  - api 호출시 느린게 단점, 매우매우 저렴

</details>

---

### 🔎 RAG/Agnet
- **Query2doc**
  - 사용자 입력(Query)을 가상 문서(키워드)로 변환하는 프로세스
  - 질의를 확장하거나 재구성 해 RQ-RAG로 다시 쿼리로 분해하기 위해 사용
- **RQ-RAG**
  - 모호한 질문을 쿼리를 정제하여 더 나은 검색결과를 얻는 기법
  - 키워드들을 다시 쿼리로 바꾸어 질문함
  - 가상 문서를 vectorDB 검색을 위한 쿼리들로 변환하기 위해 사용
- [참고 논문](https://arxiv.org/html/2402.19473v6): III-B1 인용
- 적용 효과
  - 복잡하거나, 부족한 정보가 들어와도 기존 사용자의 정보와 사용자 질문(Query)으로 정형화된 가상문서(키워드)를 이용하여 RQ-RAG를 통해 사용자의도에 더 정확한 게임 추천이 가능
- **Tavily Search**
    - 대형 언어 모델(LLM)을 위한 전문 웹 검색 Agent
    - 위 RAG 방식의 한계점을 보완하기 위해 사용(vectorDB에 없는 정보 웹검색)

<details>
<summary>후보군</summary>

- **naive RAG**
  - 단순히 vectorDB 유사도 검색을 이용한 프롬프팅 강화
- **Query2doc/RQ-RAG**
  - 질문을 가상문서(키워드)로 변환 후, vectorDB 변환을 위한 쿼리문들로 분해하는 방식
- **Tavily Search**
  - 대형 언어 모델(LLM)을 위한 전문 웹 검색 엔진입니다. 이는 여러 출처를 검토하여 실시간으로 정확하고 신뢰할 수 있는 정보를 제공
  - AI 기반 애플리케이션의 검색 기능 강화에  최적화

</details>

---

### 🤖 ML 기반 추천

- **Surprise**
  - 다양한 추천 알고리즘(예: SVD, KNNBasic 등)을 쉽게 적용 가능
  - 사용자-아이템 평점 데이터셋을 이용한 모델 학습 및 평가 지원
  - 학습/검증 분리, 교차 검증, RMSE/MAE 등의 지표 제공
- 콘텐츠 기반 필터링으로 1차 추천을 수행한 후, 협업 필터링을 적용하여 최적의 결과를 도출


<details>
<summary>후보군</summary>

- **콘텐츠 기반 필터링**
  - 게임의 **장르, 태그, 설명, 리뷰, 메타데이터** 등을 분석하여 유사한 게임을 추천
  - 사용자가 선호했던 게임과 **유사한 특징을 가진 게임을 추천**
- **사용자 기반 협업 필터링**
  - 나와 비슷한 취향을 가진 유저들이 좋아한 게임 추천
  - 사용자 기반 협업 필터링은 충분한 사용자 데이터가 확보될 경우 적용 가능
- **아이템 기반 협업 필터링**
  - 특정 게임과 유사한 패턴을 보인 게임 추천
- **하이브리드 모델**
  - 콘텐츠 기반 필터링과 협업 필터링을 결합하여 더 정밀한 추천 제공

</details>

---

### 🐳 Docker
- 협업, 배포 시 동일한 환경과 비교적 쉬운 배포가 가능
- 환경 일관성, 격리성, 확장성이 뛰어나 채택


<details>
<summary>후보군</summary>

- **Docker를 사용한 개발 및 배포**
  - 애플리케이션을 신속하게 개발, 테스트, 배포할 수 있도록 도와주는 리눅스 기반 컨테이너 시스템
  - 협업 간 안정성이 매우 높음
  - 디버깅이 더 어려울 수 있음
  - 컨테이너를 사용하기 때문에 리소스를 더 사용함
- **전통적인 방식의 개발 및 배포**
  - 다른 환경에서 개발하는 것이기 때문에 협업 및 배포 안정성이 떨어질 수 있음(의존성 충돌, 개발 환경과 배포 환경의 차이)
  - 개발 환경이 도커보다 직관적이기 때문에 디버깅이 더 쉬움
  - 리소스를 더 절약 할 수 있음(효율적)

</details>

---

### ☁️ Deploy - AWS / Vercel
- **AWS - Backend/DB**
  - **AWS 프리티어**
    - AWS의 프리티어를 활용하여 무료로 배포 가능
    - 또한, 로드 밸런서와 SSL 인증 설정이 매우 간편하여 보안 설정을 손쉽게 처리 가능
  - **EC2**
    - Docker, Python, Django, Nginx 등을 자유롭게 사용할 수 있어 서버 설정에 대한 유연성이 높음
  - **RDS**
    - **백엔드 서버와 데이터베이스**를 분리함으로써 관리 및 유지 보수가 용이
    - 또한, RDS는 **EC2와의 자동 연결** 기능을 제공하여 배포가 더욱 간편
  - **Route53**
    - 도메인 설정이 간편하며, AWS 서비스들과의 통합이 쉬워 관리가 자동화됨  
- **Vercel - Frontend**
  - Vercel을 사용하면 GitHub와 연동하여 자동 배포가 가능하므로 유지보수가 용이하며, 서버리스 배포를 지원하여 프론트엔드만 별도로 빠르게 배포 가능
  - 프론트엔드와 백엔드를 분리하여 관리함으로써 확장성과 유지보수 용이


<details>
<summary>후보군</summary>

- **EC2 통합 배포**
  - 모든 애플리케이션을 하나의 서버에서 관리하므로 서버 수가 적고, 관리가 단순하며 별도로 프론트엔드와 백엔드를 분리하여 배포할 필요가 없으므로, 배포 설정이 간단
  - 백엔드와 프론트엔드가 같은 서버에서 실행되므로 서버 간 통신이 빠르고 성능 최적화가 용이
  - 프론트엔드와 백엔드가 동일한 서버에 배포되면, 각각의 업데이트와 유지보수가 충돌할 수 있으며, 문제가 발생할 경우 두 부분을 동시에 점검해야 함
- **EC2/Vercle 분리 배포**
  - 백엔드와 프론트엔드가 각각 독립적으로 배포되므로, 트래픽이 많을 때 각각 독립적으로 확장 가능
  - Vercel과 같은 플랫폼은 서버리스 환경에서 최적화된 배포를 제공하므로, 프론트엔드를 빠르고 효율적으로 배포 가능

</details>

---

### ⚙️ CI/CD - GitHub Action
- 코드가 직관적이어서 초보자가 사용하기 쉽고 자유도가 높음
- GitHub 저장소와 직접 통합되어 있어, 코드 빌드, 테스트, 배포 외에도 다양한 자동화 작업을 처리 가능하며 소규모 프로젝트에 적합하기 때문에 선택

<details>
<summary>후보군</summary>

- **AWS CodePipeline**
  - CodePipeline은 AWS의 다른 서비스(EC2, S3, Lambda, ECS, Elastic Beanstalk 등)와 자연스럽게 통합되어 있어, AWS 기반 애플리케이션에 매우 적합
  - AWS에서 운영하는 다양한 인프라와의 통합을 지원하므로, 클라우드 환경에서의 배포와 관리를 더욱 효율적으로 할 수 있음
  - CodePipeline은 AWS에서 제공하는 다양한 서비스와 연동해야 하므로, 초보자에게는 설정이 복잡하고 학습 곡선이 있음
- **GitHub Action**
  - GitHub Action은 GitHub 저장소와 긴밀하게 통합되어 있어서, GitHub에서 바로 CI/CD 파이프라인을 설정하고 관리할 수 있음
  - GitHub Action은 AWS, Azure, GCP를 비롯한 다양한 외부 서비스와도 통합할 수 있어 다양한 환경에 적합
  - GitHub에서 제공하는 무료 CI/CD는 소규모 프로젝트에 매우 유용하며, 공용 저장소의 경우 무제한으로 사용 가능

</details>

---

### 🔁 동기 / 비동기 처리
- 동기 처리만 하였을 경우에 인증 이메일 전송과 챗봇 답변 생성으로 인해 다른 요청에 에러가 생기는 경우 발생
- celery를 사용하여 동시 api 요청 시 동시성 해결 
- 챗봇에서 답변을 기다리는 것으로 인한 불쾌한 경험을 줄이기 위해 Django Channels를 통한 비동기 + 웹소켓을 이용한 답변 스트리밍 기능 제공

<details>
<summary>후보군</summary>

- **동기로만 처리**
  - 회원이 적을 것이라 판단하여 요청과 응답에 시간이 오래 걸리지 않을 것이라 판단
  - 간단한 서비스이기에 적합하다고 판단
- **동기 + 비동기 처리**
  - 일반 회원가입 시에 인증 이메일 전송, 챗봇 답변 생성 등 실행 시간이 긴 작업이 있어 다른 작업 시간에 영향을 끼쳐 사용하는 방향을 고려
  - 비동기 처리를 통한 보다 좋은 사용자 경험 제공

</details>

---

### 📎 협업 도구
- Documentation & Recording
  - Notion  
  - Figma

- Version Control
  - Git

- Communication
  - Slack

</div>
</details>


<br>

<p align="center">
  <table width="100%" style="border-collapse: collapse;">
    <tr style="background-color:#f2f2f2;">
      <th style="text-align:center; padding: 10px;"><b>카테고리</b></th>
      <th style="text-align:center; padding: 10px;"><b>기술 및 설명</b></th>
    </tr>
    <tr>
      <td align="center" style="padding: 10px;"><b>Backend</b></td>
      <td align="left" style="padding: 10px;">
        - <b>Python3.12-slim</b> : Language <br>
        - <b>Django</b> : 웹 백엔드 개발 <br>
        - <b>Django REST Framework (DRF)</b> : RESTful API 개발 <br>
        - <b>Celery</b> : 비동기 작업 처리 및 분산 작업 큐 <br>
        - <b>Redis</b> : 캐싱 및 메시지 브로커 <br>
        - <b>Postman</b> : API 테스트 및 디버깅 <br>
        - <b>Django Channels</b> : 채팅 등의 실시간 웹소켓 및 비동기 기능 구현
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 10px;"><b>Frontend</b></td>
      <td align="left" style="padding: 10px;">
        - <b>React</b> : 프론트엔드 개발 및 UI 구성
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 10px;"><b>DataBase</b></td>
      <td align="left" style="padding: 10px;">
        - <b>PostgreSQL</b> : 관계형 데이터베이스 관리 시스템 (RDBMS) <br>
        - <b>pgvector</b> : PostgreSQL용 벡터 검색 확장, 유사도 검색 및 벡터 데이터 저장/조회
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 10px;"><b>LLM / ML</b></td>
      <td align="left" style="padding: 10px;">
        - <b>OpenAI</b> : 대형 언어 모델(LLM) API 제공, 자연어 처리 및 생성 <br>
        - <b>LangChain</b> : LLM 애플리케이션 구축을 위한 프레임워크, 프롬프트 관리 및 데이터 연결 기능 <br>
        - <b>Surprise</b> : 추천 시스템 개발을 위한 Python 라이브러리로, 협업 필터링(Collaborative Filtering) 기반 알고리즘 구현
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 10px;"><b>Deploy</b></td>
      <td align="left" style="padding: 10px;">
        - <b>Docker</b> : 컨테이너화된 애플리케이션 관리 <br>
        - <b>Docker Compose</b> : 다중 컨테이너 애플리케이션 구성 <br>
        - <b>Amazon EC2</b> : 클라우드 컴퓨팅을 위한 가상 서버 <br>
        - <b>Vercel</b> : 프론트엔드 및 정적 사이트 배포 플랫폼 <br>
        - <b>Route 53</b> : AWS의 DNS 웹 서비스 <br>
        - <b>Nginx</b> : 리버스 프록시 및 웹 서버 <br>
        - <b>Gunicorn</b> : WSGI 서버, Django 등의 Python 웹 애플리케이션 실행 <br>
        - <b>Uvicorn</b> : ASGI 서버, FastAPI 및 Django Channels 실행 <br>
        - <b>GitHub Actions</b> : CI/CD 자동화 및 워크플로우 관리
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 10px;"><b>Collaboration Tool</b></td>
      <td align="left" style="padding: 10px;">
        - <b>Slack</b>: 팀 커뮤니케이션 및 실시간 협업 <br>
        - <b>GitHub</b> : 코드 버전 관리 및 협업 <br>
        - <b>Notion</b> : 프로젝트 관리 및 문서 협업 <br>
        - <b>Figma</b> : UI/UX 디자인 및 프로토타이핑
      </td>
    </tr>
  </table>
</p>

<br>

## 3. 주요 기능
### 👤Account
> **회원 가입**
> - 일반 로그인과 소셜 로그인(Steam) / 로그아웃 기능 제공
> - 아이디와 비밀번호,별명,이메일 등 정보를 입력하면 입력창에서 바로 유효성 검사 진행, 통과하지 못할 시 각 경고 문구 생성
> - 일반회원의 경우, 기입한 이메일 주소로 인증 메일이 발송되며 인증을 마치면 로그인 가능
> - 회원 탈퇴 기능 제공
![스팀회원가입](https://github.com/user-attachments/assets/6fb2b011-9950-4957-ac21-afc9a6c9dc29)

> **라이브러리 연동**
> - 스팀 유저의 경우 라이브러리 동기화를 통해 라이브러리를 가져오는 기능 제공
> - 라이브러리의 게임을 선호게임으로 지정하면 선호 장르 자동 생성
> - 유저 닉네임 수정 기능 제공
> - 회원 탈퇴 기능 제공
![동기화](https://github.com/user-attachments/assets/b964ed2b-1a45-4a17-a05d-0007ab85e717)

### 💬 ChatMate
> **AI 챗봇의 사용자 맞춤 게임 추천**
> - 사용자의 선호 게임을 분석하여 게임 성향을 구체화하여 제공
> - 멀티턴 대화방식으로 사용자 대화 내역을 고려
> - RAG 사전검색 강화로 vectorDB에서 적합한 게임 추천
![chatmate](https://github.com/user-attachments/assets/1cea9005-3abd-4245-9e7b-b658cb7984f6)

> **대화 세션별 History 기능**
> - 대화별 세션 생성, 저장 및 삭제 기능
> - 사용자 별 여려 세션 생성 가능
![session](https://github.com/user-attachments/assets/971d1059-dbe9-4288-b2f6-454ac06bcdc2)

### 🤖 PickMate
> **ML기반의 사용자 게임 추천**
> - 사용자 라이브러리의 플레이타임을 기반으로 학습하여 게임 추천
> - 선호게임 없거나 일반회원일 경우 랜덤 추천
> - 추천된 게임을 클릭하면 스팀 해당 게임 페이지로 이동
![pickmate](https://github.com/user-attachments/assets/5dee8da7-675a-4fc8-8b34-0acfbe7ecdae)
<br>

## 4. 기여 가이드라인
- [GitHub Rules](https://github.com/hzi09/SteaMate-Backend/wiki/GitHub-Rules)
- [Code Convention](https://github.com/hzi09/SteaMate-Backend/wiki/Code-Convention)
- [Project Convention](https://github.com/hzi09/SteaMate-Backend/wiki/Project-Convention)