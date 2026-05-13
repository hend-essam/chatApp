FROM node:20

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./ 

RUN npm install

COPY . .

RUN npm run build

ENV PORT=7860
EXPOSE 7860

CMD ["node", "dist/index.js"]