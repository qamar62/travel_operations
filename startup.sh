#!/bin/bash

# Exit on any error
set -e

echo "Starting setup script for Docker and Docker Compose on Ubuntu 24.04..."

# Update system
echo "Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install prerequisites
echo "Installing prerequisites..."
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    software-properties-common

# Add Docker's official GPG key
echo "Adding Docker's official GPG key..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up Docker repository
echo "Setting up Docker repository..."
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update apt package index
echo "Updating package index..."
sudo apt-get update

# Install Docker Engine
echo "Installing Docker Engine..."
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add current user to docker group
echo "Adding current user to docker group..."
sudo usermod -aG docker $USER

# Start and enable Docker service
echo "Starting Docker service..."
sudo systemctl start docker
sudo systemctl enable docker

# Install Docker Compose
echo "Docker Compose is included with Docker Engine..."

# Verify installations
echo "Verifying installations..."
docker --version
docker compose version

# Print success message
echo "Installation completed successfully!"
echo "Please log out and log back in for group changes to take effect."
echo "You can verify the installation by running: docker run hello-world"

# Create docker network if it doesn't exist
echo "Creating docker network..."
docker network create app-network 2>/dev/null || true

# Set permissions for the application directory
echo "Setting up application permissions..."
APP_DIR="$(pwd)"
sudo chown -R $USER:$USER "$APP_DIR"
sudo chmod -R 755 "$APP_DIR"

echo "Setup complete! You can now use Docker and Docker Compose."
echo "To start your application, run: docker compose up --build"
