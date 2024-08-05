FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3000
USER node
CMD ["npm", "start"]
