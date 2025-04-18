# syntax=docker/dockerfile:1

FROM node:20.17.0-alpine as base

RUN echo "@edge http://dl-cdn.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories \
    && echo "@edgecommunity http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories

RUN apk add --no-cache \
    chromium

RUN rm -rf /var/cache/apk/*

ENV CHROME_BIN=/usr/bin/chromium-browser \
    CHROME_PATH=/usr/lib/chromium/ \
    CHROMIUM_FLAGS="--disable-software-rasterizer --disable-dev-shm-usage"


FROM base as deps
ENV PNPM_HOME="/pnpm" \
    PATH="$PNPM_HOME:$PATH"

RUN npm install -g corepack
RUN corepack enable

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile


FROM deps as app
LABEL MAINTAINER=xxamxx
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . /app
RUN npm run build

EXPOSE 3000
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium"
CMD ["node", "./dist/bootstrap.js"]
