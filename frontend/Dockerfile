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

# Copy source files and ensure correct file permissions
COPY . .
RUN chmod -R 755 .

# Debug: Show directory structure and verify file existence
RUN echo "=== Listing HotelVoucher directory ===" && \
    ls -la src/components/HotelVoucher/ && \
    echo "=== Verifying specific files ===" && \
    test -f src/components/HotelVoucher/HotelVoucherList.tsx && echo "HotelVoucherList.tsx exists" && \
    test -f src/components/HotelVoucher/index.ts && echo "index.ts exists"

# Build the application
RUN npm run build

# Keep container running to serve files
CMD ["tail", "-f", "/dev/null"]
