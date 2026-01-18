# How to run the project

## 1) Install prerequisites
- Node.js LTS
- WebStorm or IntelliJ (optional)
- Git (optional but recommended)

## 2) Create .env
Copy `.env.example` to `.env` and set MONGODB_URI.

## 3) Install dependencies
npm install

## 4) Run services (4 terminals)
npm run dev:users
npm run dev:costs
npm run dev:logs
npm run dev:admin

## 5) Run demo
Open `demo.http` and run requests.

## 6) Run tests
npm test
