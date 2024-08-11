FROM node:22.5.0-bookworm-slim
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "./"]
RUN npm install --production --silent \
    && mkdir -p /app/node_modules/.cache \
    && chmod -R 777 /app/node_modules/.cache
COPY . .
EXPOSE 3000
USER node
ENTRYPOINT ["npm", "start"]
