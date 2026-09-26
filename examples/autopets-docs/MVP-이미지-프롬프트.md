# AutoPets MVP 이미지 — 제작 프롬프트

- 제작일: 2026-09-26
- 제작 방식: 내장 image_gen 도구. 각 화면을 개별 생성하고 이전 화면을 시각 참조로 연결.
- 화면 순서: 펫 선택 → 설정 → 계획 확인 → 실행.
- 저장 형식: PNG 4장, 각각 1672 × 941 px (16:9에 근접한 도구 기본 출력).
- 콘셉트 목업: 실제 제품의 연동 완료, 모델 성능, 비용 효과를 증명하는 자료가 아님.
- 시각 검수: 한국어 주요 문구, 선택한 펫의 동일성, Astra→Luna 상태 변화, 작업 화면과 오버레이 분리, 내용 잘림 확인.

## 1. 01-pet-selection.png

참조 이미지: 사용자가 제공한 펫 라이브러리 이미지

```text
Use case: ui-mockup. Deliver one finished, front-facing high-fidelity Korean interface screenshot, exactly widescreen 16:9, preferably 2048x1152 pixels. No device frame, no perspective, no multi-panel presentation board.
Shared design: AutoPets independent desktop pet companion. Pure white background, very pale sage green selected surfaces, deep green accents, charcoal headings, thin cool light gray borders, very gentle shadows, restrained 14px rounded corners. Crisp highly legible Korean sans-serif like Pretendard. Calm polished visual communication for a graduation exhibition, substantial whitespace, strong hierarchy, no excessive text or decoration. Pixel-art pets within otherwise crisp modern UI. Top-left a small green pixel paw and exact AutoPets wordmark. Top-right persistent compact dock: active black cat avatar, smaller brown raccoon avatar, a thin separator, outline home button with label "집". The selected cat icon gets a pale green background. Tiny "MVP 콘셉트" label at bottom-right. Do not add invented metrics, ratings, statistics, fake research citations or percent progress.
The central identity is "꼼꼼 고양이": friendly black pixel cat, two square mint-green eyes with black centers, upright triangular ears, tiny feet, curled tail on its right, clean blocky silhouette, consistent scale and face across all four screenshots. Animal identity means a saved work profile, and props/actions mean current work phase. Model switches must not change the animal. No extra child cats, no subagents, no huge obstructive overlay. One exact cat can appear in a tiny navigation avatar as well as the main illustration. UI controls, icons and Korean text must be sharp and correctly spelled.
Edit/redesign the attached library screenshot into screen 1 of 4: PET SELECTION. The reference is the identity and existing library-layout anchor. Keep the recognizable three animal identities and the black cat's mint square eyes. Recompose to the new 16:9 wide layout. Remove the original dense detailed model comparison rows; those belong on the next screen.
Layout: slim header with AutoPets left, "펫 라이브러리" active and "내 펫" navigation. Shared pet/home dock upper-right. Large heading below "할 일에 맞는 펫을 골라요" with a short muted line "스킬과 모델 설정을 펫 하나로."
Main area: three equal large cards, restrained spacing and light border, selected middle card pale sage edge and small "선택됨" badge. Each has name, ONE short personality sentence, clean pale gray pet-art stage, one compact representative-skill chip. Enough vertical whitespace without giant empty cards.
LEFT exact heading "알뜰 너구리", sentence "짧게 계획하고 가볍게 실행", chip "빠른 초안". Friendly brown pixel raccoon holding a small clearly rectangular pocket memo pad and pencil. Absolutely no paper roll or toilet paper.
CENTER exact heading "꼼꼼 고양이", sentence "계획을 확인하고 차근차근 실행", chip "웹페이지 제작". Our black pixel cat looking at the viewer with a little open planning notebook, an inviting competent face. Selected card is dominant by border and subtle green surface, not huge size.
RIGHT exact heading "집중 호랑이", sentence "계획부터 실행까지 깊게 검토", chip "깊은 검토". Friendly orange pixel tiger, relaxed neutral brows (not angry), thoughtfully inspecting a small checklist with a magnifying glass.
Wide low bottom action tray with small cat avatar and "꼼꼼 고양이 선택", then target label "대상 채팅" with "학과 행사 웹페이지" and chevron, and a dark green primary button "설정하기" on right.
Only these minimal UI texts; no technical claims, no plan/model rows on this selection screen, no page numbers or large external presentation captions. Pixel paws may be decorative only within brand. Ensure all content fits safely inside the image.
```

