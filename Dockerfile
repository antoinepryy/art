# Stage 1: Build the application
# Use a Node.js image to build the app
FROM node:latest as build

# Set the working directory in the Docker container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application
# Use a lightweight Node image to serve the app
FROM node:alpine

# Set the working directory in the Docker container
WORKDIR /app

# Copy built assets from the build stage
COPY --from=build /app/dist ./dist

# Install a server to serve the app, for example, serve
RUN npm install -g serve

# The port the app runs on
EXPOSE 3000

# Command to run the app using serve
CMD ["serve", "-s", "dist", "-l", "3000"]
