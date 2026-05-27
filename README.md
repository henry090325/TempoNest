# TempoNest PWA

이 폴더는 TempoNest를 설치형 웹앱(PWA)으로 실행하기 위한 패키지입니다.

## 구성
- `index.html`: TempoNest 본체
- `manifest.webmanifest`: 앱 이름, 아이콘, 설치 정보
- `sw.js`: 오프라인 캐시용 서비스 워커
- `icons/`: 앱 아이콘 및 maskable icon
- `screenshots/`: PWA 스크린샷 메타데이터용 이미지

## 실행 방법
1. 이 폴더를 HTTPS 서버에 올립니다. GitHub Pages, Netlify, Vercel, Cloudflare Pages 모두 가능합니다.
2. 로컬 테스트는 아래처럼 실행할 수 있습니다.

```bash
cd temponest_pwa
python3 -m http.server 8080
```

그 뒤 `http://localhost:8080`으로 접속하면 됩니다. localhost는 PWA 테스트가 가능합니다.

## 설치 방법
- Android/Chrome: 주소창 또는 화면의 `앱 설치` 버튼 사용
- iPhone/iPad/Safari: 공유 버튼 → `홈 화면에 추가`

## 참고
날씨 API는 온라인 연결이 필요합니다. 앱 화면 자체와 저장된 할 일/설정은 서비스 워커와 localStorage 덕분에 기본적으로 오프라인에서도 열립니다.
