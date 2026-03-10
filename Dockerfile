
FROM node:22-alpine AS base

RUN npm install -g @quasar/cli

WORKDIR /app

COPY package*.json ./
FROM base AS development
COPY . .
RUN npm install --no-audit

EXPOSE 9000

CMD ["quasar", "dev", "--host", "0.0.0.0", "--port", "9000"]


FROM base AS builder
COPY . .
RUN npm ci
ARG VITE_ADMIN_URL
ENV VITE_ADMIN_URL=$VITE_ADMIN_URL

RUN quasar build

FROM httpd:2.4-alpine AS production

LABEL maintainer="nautik@nautiks.app" \
      version="1.0" \
      description="Nautik Frontend Quasar - Admin - Apache"
COPY --from=builder /app/dist/spa /usr/local/apache2/htdocs/
RUN sed -i \
    -e 's/^#\(LoadModule .*mod_rewrite.so\)/\1/' \
    -e 's/^#\(LoadModule .*mod_deflate.so\)/\1/' \
    -e 's/^#\(LoadModule .*mod_expires.so\)/\1/' \
    -e 's/^#\(LoadModule .*mod_headers.so\)/\1/' \
    /usr/local/apache2/conf/httpd.conf

RUN echo "ServerTokens Prod" >> /usr/local/apache2/conf/httpd.conf && \
    echo "ServerSignature Off" >> /usr/local/apache2/conf/httpd.conf

RUN echo '<Directory "/usr/local/apache2/htdocs">' > /usr/local/apache2/conf/extra/spa.conf && \
    echo '    Options -Indexes +FollowSymLinks' >> /usr/local/apache2/conf/extra/spa.conf && \
    echo '    AllowOverride All' >> /usr/local/apache2/conf/extra/spa.conf && \
    echo '    Require all granted' >> /usr/local/apache2/conf/extra/spa.conf && \
    echo '    ' >> /usr/local/apache2/conf/extra/spa.conf && \
    echo '    # SPA routing - redirigir todo al index.html' >> /usr/local/apache2/conf/extra/spa.conf && \
    echo '    RewriteEngine On' >> /usr/local/apache2/conf/extra/spa.conf && \
    echo '    RewriteBase /' >> /usr/local/apache2/conf/extra/spa.conf && \
    echo '    RewriteRule ^index\.html$ - [L]' >> /usr/local/apache2/conf/extra/spa.conf && \
    echo '    RewriteCond %{REQUEST_FILENAME} !-f' >> /usr/local/apache2/conf/extra/spa.conf && \
    echo '    RewriteCond %{REQUEST_FILENAME} !-d' >> /usr/local/apache2/conf/extra/spa.conf && \
    echo '    RewriteRule . /index.html [L]' >> /usr/local/apache2/conf/extra/spa.conf && \
    echo '    ' >> /usr/local/apache2/conf/extra/spa.conf && \
    echo '    # Security headers' >> /usr/local/apache2/conf/extra/spa.conf && \
    echo '    Header always set X-Frame-Options "SAMEORIGIN"' >> /usr/local/apache2/conf/extra/spa.conf && \
    echo '    Header always set X-Content-Type-Options "nosniff"' >> /usr/local/apache2/conf/extra/spa.conf && \
    echo '    Header always set X-XSS-Protection "1; mode=block"' >> /usr/local/apache2/conf/extra/spa.conf && \
    echo '</Directory>' >> /usr/local/apache2/conf/extra/spa.conf

RUN echo "Include conf/extra/spa.conf" >> /usr/local/apache2/conf/httpd.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["httpd-foreground"]