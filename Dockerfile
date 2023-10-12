FROM node:16-alpine
ENV NODE_ENV=production
EXPOSE 8080
WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm install --production && npm install -g nodemon

COPY . .

CMD ["nodemon", "server.js"]
