#!/bin/bash

# Frontend Start Script for create-learn-ui
# This script runs the pre-built frontend container

set -e

# Configuration
IMAGE_NAME="create-learn-ui"
CONTAINER_NAME="create-learn-ui"
PORT="8888"
API_URL="${NEXT_PUBLIC_API_URL:-http://localhost:8080}"

echo "========================================="
echo "Starting Create Learn UI (Frontend)"
echo "========================================="

# Check if .next folder exists
if [ ! -d ".next" ]; then
    echo "Error: .next folder not found!"
    echo "Please build the project first:"
    echo "  npm run build"
    exit 1
fi

# Check if container is already running
if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "Container ${CONTAINER_NAME} is already running"
    echo "Stopping existing container..."
    docker stop ${CONTAINER_NAME}
    docker rm ${CONTAINER_NAME}
fi

# Build the image
echo ""
echo "Building Docker image: ${IMAGE_NAME}..."
docker build -t ${IMAGE_NAME} .

if [ $? -ne 0 ]; then
    echo "Failed to build Docker image"
    exit 1
fi

# Run the container
echo ""
echo "Starting container: ${CONTAINER_NAME}..."
docker run -d \
    --name ${CONTAINER_NAME} \
    -p ${PORT}:8888 \
    -e NEXT_PUBLIC_API_URL="${API_URL}" \
    -e NODE_ENV=production \
    --restart unless-stopped \
    ${IMAGE_NAME}

if [ $? -ne 0 ]; then
    echo "Failed to start container"
    exit 1
fi

# Wait for container to be healthy
echo ""
echo "Waiting for container to be ready..."
sleep 3

# Check if container is running
if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo ""
    echo "========================================="
    echo "✓ Frontend started successfully!"
    echo "========================================="
    echo "Container Name: ${CONTAINER_NAME}"
    echo "Access URL: http://localhost:${PORT}"
    echo "API URL: ${API_URL}"
    echo "========================================="
else
    echo "Container failed to start"
    docker logs ${CONTAINER_NAME}
    exit 1
fi