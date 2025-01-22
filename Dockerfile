# FROM ghcr.io/nottgy/monk-mode/pi

FROM node:20.12.0-alpine3.19 AS frontend-stage

COPY ./pixelify-landing /
RUN npm i && npm run build

FROM nginx:stable-alpine3.17-slim

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=frontend-stage dist /usr/share/nginx/html
