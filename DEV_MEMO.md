# 시민영웅: 예절 수호자 — 개발 & 버전 메모리 (DEV_MEMO)

- **프로젝트 경로**: `D:\citizen-hero-rpg`
- **라이브 URL**: https://ddaggumine-arch.github.io/citizen-hero-rpg/
- **저장소**: `https://github.com/ddaggumine-arch/citizen-hero-rpg.git` (`main` 브랜치 푸시 시 GitHub Pages 자동 배포)
- **기술 스택**: 순수 HTML / CSS / Vanilla JS ES Modules (React / Remotion 미사용)

## 현재 최신 버전: V26.6
- **V26.6**:
  - **제3막 (13~18화) 10배 풀볼륨 웹툰형 스토리 리뉴얼 (`data/storyAct3.js`)**: 각 화 6씬 기승전결(총 36씬) 확장, **유키(13~15화)** · **클로이(16~17화)** · **시바견 콩이(18화)** 합류 서사 및 `sb_13`~`sb_18` 전용 보스 개성 100% 연동 (`?v=39`)
- **V26.5**:
  - **제2막 (7~12화) 10배 풀볼륨 웹툰형 스토리 리뉴얼 (`data/storyAct2.js`)**: 각 화 6씬 기승전결(총 36씬) 확장, 신규 보스 `sb_07`~`sb_12` 캐릭터성과 100% 연동 (노량진 딸깍이·2호선 100L 거북선·시내버스 아아 테러녀·개찰구 파쿠르·에스컬레이터 폰좀비·심야 폭주두목 + 진상연합 단톡방 해킹, `?v=38`)
- **V26.4**:
  - **스토리 1~30화 전용 신규 보스 30종 & 투명 PNG 스프라이트 완비 (`data/storyBosses.js`, `assets/images/sb_01.png`~`sb_30.png`)**: 5장(3×2) 웹툰 캐릭터 시트에서 30종 전부 투명 PNG(`504px` 발끝 정렬)로 추출, 순찰/배틀타워 랜덤 풀과 분리된 `storyOnly: true` 전용 보스로 1~30화 전 챕터에 1:1 배치 (`📖 빌런 도감` 수집 포함, `?v=37`)
- **V26.3**:
  - **제1막 (1~6화) 10배 풀볼륨 웹툰형 스토리 리뉴얼 (`data/storyAct1.js`)**: 각 화당 1~3씬 → **6씬 기승전결(총 36씬)** 확장, 캐릭터 티키타카 대사, 중간 설전/심리전 분기 선택지, 블랙튜브 MCN & 1대 시민영웅 떡밥 연동 (`?v=36`)
  - **향후 예정**: 제2~5막(7~30화) 순차 10배 풀볼륨 확장 예정
- **V26.2**:
  - **막타 사이다 피니셔 & 시민 제보 찬스**: 적 HP 25% 이하 시 `💥 사이다 피니셔` 즉시 격파(+15P), 전투 중 20% 확률 `📢 시민 제보` 무료 턴(SP+25·채증+1)
  - **오늘의 서울 운세 (`DAILY_FORTUNES`)**: 매일 아침 황금/사이다/인연/수호 4종 행운 버프 자동 부여 & 지도 상단 표시
  - **빌런의 찌질한 변명 + 최후의 일갈 (`villain_excuse`)**: 일반 빌런 격파 시 65% 확률로 무릎 꿇고 변명하는 컷씬 + 모범/광인 일갈 마무리
  - **수상한 노란 봉투 (`mystery_envelope`)**: 자유행동 후 22% 확률로 1대 영웅 이니셜 봉투 발견 (후원금+55P / 선배 비밀 쪽지 / 스파이 함정) (`?v=35`)
