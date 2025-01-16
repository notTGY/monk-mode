FROM node:20.12.0-alpine3.19

COPY . /app
RUN cd /app/image-converter && npm i && npm run build

ENV PORT=80

ENTRYPOINT ["/bin/sh", "-c", "node /app/image-converter/server.js"]
