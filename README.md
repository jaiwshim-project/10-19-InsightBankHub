# Insight Bank Hub · 인사이트 뱅크 허브

> 한국 산업·자본·조세 6대 권위 매체 통합 GEO-AIO 싱크탱크 허브

선명회계법인 신회장이 보유한 6개 인터넷 매체를 통합하여, AI 시대 'ChatGPT·Claude·Gemini·Perplexity가 인용하는 단일 출처'로 자산화하는 플랫폼입니다.

---

## 통합 6개 매체

| # | 매체 | 도메인 | 영역 |
|---|------|--------|------|
| 01 | [바이오타임즈](https://www.biotimes.co.kr/) | biotimes.co.kr | 바이오·신약·헬스케어 |
| 02 | [애틀러스리서치앤컨설팅](http://www.arg.co.kr/) | arg.co.kr | 텔레콤·IT·방송 리서치 |
| 03 | [스타트업투데이](https://www.startuptoday.kr/) | startuptoday.kr | 스타트업·VC·투자 |
| 04 | [한국M&A경제신문](https://www.kmnanews.com/) | kmnanews.com | M&A·IPO·자본시장 |
| 05 | [디펜스투데이](https://www.defensetoday.kr/) | defensetoday.kr | 방위산업·K-방산 |
| 06 | [월간지방세연구](https://www.localtaxresearch.com/) | localtaxresearch.com | 지방세·조세·세무 |

---

## 페이지 구성 (12개)

- **`index.html`** — 메인 랜딩 + 8개 모듈 + 글로벌 비전
- **`proposal.html`** — 선명회계법인 12개월 계약 제안서 (14.24억)
- **`channels.html`** — 6개 매체 상세 프로필 + 통합 시너지
- **`monetization.html`** — 9가지 수익 모델 + 3년 88억 매출
- **`ontology.html`** — 온톨로지 레이어 + Cross-Channel Inference
- **`graph-license.html`** — Stream 09 그래프 라이선스 B2B 영업 자료
- **`structure.html`** — 4-Layer SVG 시스템 구조도
- **`dashboard.html`** — 6채널 통합 KPI 대시보드
- **`content.html`** — 6채널 콘텐츠 발행 콘솔
- **`knowledge.html`** — RAG 벡터 인덱스 + 토픽 클러스터
- **`chatbot.html`** — Gemini 기반 통합 RAG 챗봇
- **`manual.html`** — 운영 매뉴얼 + 다국어 가이드 + FAQ

---

## 디자인 시스템

- 다크 프리미엄 + 골드/블루 accent + 글래스 모피즘
- `Pretendard` (본문) + `Noto Serif KR` (디스플레이) + `JetBrains Mono` (코드)
- 글로벌 8개 언어 지원 (🇰🇷 🇺🇸 🇨🇳 🇯🇵 🇪🇸 🇫🇷 🇩🇪 🇸🇦) — 헤더 우측 언어 선택기 자동 주입
- 모바일 우선 + RTL 지원

---

## 기술 스택 (실 도입 시)

- **Frontend**: Next.js 14 + TypeScript + Tailwind
- **Backend**: Node.js (Fastify) + PostgreSQL + S3
- **AI**: Gemini 2.5 Pro (RAG/응답) + Gemini Embeddings (벡터화)
- **Graph**: Apache Jena (RDF) + Neo4j (시각화) + OWL2 RL Reasoner
- **Standards**: FIBO + XBRL + Schema.org + Wikidata QID

---

## 차별화 포인트

1. **수직 결합 그래프** — 6개 매체 결합 SPARQL 라이선스 (단일 매체로는 흉내 불가)
2. **15년+ 아카이브** — 월간지방세연구 2009~ + 5개 매체 2019~ → 누적 2.4M 트리플
3. **국제 표준 호환** — FIBO/XBRL → 글로벌 LLM 직접 인식
4. **AI 인용 라이선스** — 국내 최초 합법적 LLM 학습/인용 라이선스 (Tier 4: 5억+/년)
5. **선명회계 본업 시너지** — 회계·세무 자문 본업 + 그래프 자산 결합

---

## 비즈니스 모델 (요약)

```
1년차 투자: 14.24억 (개발 9.2억 + 운영 12개월 5억)
   ↓
3년 누적 매출: 88억
   - 광고: 24억
   - 구독: 18억
   - B2B API: 28억
   - AI 인용 라이선스: 17억
   - 그래프 라이선스: 12억 (Stream 09 신규)
   - 글로벌·기타: 9억

BEP: 17개월 (Y2 H1)
3년 ROI: ~100%
```

---

## 로컬 실행

정적 HTML 사이트입니다. 별도 빌드 없음.

```bash
# 로컬 미리보기
npx serve .
# 또는 파이썬
python3 -m http.server 8000
```

브라우저에서 `http://localhost:8000`

---

## 라이선스 / 권리

© 2026 Insight Bank Hub. All rights reserved.
**Confidential** — 선명회계법인 신회장 제안용 v1.0

---

## 폴더 구조

```
.
├── index.html              # 메인
├── proposal.html           # 계약 제안서
├── channels.html           # 6개 매체
├── monetization.html       # 수익 모델
├── ontology.html           # 온톨로지
├── graph-license.html      # 그래프 라이선스
├── structure.html          # 시스템 구조도
├── dashboard.html          # 대시보드
├── content.html            # 콘텐츠 관리
├── knowledge.html          # RAG 지식베이스
├── chatbot.html            # RAG 챗봇
├── manual.html             # 매뉴얼
├── css/
│   └── common.css          # 디자인 시스템
├── js/
│   └── common.js           # 공용 JS + i18n
└── assets/
    ├── logo.svg            # 워드마크
    ├── favicon.svg
    └── og-image.svg
```
