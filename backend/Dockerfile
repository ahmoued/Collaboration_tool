FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS build
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS prod
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=build /app/dist ./dist

COPY --from=build /app/package*.json ./

EXPOSE 4000
EXPOSE 1234
CMD ["node", "dist/index.js"]
