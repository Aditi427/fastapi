# Stage 1: Build the React app
FROM node:18-alpine AS build-stage

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Use Railway's PORT environment variable
# Alpine nginx uses a different config location
RUN sed -i 's/80/${PORT}/g' /etc/nginx/conf.d/default.conf

# Expose the dynamic port
EXPOSE ${PORT}

# Start nginx (it will use the PORT we set)
CMD ["nginx", "-g", "daemon off;"]
