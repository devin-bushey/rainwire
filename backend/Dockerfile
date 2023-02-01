# Build container
FROM node:18.12.1-alpine

# Update packages
RUN apk update

# Set the working directory to /app inside the container
WORKDIR /app

# Copy configs to /app folder
COPY package*.json ./
COPY tsconfig.json ./
# Copy source code to /app/src folder
COPY src /app/src

# Install packages
RUN npm ci
RUN npm run build

# Expose Port
EXPOSE 5000

CMD [ "node", "./dist/index.js" ]
