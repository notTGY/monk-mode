FROM node:20.12.0-alpine3.19

COPY ./image-converter /app
RUN cd /app && npm i && npm run build

ENV PORT=80

ENTRYPOINT ["/bin/sh", "-c", "node /app/server.js"]
