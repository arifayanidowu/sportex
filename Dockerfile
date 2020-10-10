FROM node:12.18-alpine
ENV NODE_ENV production
WORKDIR /
COPY ["yarn.lock", "package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 5000
ADD docker-entrypoint.sh /usr/local/bin/
CMD ["npm", "start"]
