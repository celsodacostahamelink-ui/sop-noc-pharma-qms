FROM node:20-alpine
WORKDIR /app/noc-qms-app
COPY noc-qms-app/package*.json ./
RUN npm install --no-cache
COPY noc-qms-app/ ./
RUN npm run build
ARG CACHEBUST=1
EXPOSE 3001
CMD ["node", "server.cjs"]
