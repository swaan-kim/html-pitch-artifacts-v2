# HTML Pitch Artifacts V2

**사용자 요청 → 실제 화면 변화 → 재사용 프롬프트**를 연결하는 HTML 발표 제작 스킬과 예시 갤러리입니다.

[웹 갤러리 열기](https://swaan-kim.github.io/html-pitch-artifacts-v2/) · [프롬프트 라이브러리](https://swaan-kim.github.io/html-pitch-artifacts-v2/prompt-library.html) · [v2.0.0 다운로드](https://github.com/swaan-kim/html-pitch-artifacts-v2/releases/tag/v2.0.0)

## 갤러리에서 시작
1. 세 보관본 또는 수정 기록을 살펴봅니다. 과거 화면이 없는 항목은 그 사실을 표시합니다.
2. 요청 원문이나 일반화된 프롬프트를 복사합니다.
3. 화면 골라 쓰기에서 장면을 담고 순서를 바꿉니다.
4. 독립 HTML을 내려받아 인터넷 없이 발표하거나 편집 ZIP으로 수정합니다.

다운로드한 저장소의 index.html도 로컬에서 열 수 있습니다. 미리보기와 내보내기에 CDN·API 서버가 필요하지 않습니다. 마지막 3장은 요소가 이어지므로 하나의 묶음입니다.

## 누적 제작 지시와 복사용 프롬프트

2026년 9월 30일에 이 대화의 제작 지시와 기존 25건 사례집을 재정리했습니다. [검색 화면](prompt-library.html)에서 12개 분류의 64개 지침, 16개 복사용 프롬프트, 10개 수정 관계를 확인할 수 있습니다. 36개 출처 묶음의 발췌와 일반화한 문장은 구분됩니다. 최근 Figma 블록 이동과 디자이너 구르미 요청도 포함합니다.

- [핵심 제작 원칙](references/presentation-style.md): 로고 플레이·문구 축소·연속 전환·예외와 적용 범위.
- [상황별 프롬프트](references/presentation-prompt-pack.md): 새 발표 시작부터 부분 수정·용량 검수까지.
- [전체 요청 목록](references/presentation-request-catalog.md): 원문 발췌·재사용 지침·수정 관계·프로젝트 전용 값.
- [구조화 데이터](data/presentation-preferences.json): 출처와 지침의 연결을 유지하는 JSON.

검색 화면은 데이터가 포함된 단일 HTML로 동작합니다. 기존 v2.0.0에 추가한 문서·검색 자료이며, 공개 보관본이나 발표 원본을 덮어쓰지 않습니다. [프롬프트 자료 ZIP](downloads/presentation-prompts-2026-09-30.zip)도 제공합니다. v2.0.0 릴리스 파일은 당시 버전 그대로이며 최신 지침은 이 저장소와 프롬프트 라이브러리를 기준으로 합니다. 데이터 수정 후 `python scripts/build_prompt_library.py`로 목록·복사용 문서·검색 화면을 다시 생성합니다.

## 스킬 설치
릴리스의 `html-pitch-artifacts-v2-skill.zip`을 풀어 폴더를 `~/.codex/skills/html-pitch-artifacts-v2`에 둡니다. 기존 동명 스킬이 있으면 먼저 비교·백업합니다. 다음 작업에서 `$html-pitch-artifacts-v2`를 호출합니다.

예: “이 발표의 구르미 소개처럼 실사에서 캐릭터로 바뀌는 장면을 가져와 내 프로젝트에 맞춰줘. 나머지는 유지하고 해당 장면부터 검수해줘.”

## 제작 도구
Node.js 22 이상이 필요합니다. `npm ci`로 개발 의존성을 설치합니다.

```text
node scripts/scene_map.mjs --input assets/templates/autopets
node scripts/compose_deck.mjs --scenes cover,gurumi-intro,meaning --output my-deck
node my-deck/build.mjs
npm test
npm run build
npm run qa
npm run package
```

브라우저 검수는 `npx playwright install chromium`이 필요합니다. Windows에서 기존 Edge를 사용할 경우 `CHROMIUM_EXECUTABLE_PATH`를 지정할 수 있습니다. 번들 런타임을 쓰는 환경에서는 `CODEX_PRIMARY_RUNTIME_NODE_MODULES`로 모듈 위치를 지정합니다.

## 무엇이 달라졌나
- V1의 고정된 장수/사업 피치 중심 흐름에서 목적·시간에 맞춘 장면 조합으로 확장했습니다.
- HTML이 기본 출력입니다. 기존 34장 템플릿·A4·PDF 내보내기는 선택 기능으로 유지합니다.
- 대형 HTML 전체를 읽는 대신 장면 지도와 해당 조각을 읽습니다. 효율 보고는 입력 범위 측정이며 실제 토큰 청구 절감률이 아닙니다.
- 클릭 단계, 역방향 취소, 모션 줄이기, 독립 실행, 사진별 용량을 함께 검수합니다.

## 보관 자료
초기 A 9장, 초기 B 14장, 최종 20장을 `examples/versions`에 원본 그대로 보관합니다. 9장본이 최초로 제작된 모든 버전의 시작이라는 뜻은 아닙니다. 파일 해시와 보관 출처는 manifest에 있습니다.

실제 AutoPets 예시와 구르미 사진은 제작자의 공개 승인으로 포함했습니다. 제3자 브랜드는 제휴를 뜻하지 않습니다. 출처·권리 범위는 [THIRD_PARTY.md](THIRD_PARTY.md), 요청 기록은 [casebook](references/prompt-casebook.md), 검수 결과는 [reports/summary.md](reports/summary.md)를 참고하세요.

GitHub Pages 배포는 이 공개 저장소의 갤러리만 대상으로 합니다. 기존 V1 저장소는 변경하지 않습니다.