## 2. 02-pet-settings.png

참조 이미지: 01-pet-selection.png

```text
Use case: ui-mockup. Deliver one finished, front-facing high-fidelity Korean interface screenshot, exactly widescreen 16:9, preferably 2048x1152 pixels. No device frame, no perspective, no multi-panel presentation board.
Shared design: AutoPets independent desktop pet companion. Pure white background, very pale sage green selected surfaces, deep green accents, charcoal headings, thin cool light gray borders, very gentle shadows, restrained 14px rounded corners. Crisp highly legible Korean sans-serif like Pretendard. Calm polished visual communication for a graduation exhibition, substantial whitespace, strong hierarchy, no excessive text or decoration. Pixel-art pets within otherwise crisp modern UI. Top-left a small green pixel paw and exact AutoPets wordmark. Top-right persistent compact dock: active black cat avatar, smaller brown raccoon avatar, a thin separator, outline home button with label "집". The selected cat icon gets a pale green background. Tiny "MVP 콘셉트" label at bottom-right. Do not add invented metrics, ratings, statistics, fake research citations or percent progress.
The central identity is "꼼꼼 고양이": friendly black pixel cat, two square mint-green eyes with black centers, upright triangular ears, tiny feet, curled tail on its right, clean blocky silhouette, consistent scale and face across all four screenshots. Animal identity means a saved work profile, and props/actions mean current work phase. Model switches must not change the animal. No extra child cats, no subagents, no huge obstructive overlay. One exact cat can appear in a tiny navigation avatar as well as the main illustration. UI controls, icons and Korean text must be sharp and correctly spelled.
Create screen 2 of the same product by editing/recomposing the supplied screen 1 reference. The reference defines exact brand, pixel cat identity, pixel-art scale, green palette, header, Korean font weights, card borders, and footer style. Preserve these tightly. Output a single 16:9 full interface screen.
This is PET SETTINGS. Same header and upper-right black cat/raccoon/home dock. Below header a restrained back control "펫 라이브러리" at left and centered large heading "이 펫은 이렇게 일해요". The body is a two-column layout in a single broad work area. LEFT approximately 30%: pale sage pet profile card with "꼼꼼 고양이" at top, short subtitle "계획을 확인하고 차근차근 실행", same pixel black cat, mint square eyes, tail right and its open cream-colored green-covered planning notebook. Render this cat exactly like the center cat of the reference; do not redesign. Small pill "웹페이지 제작" below.
RIGHT approximately 65%: three clean vertically stacked setting groups, use proper left alignment, lots of whitespace, distinct but fine dividers, no dense dashboard.
Group 1 heading "맡길 일". Value "웹페이지 제작" with small "스킬" badge and brief muted description "요구사항 정리 · 화면 구현 · 결과 점검".
Group 2 heading "사용할 모델". Two equally sized outlined setting boxes with a simple arrow between: left has small label "계획", main value "Astra" and secondary "추론 높음"; right has small label "실행", main value "Luna" and secondary "추론 보통". Both have visible small chevrons to signal editable model choices. A small unobtrusive link "모델·추론 변경" appears in this group. Small muted text "설정 조합 예시" below the two boxes.
Group 3 heading "실행 방식". Single row "계획을 확인한 뒤 실행" and enabled sage-green toggle on right. No additional controls.
Low bottom persistent white action tray similar to reference: left "대상 채팅" and dropdown "학과 행사 웹페이지"; right one dark green button "저장하고 이 채팅에 부르기". Ensure button wide enough for exact Korean string and main content is not cramped.
Exact text must be legible and correct. Minimal text, no technical plumbing, no speed/cost promises, no extra features. Tiny "MVP 콘셉트" at bottom-right. No explanatory arrows outside the one model transition arrow. No large slide numbers.
```

## 3. 03-plan-confirmation.png

참조 이미지: 02-pet-settings.png

