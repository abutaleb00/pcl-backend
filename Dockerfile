# Step 1: Use an official Node.js runtime as the base image
FROM node:20-alpine

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json first 
# This leverages Docker's cache to speed up builds
COPY package*.json ./

# Step 4: Install dependencies
# 'npm ci' is better for production builds
RUN npm install

# Step 5: Copy the rest of your application code
COPY . .

# Step 6: Expose the port your app runs on (e.g., 5000)
EXPOSE 5000

# Step 7: Define the command to run your app
CMD ["node", "src/server.js"]