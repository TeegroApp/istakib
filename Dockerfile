FROM node:20-alpine

WORKDIR /app

# Server bağımlılıkları
COPY server/package*.json ./server/
RUN npm install --prefix server --production

# Client bağımlılıkları
COPY client/package*.json ./client/
RUN npm install --prefix client

# Kaynak kodları kopyala
COPY server/ ./server/
COPY client/ ./client/

# React build
RUN cd client && ./node_modules/.bin/vite build

EXPOSE 3001

CMD ["node", "server/index.js"]
