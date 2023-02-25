FROM node:latest as build
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .
ARG DB_URI_COMPOSE
ARG PORT
ARG JWT_SECRET
ENV DB_URI_COMPOSE=$DB_URI_COMPOSE
ENV PORT=$PORT
ENV JWT_SECRET=$JWT_SECRET
CMD ["npm","run","start"]
EXPOSE 4000