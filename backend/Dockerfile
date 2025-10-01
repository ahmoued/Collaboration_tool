FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install -g tsx
COPY . .
RUN ls -la .env || echo ".env file not found!"
EXPOSE 4000
EXPOSE 1234
CMD ["npm", "run", "dev:all"]