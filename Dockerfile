# ================================================
# Stage 1: Build the React Frontend
# ================================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app

# Copy root monorepo config
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install workspace dependencies
RUN npm ci

# Copy frontend source and build static assets
COPY frontend/ ./frontend/
RUN npm run build --prefix frontend

# ================================================
# Stage 2: Create the Unified Production Container
# ================================================
FROM node:20-alpine AS production
WORKDIR /app

# Configure environmental variables for production
ENV NODE_ENV=production
ENV PORT=8080

# Setup the backend service
COPY package*.json ./
COPY backend/package*.json ./backend/
RUN npm ci --omit=dev

# Copy backend source
COPY backend/ ./backend/

# Copy datasets directory (JSON database fallback data)
COPY datasets/ ./datasets/

# Copy built frontend assets from builder stage
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose HTTP port
EXPOSE 8080

# Start server
CMD ["npm", "start", "--prefix", "backend"]
