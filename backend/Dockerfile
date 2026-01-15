FROM node:20-alpine

# Install Playwright system dependencies as root (we are root in Docker)
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    font-noto-emoji \
    && rm -rf /var/cache/apk/*

# Set Playwright to use system Chromium (smaller image size, no download needed)
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=true

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install npm dependencies (without Playwright browser download)
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build application
RUN npm run build

# Expose port (Render uses PORT env var, default to 10000)
EXPOSE 10000

# Start application
CMD ["npm", "run", "start:prod"]