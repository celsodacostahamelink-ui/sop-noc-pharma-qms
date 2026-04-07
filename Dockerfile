FROM node:20-alpine
WORKDIR /app
COPY noc-qms-app/package*.json noc-qms-app/
RUN cd noc-qms-app && npm install
COPY noc-qms-app/ noc-qms-app/
RUN cd noc-qms-app && npm run build
EXPOSE 3001
CMD ["node", "noc-qms-app/server.cjs"]
