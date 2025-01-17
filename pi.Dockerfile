FROM node:20.12.0-alpine3.19

COPY . .
RUN cd ./image-converter && npm i && npm run build

ENV PORT=80

ENTRYPOINT ["/bin/sh", "-c", "node ./image-converter/server.js"]
