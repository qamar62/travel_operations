FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Add build argument
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Copy package files first
COPY package.json package-lock.json ./

# Install dependencies with exact versions
RUN npm ci --legacy-peer-deps

# Copy source files
COPY . .

# Debug: Show directory structure and file contents
RUN echo "=== Listing src/components/ ===" && \
    ls -la src/components/ && \
    echo "=== Listing src/components/HotelVoucher/ ===" && \
    ls -la src/components/HotelVoucher/ && \
    echo "=== Content of index.ts ===" && \
    cat src/components/HotelVoucher/index.ts && \
    echo "=== Content of App.tsx ===" && \
    cat src/App.tsx

# Set production environment
ENV NODE_ENV=production

# Build application with verbose logging
RUN npm run build --verbose

FROM nginx:alpine

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]