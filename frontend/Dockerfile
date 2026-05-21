# ==========================================
# BUILD STAGE
# ==========================================
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# ==========================================
# RUNTIME STAGE
# ==========================================
FROM nginx:1.27-alpine

# Install htpasswd for basic auth + gettext for envsubst
RUN apk add --no-cache apache2-utils gettext

ARG AUTH_USERNAME
ARG AUTH_PASSWORD

# Create htpasswd file for basic auth (default credentials if not provided)
RUN htpasswd -bc /etc/nginx/.htpasswd "${AUTH_USERNAME:-Hemanth}" "${AUTH_PASSWORD:-Hemanth@123}"

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config template (uses ${BACKEND_URL} placeholder)
COPY nginx.conf /etc/nginx/conf.d/default.conf.template

# Startup script: substitute BACKEND_URL env var into nginx config, then start nginx
# Only BACKEND_URL is substituted — nginx variables like $host are left unchanged
RUN { \
    echo '#!/bin/sh'; \
    echo 'BACKEND_URL="${BACKEND_URL:-http://backend:8080}"'; \
    echo 'export BACKEND_URL'; \
    echo 'envsubst '\''${BACKEND_URL}'\'' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf'; \
    echo 'nginx -g "daemon off;"'; \
} > /entrypoint.sh && chmod +x /entrypoint.sh

# Cloud Run expects container to listen on $PORT (default 8080)
EXPOSE 8080

ENTRYPOINT ["/entrypoint.sh"]
