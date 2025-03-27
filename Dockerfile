# ===========================
# 1️⃣ Build Stage (npm)
# ===========================
FROM node:22.18.0-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production

# ===========================
# 2️⃣ Runtime Stage (Node.js)
# ===========================
FROM node:22.18.0-alpine AS runtime

WORKDIR /app

# Copy built output & production dependencies only
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .

EXPOSE 3000

# Run with Node.js
CMD ["node", "build"]
