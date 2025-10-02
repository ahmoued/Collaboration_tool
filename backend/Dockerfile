FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
FROM base AS dev
RUN npm install
RUN npm install -g tsx
COPY . . 
FROM base AS prod
RUN npm ci --only=production
COPY . .
EXPOSE 4000
EXPOSE 1234
CMD ["npm", "run", "dev:all"]