```text
Use case: ui-mockup. Deliver one finished, front-facing high-fidelity Korean interface screenshot, exactly widescreen 16:9, preferably 2048x1152 pixels. No device frame, no perspective, no multi-panel presentation board.
Shared design: AutoPets independent desktop pet companion. Pure white background, very pale sage green selected surfaces, deep green accents, charcoal headings, thin cool light gray borders, very gentle shadows, restrained 14px rounded corners. Crisp highly legible Korean sans-serif like Pretendard. Calm polished visual communication for a graduation exhibition, substantial whitespace, strong hierarchy, no excessive text or decoration. Pixel-art pets within otherwise crisp modern UI. Top-left a small green pixel paw and exact AutoPets wordmark. Top-right persistent compact dock: active black cat avatar, smaller brown raccoon avatar, a thin separator, outline home button with label "집". The selected cat icon gets a pale green background. Tiny "MVP 콘셉트" label at bottom-right. Do not add invented metrics, ratings, statistics, fake research citations or percent progress.
The central identity is "꼼꼼 고양이": friendly black pixel cat, two square mint-green eyes with black centers, upright triangular ears, tiny feet, curled tail on its right, clean blocky silhouette, consistent scale and face across all four screenshots. Animal identity means a saved work profile, and props/actions mean current work phase. Model switches must not change the animal. No extra child cats, no subagents, no huge obstructive overlay. One exact cat can appear in a tiny navigation avatar as well as the main illustration. UI controls, icons and Korean text must be sharp and correctly spelled.
Create screen 3, PLAN CONFIRMATION, as a new composition in the exact established AutoPets design language. Supplied reference is screen 2: preserve pixel cat identity, notebook, typography, green palette, border treatments and upper-right pet/home dock. This screen demonstrates the independent desktop overlay working NEXT TO an existing AI chat. Do not render the library or settings page again.
Single clean light desktop scene, 16:9. AutoPets small brand top-left, shared pet/home dock top-right. No full website navigation tabs on this desktop screen. Large dark heading across top "시작하기 전에 함께 확인해요". Tiny "MVP 콘셉트" bottom-right.
MAIN left 63%: distinct neutral-white existing AI chat application window, thin gray window border, subdued gray title bar with small conventional minimize/maximize/close controls. Title "학과 행사 웹페이지", small identifier "기존 AI 채팅". Slim subdued left chat sidebar "채팅", selected item "학과 행사 웹페이지". Conversation in center: user message "학과 행사 소개 웹페이지를 만들어줘." in light-gray rounded bubble, assistant reply "웹페이지 구성을 먼저 정리했어요." then "계획을 확인하면 제작을 시작할게요." Keep a few subdued non-text line placeholders or generous whitespace, no code or fake detailed output. At bottom a quiet message field "메시지를 입력하세요". This is clearly another application window, not part of AutoPets settings.
RIGHT approximately 32% outside the AI window: black pixel cat above a compact floating AutoPets action card. Main pet is about 140 to 165 image pixels tall on a 1152px high canvas, small enough to be an unobtrusive desktop overlay. Use EXACT black cat face with square mint eyes, curled right tail and triangular ears from reference, now leaning beside and PRESENTING the open cream notebook with green cover toward viewer. Do not add a second large pet or child pets. It should feel friendly and ready for approval.
Floating card: rounded white surface with subtle shadow and fine sage edge, compact distinct AutoPets paw icon and "꼼꼼 고양이", top status pill "계획 확인". Clear three-item plan checklist (numbered, not checked as completed):
"1  행사 소개와 일정 구성"
"2  신청 버튼이 있는 화면 제작"
"3  모바일 화면과 동작 확인"
Below a slim model transition row: active sage pill "계획 · Astra" -> muted outlined pill "실행 · Luna". Tiny label "확인 후 전환" immediately below the arrow so transition is contingent on approval, not already running.
Bottom two actionable buttons in one row: smaller outline "수정하기" and larger dark green "이 계획으로 시작". No settings action tray. Keep all exact text inside card legible and avoid cramped overflow. Card should occupy edge whitespace without covering existing chat messages.
Calm professional interface, enough visible relationship between message and adjacent confirmation. No huge central cat, no desktop clutter, no wallpaper photo, no duplicated plan text in chat, no performance or integration-success claims.
```

