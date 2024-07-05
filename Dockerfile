# syntax=docker/dockerfile:1

FROM node:22-alpine AS base

WORKDIR /app

FROM base AS build

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

RUN npm run build

FROM base AS dev

RUN apk add --no-cache zsh shadow docker-cli docker-cli-compose docker-zsh-completion
RUN chsh -s /bin/zsh node

ENV PORT 4200
EXPOSE 4200

FROM nginx:alpine AS final

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/user-service-ui/browser /usr/share/nginx/html
