# Stage 0: Build React app
FROM node:20-alpine as build

# Install dependencies needed for canvas
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    pango-dev \
    giflib-dev \
    jpeg-dev \
    libpng-dev \
    && python3 -m ensurepip

WORKDIR /app

# Copy package.json and package-lock.json
COPY reactapp/package*.json ./

# Install npm dependencies
RUN npm install

# Copy React app source
COPY reactapp/ .

# Build React app
RUN npm run build

# Stage 1: Serve app with nginx
FROM nginx:alpine

# Copy built app from previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
