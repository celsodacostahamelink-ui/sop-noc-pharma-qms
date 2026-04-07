FROM node:20-alpine
WORKDIR /app/noc-qms-app
COPY noc-qms-app/package*.json ./
RUN npm install
COPY noc-qms-app/ ./
RUN npm run build
EXPOSE 3001
CMD ["node", "server.cjs"]
