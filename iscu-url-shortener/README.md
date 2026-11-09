# 클라우드 컴퓨팅 종합 실습: URL Shortener

교수님 과제 기준: https://github.com/alifewellspent/iscu_cloud_class/blob/main/assignment/README.md

## 기능
- POST /api/shorten: {"originalUrl":"https://example.com"} -> HTTP 201, {shortCode, shortUrl, originalUrl}
- 동일 URL 재요청 -> HTTP 200, 기존 shortCode
- URL 누락/공백 -> HTTP 400, MISSING_URL
- 잘못된 URL -> HTTP 400, INVALID_URL
- 자기 서비스 호스트 -> HTTP 400
- GET /{shortCode} -> HTTP 307, Location 원본 URL, Cache-Control no-store
- 없는 shortCode -> HTTP 404
- /admin, /api/stats: 인증 없으면 HTTP 401; /admin에 WWW-Authenticate: Basic

## 설치 및 배포 (처음 시작하는 학생용)
1. https://github.com 가입 후 New repository -> `iscu-url-shortener` 생성.
2. 이 폴더의 파일 전체를 저장소에 업로드 (Upload files). `.env.example`은 업로드해도 되지만 실제 비밀번호/토큰은 절대 올리지 마세요.
3. https://upstash.com 에서 Redis 데이터베이스 생성. REST URL과 REST TOKEN 확보.
4. https://vercel.com 가입 -> Add New Project -> GitHub 저장소 Import. Framework Preset은 Next.js.
5. Vercel 프로젝트 Settings -> Environment Variables에 아래 값 등록:
   - UPSTASH_REDIS_REST_URL: Upstash REST URL
   - UPSTASH_REDIS_REST_TOKEN: Upstash REST TOKEN
   - ADMIN_USERNAME: admin
   - ADMIN_PASSWORD: 본인만 아는 강한 비밀번호
   - PUBLIC_BASE_URL: 실제 배포 주소 (예: https://iscu-url-shortener-abc.vercel.app)
6. Production Deploy/Redeploy. 배포된 주소에서 URL 단축 기능 확인.
7. 교수님 `iscu_url_shortener_check.py` 다운로드 후 Python 3.10+에서:
   `python -m pip install requests`
   `python iscu_url_shortener_check.py --url https://본인프로젝트.vercel.app`
8. T01~T11 PASS 확인 후 GitHub 최종 push 및 Vercel Production 배포를 마무리하고, **학번 + Vercel URL**을 공지된 Google Form에 제출.

## 로컬 실행
`npm install` -> `.env.example`을 `.env.local`로 복사하고 실제 값 입력 -> `npm run dev` -> http://localhost:3000

## 주의
- GitHub에 `.env.local` 업로드 금지.
- 제출 마감 이후 교수님 채점 완료 전에는 코드 변경/재배포 금지.
- 이 코드는 평가 기준에 맞춰 작성되었으나 실제 Vercel/Redis 환경에서 교수님 자동 점검 PASS 여부는 직접 확인해야 합니다.
