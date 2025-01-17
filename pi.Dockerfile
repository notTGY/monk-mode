FROM node:20.12.0-alpine3.19 AS frontend-stage

COPY . /
RUN cd /image-converter && npm i && npm run build

# Build the application from source
FROM golang:1.23.3 AS build-stage

WORKDIR /app

COPY . .
RUN go mod download

COPY --from=frontend-stage /image-converter/dist /app/image-converter/dist
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/server .

# Deploy the application binary into a lean image
FROM alpine:3.19.4 AS build-release-stage

WORKDIR /

COPY --from=build-stage /app/server /app/server

ENV PORT=80

ENTRYPOINT ["/bin/sh", "-c", "cd /app && ./server"]
