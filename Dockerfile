# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package files first (for better caching)
COPY package.json package-lock.json ./

# Install ALL dependencies (including sequelize-cli for migrations)
RUN npm ci

# Copy rest of the project
COPY . .

# Expose the port your app runs on
EXPOSE 5000

# Run migrations then start the server
# Uses env vars: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
CMD ["sh", "-c", "npx sequelize-cli db:migrate && node src/server.js"]
