# Build container
FROM node:18.12.1-alpine

# Set the working directory to /app inside the container
WORKDIR /app

# Copy app files
COPY . ./

# Install packages
RUN npm ci

# Expose Port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]