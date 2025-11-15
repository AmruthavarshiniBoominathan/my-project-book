# Stage 1: Build the frontend
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy frontend package files
COPY reactapp/package.json reactapp/package-lock.json ./

# Install dependencies
RUN npm install

# Copy all frontend source files
COPY reactapp/ ./

# Build the frontend
RUN npm run build

# Stage 2: Serve the static files with Nginx
FROM nginx:alpine

# Copy built files from previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
