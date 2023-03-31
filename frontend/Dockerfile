FROM node:18.12.1 as build

WORKDIR /app
COPY ./package*.json ./
COPY ./yarn.lock ./
RUN yarn
COPY ./ ./

RUN yarn build

EXPOSE 3000

CMD ["yarn", "serve"]
