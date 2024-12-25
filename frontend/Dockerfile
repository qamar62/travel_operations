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

# Debug: Show directory structure and file contents and check file casing
RUN echo "=== Listing src/components/ ===" && \
    ls -la src/components/HotelVoucher/ | sort && \
