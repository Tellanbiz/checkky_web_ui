# syntax=docker/dockerfile:1.4

FROM node:24-alpine AS builder

WORKDIR /app
COPY . .

ARG PM=npm

# Use a separate RUN instruction for package manager installation
# to make the shell commands more robust.
RUN npm install --legacy-peer-deps;
RUN npm run build;

FROM node:24-alpine AS runner

WORKDIR /app

# The rest of your Dockerfile remains the same as it's not related to the shell error.
RUN addgroup -g 1001 -S nextjs && adduser -S nextjs -u 1001 -G nextjs

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next

RUN --mount=type=bind,from=builder,source=/app,target=/src \
    if [ -f /src/next.config.js ]; then cp /src/next.config.js .; fi && \
    if [ -d /src/public ]; then cp -r /src/public ./; fi

RUN if [ -d "./.next/standalone" ]; then \
    mkdir -p standalone && \
    cp -a .next/standalone/* standalone/; \
    fi

ENV PORT=8080

CMD sh -c 'if [ -f ./standalone/server.js ]; then node ./standalone/server.js; else node_modules/.bin/next start; fi'

EXPOSE 8080
USER nextjs