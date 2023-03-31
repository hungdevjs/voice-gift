# Use an official Node.js runtime as a parent image
FROM node:18.12.1
WORKDIR /app

COPY ./package*.json ./
COPY ./voice-gift.json ./
COPY ./yarn.lock ./

RUN yarn
COPY ./ ./

EXPOSE 8888

# Start the Express server
CMD ["yarn", "start-production"]
