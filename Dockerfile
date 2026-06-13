FROM node:20-alpine

WORKDIR /app

# Server bağımlılıkları
COPY server/package*.json ./server/
RUN npm install --prefix server --omit=dev

# Client bağımlılıkları
COPY client/package*.json ./client/
RUN npm install --prefix client

# Tüm kaynak kopyala
COPY server/ ./server/
COPY client/ ./client/

# Client build (WORKDIR ile doğru dizinde çalıştır)
WORKDIR /app/client
RUN node_modules/.bin/vite build

WORKDIR /app
EXPOSE 3001
CMD ["node", "server/index.js"]
