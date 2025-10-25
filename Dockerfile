FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy pre-built .next folder
COPY .next ./.next

# Copy public assets
COPY public ./public

# Expose port
EXPOSE 8888

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8888
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-http://localhost:8080}

# Start the app
CMD ["npm", "start"]