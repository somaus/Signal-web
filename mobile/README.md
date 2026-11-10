# Signal 모바일 앱

Signal-web의 기능을 React Native(Expo)로 옮기는 앱입니다. 대회 시연용이며 실제 배포는 하지 않습니다.
웹(Next.js)과 같은 저장소의 `mobile/` 폴더에 있고, 웹 빌드와는 서로 영향을 주지 않습니다.

## 실행

```bash
cd mobile
npm install
cp .env.example .env     # 필요할 때만. 없으면 배포 서버를 씁니다
npx expo start
```

휴대폰의 Expo Go로 QR을 찍어 실행합니다. 휴대폰과 PC는 같은 와이파이여야 합니다.

## 환경변수

| 이름                  | 설명                                                                                                                                                                                         |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `EXPO_PUBLIC_API_URL` | 백엔드 주소. 기본값은 배포 서버(`https://signal.https.gsmsv.site`). 로컬 서버를 쓸 때는 `localhost`가 휴대폰 자신을 가리키므로 같은 와이파이 PC의 IP(`http://192.168.0.10:8080`)를 적습니다. |

로컬 서버 주소는 `http://`라서, Expo Go에서는 그대로 되지만 직접 빌드한 앱(APK, iOS 빌드)에서는 Android의 cleartext 차단과 iOS의 ATS 때문에 막힐 수 있습니다. 직접 빌드한 앱에서는 https인 배포 서버를 쓰거나 `expo-build-properties`로 http를 허용해야 합니다.

`.env`는 커밋하지 않습니다. 값을 바꾼 뒤에는 `npx expo start --clear`로 다시 켭니다.

## 시연 실행 방식

시연은 **Expo Go**로 실행하는 것을 기본으로 합니다. 빌드가 필요 없고, 코드를 고치면 바로 반영됩니다. 시연 기기에서 Expo Go를 쓸 수 없을 때만 아래 APK를 대신 씁니다.

- **Expo Go (기본)**: 일반적인 시연. 휴대폰에 Expo Go를 설치하고 PC와 같은 와이파이에 연결합니다.
- **EAS preview APK**: Expo Go를 쓸 수 없는 Android 기기용. Expo 계정과 `eas-cli`가 필요하고 빌드에 몇 분 걸립니다.

APK는 `eas.json`의 `preview` 프로필로 만듭니다. 배포 서버(https)를 바라보도록 환경변수가 들어 있습니다. 처음 한 번은 `eas init`으로 프로젝트를 Expo 계정에 연결해야 하며, 이 과정에서 `app.json`에 `extra.eas.projectId`가 추가됩니다.

```bash
npm install -g eas-cli
eas login
eas init                                          # 처음 한 번
eas build --profile preview --platform android    # 끝나면 APK 다운로드 링크가 나옵니다
```

iOS는 Apple 개발자 계정이 있어야 설치용 빌드를 만들 수 있어서 시연에서는 Expo Go만 씁니다.

시연 전에 챙길 것, 장면 순서, 대체 자료는 [`docs/demo-checklist.md`](docs/demo-checklist.md)에 정리했습니다.

## 폴더 구조

웹과 같은 Feature-Sliced Design 구조입니다. import 방향은 `app → views → widgets → features → entities → shared` 한쪽으로만 둡니다.

```
src/
  app/        Expo Router 라우트 (화면 파일은 views를 불러오기만 함)
  views/      화면
  widgets/    여러 화면이 같이 쓰는 큰 조각
  entities/   도메인별 API·타입 (예: entities/user)
  shared/
    api/      axios 클라이언트, 에러 문구
    config/   환경변수, QueryClient, 색상 상수
    i18n/     ko/en 다국어
    lib/      토큰 저장, 비회원 ID, 사진 선택, 폴링 타임아웃 등
    ui/       Screen, Button, Card, Badge, Loading, ErrorView, Input, Text
```

## 위험도 분석 화면

사진 위험도 분석(`분석` 탭)은 사진을 고르면(`widgets/ImagePickerCard`, 갤러리·카메라) 서버에 접수하고, 접수된 번호의 결과 화면(`/analyze/[id]`)이 진행 중인 동안 1.5초마다 조회합니다.