- **V26.1**:
  - **오프닝 콜드 오픈(Cold Open) 리뉴얼 (`prologue_1` → `prologue_cold_hit` → `prologue_past` → `prologue_2`)**: 시작 즉시 편의점 할머니 새치기+쇼츠 빌런 현장 난입 → 1방 참교육 & 12만뷰 바이럴 폭발 → 김순경의 **1대 시민영웅 실종 미스터리(블랙튜브 MCN)** 도입!
  - **웹툰식 타자기 대사(`setLogText`) & 말풍선 팝업(`@keyframes quotePop`)**: 스토리·프롤로그 대사 타자기 출력 (터치 시 즉시 전체 스킵)
  - **실시간 서울 112 긴급 속보 배너 (`breakingNews`, `.breaking-banner`)**: 1일차 첫 진입 100% 보장 + 일일 갱신, 즉시 출동 해결 시 `+35P` · 구역 치안 `+15%` · SNS 속보 헤드라인 출력 (`?v=33`)
- **V26.0**:
  - **메인 스토리 30파트(30화) 대장정 (`data/storyChapters.js`)**: 5막 × 6화 구성 — 1막(1~6화) 동네 자경단 각성 → 2막(7~12화) 도심·대중교통 빌런 → 3막(13~18화) 유키(14~15화)·클로이(16~17화)·콩이(18화) 합류 → 4막(19~24화) 진상연합 4대 천왕·히로인 구출전 → 5막(25~30화) 블랙튜브 MCN 잠입 & 닥터 카오스 최종 결전
  - **스토리 연동 단계별 모드 해금 (`data/v26World.js`, `UNLOCK_MILESTONES`, `isFeatureUnlocked`)**: 3화(공방/장비창고) → 6화(커뮤니티) → 9화(즉결 재판소) → 12화(자취방/주식) → 15화(유키 연애/일본어) → 17화(클로이 연애/영어) → 18화(콩이 입양) → 21화(차량/코스튬) → 24화(재단/배틀타워) → 25화(심야 마계 보스 러시). 해금 전에는 `🔒 X화 해금` 표시, `ngPlus >= 1`은 전체 개방
  - **서울 5대 구역 치안 평정 (`SEOUL_DISTRICTS`, `openDistrictsModal`)**: 마포·성수·강남·종로·여의도 전투 승리 시 치안 +20%(보스 +40%), 100% 평화구역 달성 시 구역당 매일 +25P 후원금 + 영구 패시브(SP회복/치명타/공격/방어/드랍률)
  - **심야 마계 보스 러시 (`nightmareFloor`, `nightmare_clear`)**: 25화 해금, 층수 비례 보스 스케일링 및 유니크 장비 드랍 배율 상승 (`?v=32`)

- **V25.2**:
  - **데이트 코스별 1:1 맞춤형 키스신 17장 추가 (`kiss_yuki_*.jpg` 8종, `kiss_chloe_*.jpg` 9종)** → 유키 10종·클로이 10종 데이트 직후 `💋 분위기 이어서 로맨틱 키스하기` 시 해당 장소·분위기 전용 키스신 출력!
  - **키스 컬렉션(`kissCollection`) & 📸 추억 앨범 확장**: 데이트 후 키스로 해금한 모든 키스신 일러스트를 추억 앨범에서 수집·열람 가능
  - **모바일 레이아웃 잘림 수정 (`style.css`)**: `.choices-panel` `max-height: 43dvh; overflow-y: auto;`, `.illustration-frame` `min-height: 165px`, `.couple-stage #scene-image` `object-fit: contain` (`?v=31`)
- **V25.1**:
  - **커플 데이트 투명 PNG 스프라이트 8종 추가 추출** (`couple_yuki_walk/umbrella/ramen/cozy.png`, `couple_chloe_walk/photo/food/hug.png` → 총 **10종 커플 전용 스프라이트**로 유키 10종 & 클로이 10종 전원 100% 매칭)
  - **1일 1회 제한 밸런스 패치**: 연인 데이트(`lastLoverDateDay`) 및 키스신(`lastKissDay`) 모두 하루 1회 제한 적용으로 무한 파밍 방지
  - **커플 데이트 스탬프 도감(10종) & 올클리어 보너스**: 10가지 데이트 모두 완료 시 `전스탯+2 · 최대HP+20` 영구 보너스
  - **데이트 감성 FX & 티키타카**: `hearts`/`flash`/`rain`/`stars` 파티클 오버레이 + 주인공·여친 티키타카 대사 (`?v=29`)
