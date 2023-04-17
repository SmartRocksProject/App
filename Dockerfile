# Use an official Node.js runtime as a parent image
FROM node:latest

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Set the registry for @buf
RUN npm config set @buf:registry https://buf.build/gen/npm/v1

# Run npm install to install the app's dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Set the environment variable to indicate that the app is running in a container
ENV DOCKER=true

# Expose the port that the app will run on
EXPOSE 3000

# Start the app by running the npm start command
CMD ["npm", "start"]
