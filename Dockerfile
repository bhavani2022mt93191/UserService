FROM node:lts-alpine
ENV NODE_ENV=development
ENV USER_SERVICE_PORT=3002
ENV GATEWAY_SERVICE='http://apigateway:3001'
ENV JWT_SECRET ="TEST_JWT_SECRET_KEY"
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install && mv node_modules ../
COPY . .
EXPOSE $USER_SERVICE_PORT
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]