- **V25.0**:
  - **💋 연인 로맨틱 키스신 모드 (`kiss_scene`, `kiss_yuki.jpg`, `kiss_chloe.jpg`)**: 정식 연인 달성 후 `romance` 메뉴/데이트 이어하기로 감상 가능 + 3지선다 반응 + `📸 추억 앨범` 수록
  - **💑 연인 전용 데이트 행동양식 각 10종 (유키 10종 + 클로이 10종 = 총 20종, `data/v25Romance.js`)**: `couple-stage` 커플 투명 PNG 스프라이트(`couple_yuki_cafe.png`, `couple_yuki_hug.png` + 주인공·히로인 듀오 배치) 데이트 연출 (`?v=28`)
- **V24.1**:
  - **2026 현대 한국인 웹툰풍 투명 PNG 적 스프라이트 9종 적용** (높이 `504px` 정규화로 주인공 `hero_idle.png`와 크기·발끝 정렬, `.enemy-sprite` 숨쉬기/그림자/`boss-scale` 적용, `?v=27`)
  - **기존 이미지 미구현 적 6명 스프라이트 교체**: `shorts_terrorist`, `pen_clicker`, `boss_dr_chaos`, `night_biker`, `subway_legger`, `illegal_parker`
  - **신규 2026 서울 빌런 3명 추가 (`data/gameData.js`)**: `line_cutter`(출근길 새치기 엘보우 빌런), `trash_dumper`(원룸촌 무단투기 양심 실종자), `cafe_hogger`(카페 4인석 콘센트 독점 빌런) → 총 적 **18명** 전원 이미지 보유(`MISSING=0`)
- **V24.0**:
  - **난이도 선택 (`DIFFICULTIES`: 노멀/하드/헬)**: 타이틀 화면에서 즉시 선택, 적 체력/공격/보상/드랍률 차등 적용
  - **방어력(DEF) & 0.1% 유니크 파밍 장비 (`GEAR_LOOT_POOL`)**: 무기·방어구·악세서리 3슬롯, 일반/레어/에픽/0.1% 유니크 드랍, 예절폰 `[⚔️ 파밍 장비 창고]`에서 장착/해제/분해
  - **2회차 뉴 게임 플러스(NG+)**: 엔딩 1종+ 해금 시 타이틀에서 계승 시작 가능 (전스탯 보너스 + 적 1.3배)
  - **빌런 억지 논리 카운터 (`logic_counter`)**: 전투 중 18% 확률로 1방 설전 반격 (정답 시 40% 피해 + 멘붕 브레이크 & 기절)
  - **콩이 특기 전직 (`PET_JOBS`)**: Lv.3+ 달성 시 경비견(반사15%)/힐링견(HP+5)/탐지견(50% 채증+1) 선택
  - **서울 익명 커뮤니티 (`generateCommunityPosts`)** & **커스텀 아이콘 2탄 6종** (`room_mattress/soundproof/desk/doghouse`, `golden_whistle`, `fact_book`) (`?v=26`)
- **V23.0**:
  - **📖 빌런 도감 & 📸 추억 앨범 (`openVillainCodexModal`, `openMemoryAlbumModal`)**: 예절폰에서 처치한 빌런(`villainWins`)과 유키·클로이·콩이 추억 일러스트 열람
  - **💬 연인·콩이 전투 지원 컷인 (`triggerPartnerCallout`)**: 유키 힐/클로이 치명타/콩이 발목 깨물기/합동 필살기 시 스프라이트 점프 + 말풍선
  - **📅 주말 특별 이벤트 & 주간 결산 (`WEEKEND_EVENTS`)**: 7일마다 한강 불꽃축제·홍대 플리마켓·서울 마라톤 + 주간 민폐도 성적표 보너스
  - **🏛️ 시민영웅 재단 & 고액 훈련 (`foundation` 탭)**: 250P 영구 스탯 훈련, 400P 치안 기부, 1,200P 명예 동상 건립
  - **🔥 보스전 붉은 오라(`.boss-aura`) & 합동 필살기 컷인(`anim-unite`)** (`?v=25`)
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
