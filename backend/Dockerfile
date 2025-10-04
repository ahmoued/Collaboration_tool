FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS dev
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS prod
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production
RUN npm install -g concurrently
COPY --from=dev /app/dist ./dist

COPY --from=dev /app/package*.json ./

EXPOSE 4000
EXPOSE 1234
CMD ["npm", "run", "start:prod:all"]
