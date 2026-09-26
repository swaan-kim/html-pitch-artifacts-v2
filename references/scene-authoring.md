# 장면 구성과 내보내기

## 원본과 재사용본
`examples/versions/`의 9·14·20장 HTML은 수정하지 않는 보관본이다. `assets/templates/autopets/`는 최종 화면을 장면별로 나누고 선택 내보내기가 가능하도록 만든 파생 편집본이다. 파생본의 동작 개선을 원본의 역사로 기록하지 않는다.

## 파일 계약
- `scene-manifest.json`: id, title, originalPage, steps(추가 클릭 수), file, group. id는 재정렬해도 유지한다.
- `scenes/<id>.html`: `.slide`, `data-scene-id`, `data-steps`, `data-title`. 페이지 번호에 의존하는 nth-child 선택자를 새로 쓰지 않는다.
- `head.html`, `tail.html`: 문서와 접근성·조작 도움말 공통 부분.
- `styles.css`, `story.css`: 기본 스타일과 확장 연출. `runtime.js`는 존재하는 장면만 찾으며 누락 장면을 참조하지 않는다.
- `assets/`: 실제 사용되는 사진·로고·스프라이트. 새 사진 원본은 별도 원본 보관 위치에 둔다.
- `closing.html`: 마지막 세 장이 공유하는 고정 캔버스. closing-position, closing-media, feedback은 closing-story 묶음으로 움직인다.

## 조작 API
`window.PitchDeck.go(index, cue)`는 0부터 시작하는 순서와 단계를 받는다. `next`, `previous`, `getState`, `getScenes`, `titles`를 제공한다. `AutoPetsDeck`은 호환 별칭이다. URL은 관객에게 익숙한 1부터 시작하는 `#페이지/단계`다.

`window.prepareForExport({sceneId, step})`는 모션을 줄이고 지정 장면/단계의 완성 상태, 폰트·이미지 준비를 기다린다. 이 함수는 최종 상태의 검수·캡처용이며 실제 모션 검수를 대체하지 않는다.

## 선택 내보내기
갤러리와 CLI는 같은 `gallery/compose.js`를 사용한다. 선택한 순서를 유지하고 중복을 제거한다. 마지막 묶음에서 하나를 고르면 세 장을 원래 순서로 포함한다. 공통 CSS는 유지하되 선택한 DOM에 없는 이미지 규칙을 제거한다. HTML/CSS의 실제 참조를 따라 이미지 파일을 포함한다.

편집 ZIP은 index.html, styles.css, runtime.js, assets, scene-manifest.json, build.mjs, SOURCES.md, presentation.html을 포함한다. 본문은 index.html에서 편집한다. 저장된 보관본 전체를 새 발표에 숨겨 넣지 않는다.

## 새 장면
파생 템플릿에 장면을 추가할 때 scene-manifest와 조각 파일을 함께 추가한다. 정적인 새 장면은 공통 runtime만으로 작동한다. 특별한 연출은 data-scene-id 기반 분기와 취소 가능한 타이머를 추가하고 reduced motion, 직접 진입, 역방향을 검사한다.
