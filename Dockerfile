# Node.js 환경 설정
FROM node:18

# 작업 디렉토리 설정
WORKDIR /app

# package.json 및 package-lock.json 복사 후 의존성 설치
COPY package.json package-lock.json ./
RUN npm install

# 프로젝트 코드 복사
COPY . .

# 개발 서버 실행 (파일 변경 시 자동 반영됨)
CMD ["npm", "start"]
