# ================================
# Stage 1: Build the Client
# ================================
FROM node:18-alpine AS frontend-builder
WORKDIR /frontend

# Copy package files and install dependencies
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install --force

# Copy the client source code and .env file
COPY frontend/ .
# Build the client (output to /frontend/dist)
RUN npm run build

# ================================
# Stage 2: Build the Server
# ================================
FROM node:18-alpine AS backend-builder
WORKDIR /backend

# Copy package files and install dependencies
COPY backend/package.json backend/package-lock.json* ./
RUN npm install

# Copy the rest of the server code and .env file
COPY backend/ .
COPY backend/.env .env

# Compile TypeScript files (output to /backend/dist)
RUN npm run build

# ================================
# Stage 3: Production Image (Integrated)
# ================================
FROM node:18-alpine
WORKDIR /app/backend

# Copy the built client artifacts into the backend's public folder
COPY --from=frontend-builder /frontend/dist ./dist/public

# Copy only the compiled backend code (CommonJS JS files)
COPY --from=backend-builder /backend/dist ./dist
COPY --from=backend-builder /backend/node_modules ./node_modules
COPY --from=backend-builder /backend/.env .env

# Set environment variables
ENV NODE_ENV=production \
    PORT=3001

# Expose the port
EXPOSE 3001

# Run the compiled JavaScript file
CMD ["node", "dist/server.js"]