- 결과 화면은 번호로 조회하므로 화면을 벗어났다 돌아와도 이어집니다. 이 기기에서 만든 번호는 `AsyncStorage`에 최근 20개를 보관하고(`shared/lib/recentIds.ts`), 진행 중인 건이 있으면 첫 화면에 "이어서 보기"가 나옵니다.
- 분석 기록은 로그인하면 서버 목록(`GET /api/v1/risk-assessments`), 비회원이면 이 기기의 최근 번호로 보여줍니다.
- 사진은 JPG, PNG만 올립니다(HEIC는 선택기가 JPEG로 바꿉니다). 10MB 이하, 6,400만 화소 이하입니다.
- 업로드 요청만 타임아웃이 60초입니다(`shared/api/imageForm.ts`). 나머지 요청은 10초입니다.

## 디자인 토큰

`global.css`의 `@theme`이 웹 `globals.css`의 토큰(`primary-*`, `secondary-*`, `gray-*`, `text-h1`~`text-caption`, `shadow-*`)을 그대로 옮긴 것입니다. 웹 값이 바뀌면 같이 바꿉니다.

- 줄 높이는 React Native가 `%`를 쓰지 못해 웹의 140%/150%를 px로 풀어 썼습니다.
- Pretendard는 굵기마다 폰트 이름이 달라서 `Text`의 `weight` 속성(`regular`/`medium`/`semibold`/`bold`)으로 고릅니다. `className`에 `font-bold`를 쓰지 않습니다.
- 클래스로 색을 줄 수 없는 곳(탭 바, 아이콘)은 `shared/config/colors.ts`를 씁니다.

## 인증과 API

- `shared/api/axios.ts`: 웹 클라이언트와 같은 동작입니다. 요청마다 `Authorization`, `Accept-Language`를 붙이고, 401/403이면 리프레시 토큰으로 한 번 재발급해 다시 요청합니다. 서버가 리프레시 토큰을 거절한 경우에만 토큰을 지우고 세션 만료로 처리해 `SessionGuard`가 로그인 화면으로 보냅니다. 타임아웃이나 오프라인 같은 일시적 오류에는 토큰을 지우지 않습니다. 직접 로그아웃한 경우에는 만료 안내 없이 비회원 상태로 돌아갑니다. 재발급은 401에서만 시도합니다(서버는 만료·인증 없음에 401, 권한 부족에 403을 줍니다).
- 토큰은 `expo-secure-store`에 저장합니다(`shared/lib/authToken.ts`).
- 로그인하지 않은 비회원은 `guestHeaders()`로 `X-Anonymous-Id`를 붙입니다. 비회원 API를 부르는 곳에서 헤더에 펼쳐 씁니다.
- 에러 코드별 문구는 `shared/api/errorMessages.ts`에 있고 웹과 같은 코드 목록입니다. 서버에 새 코드가 생기면 웹과 함께 추가합니다.

## 다국어

한국어/영어를 지원합니다(웹은 4개 언어). 앱은 iOS와 Android만 대상으로 하며 웹 빌드는 쓰지 않습니다(토큰 저장에 쓰는 SecureStore가 웹에서 동작하지 않습니다). 문구는 파일마다 `defineMessages`로 정의하고, 컴포넌트에서는 `useMessages(messages)`로 꺼냅니다. 컴포넌트 밖에서는 `translate()`, `currentLocale()`을 씁니다. 설정은 기기 언어를 따르며, 더보기 탭에서 바꾸면 저장됩니다.

## 확인 명령

```bash
npm run lint
npm run typecheck
npx expo export --platform android   # 번들이 만들어지는지 확인
```

## 규칙

웹 저장소 `CLAUDE.md`의 규칙을 따릅니다: `any` 금지, `console.log` 금지, `.env` 커밋 금지, 커밋은 `feat:` / `fix:` / `refactor:` / `docs:` 형식.

폰트 Pretendard는 SIL Open Font License 1.1입니다.
