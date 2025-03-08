# ================================
# -----------------------------------------Stage 1: Build the Client---------------------------------------------
# ================================
FROM node:18 AS frontend-builder
WORKDIR /frontend

# Copy package files and install dependencies
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install --force

# Copy the client source code
COPY frontend/ .

# Build the client (output to /frontend/dist)
RUN npm run build

# ================================
# Stage 2: Build the Server
# ================================
FROM node:18 AS backend-builder
WORKDIR /backend

# Copy package files and install dependencies
COPY backend/package.json backend/package-lock.json* ./
RUN npm install

# Copy the rest of the server code
COPY backend/ .

# Compile TypeScript files (output to /backend/dist)
RUN npm run build

# ================================
# Stage 3: Production Image (Integrated)
# ================================
FROM node:18
WORKDIR /app

# Copy the backend files
COPY --from=backend-builder /backend/dist ./dist
COPY --from=backend-builder /backend/node_modules ./node_modules
COPY backend/.env .env

# Copy the built client artifacts into the static directory
COPY --from=frontend-builder /frontend/dist ./dist/static

# Set environment variables
ENV NODE_ENV=production \
    PORT=3001

# Expose the port
EXPOSE 3001

# Add healthcheck to ensure container stays running
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

# Run the compiled JavaScript file
CMD ["node", "dist/server.js"]