## 4. 04-execution.png

참조 이미지: 03-plan-confirmation.png

```text
Use case: ui-mockup. Deliver one finished, front-facing high-fidelity Korean interface screenshot, exactly widescreen 16:9, preferably 2048x1152 pixels. No device frame, no perspective, no multi-panel presentation board.
Shared design: AutoPets independent desktop pet companion. Pure white background, very pale sage green selected surfaces, deep green accents, charcoal headings, thin cool light gray borders, very gentle shadows, restrained 14px rounded corners. Crisp highly legible Korean sans-serif like Pretendard. Calm polished visual communication for a graduation exhibition, substantial whitespace, strong hierarchy, no excessive text or decoration. Pixel-art pets within otherwise crisp modern UI. Top-left a small green pixel paw and exact AutoPets wordmark. Top-right persistent compact dock: active black cat avatar, smaller brown raccoon avatar, a thin separator, outline home button with label "집". The selected cat icon gets a pale green background. Tiny "MVP 콘셉트" label at bottom-right. Do not add invented metrics, ratings, statistics, fake research citations or percent progress.
The central identity is "꼼꼼 고양이": friendly black pixel cat, two square mint-green eyes with black centers, upright triangular ears, tiny feet, curled tail on its right, clean blocky silhouette, consistent scale and face across all four screenshots. Animal identity means a saved work profile, and props/actions mean current work phase. Model switches must not change the animal. No extra child cats, no subagents, no huge obstructive overlay. One exact cat can appear in a tiny navigation avatar as well as the main illustration. UI controls, icons and Korean text must be sharp and correctly spelled.
Edit the provided screen 3 into screen 4, EXECUTION IN PROGRESS, preserving its composition, shared header, existing-chat window dimensions, sidebar, upper-right dock, floating right-hand AutoPets card placement, whitespace, typography, green palette and exact same black pixel cat identity. This is the very next moment in the same user journey. No new pet identity. Output single 16:9 screenshot.
Change large top heading to "지금 무엇을 하는지 보여요".
Existing AI chat window on left: KEEP title "학과 행사 웹페이지" and small identifier "기존 AI 채팅", same sidebar selection. Retain user request in a compact bubble at top of conversation "학과 행사 소개 웹페이지를 만들어줘." Below show a clean embedded webpage preview large enough to be recognized as the actual work in progress. A little preview label "화면 미리보기". Within preview: minimal contemporary white and sage event webpage. Small header "학과 행사", compact links "소개" and "일정". Hero with heading "학과 행사" and dark-green button "참가 신청". Beside hero use simple tasteful pale-sage abstract geometric page illustration. Lower two small content blocks labelled "행사 소개" and "일정", with subtle gray line placeholders instead of invented event details. The webpage preview should be clearly a contained web page in the existing application. Do not show source code, pretend finished result claims, fictional dates or unnecessary long copy. Keep the existing muted message entry at bottom.
Pet above right card: same black pixel cat, mint-green square eyes, triangular ears, curled tail to right, now using a SMALL SILVER LAPTOP with two paws at keyboard and attentive friendly expression. Its planning notebook is closed and placed neatly beside it, subtly signaling stage transition. Keep its face and silhouette consistent with reference. Make the pet about 15% smaller than screen 3 so work stays dominant. Avoid any face obstruction by laptop; eyes visible. No extra agent/pet; no many motion trails or glow.
Right floating AutoPets work card: same header paw + "꼼꼼 고양이"; small status pill "실행 중". Prominent primary message "웹페이지 만드는 중". Directly below, readable sage badge "실행 · Luna".
Next a simple clean 3-step VERTICAL progress sequence with connectors and exact texts:
green check circle + "계획 확인" (completed)
green active dot + "화면 제작 중" (active, bold)
gray empty circle + "결과 확인" (pending)
No percentages, no elapsed time, no fake code output. At card bottom one full-width dark-green button "작업으로 돌아가기".
The pet and floating card must remain OUTSIDE the work window and must not cover the preview. Keep the compact cat/raccoon/home dock top-right and tiny "MVP 콘셉트" bottom-right. Do not retain the old plan approval buttons or the old Astra active label. This is execution, not completion. Exact Korean text, legible and correctly spelled.
```

