#!/bin/bash

# Ensure script stops on first error
set -e

echo "🚀 Starting deployment process..."

# Pull latest changes if deploying from a repository
if [ -d ".git" ]; then
  echo "📥 Pulling latest changes from git repository..."
  git pull
fi

# Build and start the containers
echo "🏗️ Building and starting Docker containers..."
docker-compose down
docker-compose build --no-cache
docker-compose up -d

echo "🧹 Cleaning up unused Docker resources..."
docker system prune -f

echo "✅ Deployment completed successfully!"
echo "🌐 Your application should now be available at http://your-server-ip"
