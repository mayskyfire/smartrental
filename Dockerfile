FROM node:22-slim

# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (needed for build)
RUN npm ci

# Copy source code
COPY . .

# Copy .env.example to .env
# RUN cp .env.example .env

# Generate Prisma client
RUN npx prisma generate

# Build application
RUN npm run build

# Keep Prisma CLI for runtime
# RUN npm prune --production

# Expose ports
EXPOSE 3000
EXPOSE 443

# Copy and set entrypoint
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Start application
ENTRYPOINT ["docker-entrypoint.sh"]