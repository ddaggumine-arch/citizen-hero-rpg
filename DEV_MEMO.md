# 시민영웅: 예절 수호자 — 개발 & 버전 메모리 (DEV_MEMO)

- **프로젝트 경로**: `D:\citizen-hero-rpg`
- **라이브 URL**: https://ddaggumine-arch.github.io/citizen-hero-rpg/
- **저장소**: `https://github.com/ddaggumine-arch/citizen-hero-rpg.git` (`main` 브랜치 푸시 시 GitHub Pages 자동 배포)
- **기술 스택**: 순수 HTML / CSS / Vanilla JS ES Modules (React / Remotion 미사용)

## 현재 최신 버전: V22.0
- **V22.0**:
  - **장비 컷인 & 삼위일체 콤보 체인**: 전투 중 아이템/장비 사용 시 `.equip-cutin` 중앙 줌 이펙트, 서로 다른 3종 스킬 연속 사용 시 추가 피해 +35 & 사이다 +20
  - **서울 날씨 시스템 (`WEATHERS`)**: 매일 `맑음`/`비`(흡연·침 빌런 공격 -20%)/`폭염`(사이다 캔 1.5배)/`미세먼지`(전투 +10P) 변경
  - **히든 최종보스 [닥터 카오스] (`HIDDEN_BOSS`, `boss_dr_chaos`)**: 단서 5개 + 4대 보스 격파 시 13화 최종 결전 돌입 → 클리어 시 진엔딩 16 해금
  - **시민영웅 랭크 (`getHeroRankInfo`)**: D급 → C급 → B급 → A급(공격+4) → S급(공격+8)
- **V21.0**:
  - 챗지피티 웹툰풍 커스텀 RPG 아이템 아이콘 12종 투명 PNG 적용 (`assets/images/items/` — `water_gun`, `megaphone`, `mirror`, `cheongsimhwan`, `cold_soda`, `gift_box`, `car_1~3`, `costume_police/dark/couple`)
  - 가방 모달, 편의점 상점, 드라이브 버튼, 코스튬 선택 UI에 커스텀 아이콘 반영 (`?v=23`)
- **V20.0**:
  - `.scene-card` / `.scene-card-ascii` 모바일 텍스트 잘림 수정 (`white-space: pre-wrap`, `justify-content: flex-start`, `overflow-y: auto`)
  - 어학 공부 하루 1회 제한(`lastStudyDay`) & 호감도 상승량 `+4`로 하향
  - 연애 초반 "알아가는 단계"(`getting_to_know`, 호감도 35 미만 · 일러스트 미등장 텍스트 대화 3종씩) 추가
  - 회복 아이템 상향(`우황청심환` 최대HP 45%+사이다15, `칠성사이다 캔` 사이다65+HP25+다음 공격+12)
  - `등교길 교통봉사` 밸런스 조정 (`HP -10 · +18 P · 모범 +6 · 민폐 -3%`)
  - 흑막 단서 2/4개 달성 시 중간 스토리 컷신(`story_interlude`) 추가
- **V18.0**: 유키·클로이·콩이 인게임 전투 전신 스프라이트 (`assets/images/yuki_sprite.png`, `chloe_sprite.png`, `kongi_sprite.png`), `.combat-stage` 비겹침 배치
- **V19.0**:
  - 확장 프롤로그 `prologue_past` (3년 전 빗속 버스정류장 & 노란 완장의 비밀)
  - 흑막 `[블랙 튜브 MCN]` 단서 5종 (`state.clues`) + 비밀 진엔딩 16번 (`end_black_mcn_truth`)
  - 하드 연애: 고백 조건(호감도95+어학Lv.6+데이트3회+스탯), 썸 돌파 위기(`some_crisis`), 라이벌(`rival_scene`), 양다리 삐짐(`state.sulky`), 커플 아지트 초대
  - 전투 시너지: 유키 매턴 HP+6, 클로이 치명+18%, `📝 반성문` 상태이상(`enemyApologyTurns`), 갱생 빌런 동료 3종(`state.allies`)

## 중요 규칙
1. `index.html`의 `style.css?v=XX` 및 `app.js?v=XX` 캐시 버스팅 쿼리를 업데이트 시 함께 올릴 것.
2. `createNewGameState()`에 새 필드를 추가할 때는 기존 `localStorage` 세이브(`SAVE_KEY`, `SAVE_SLOTS_KEY`)와 호환되도록 항상 `state.field || default` 방어 코드를 유지할 것.
3. 푸시 전 `node --input-type=module` 부팅 검증(`BOOT_OK`) 수행.
