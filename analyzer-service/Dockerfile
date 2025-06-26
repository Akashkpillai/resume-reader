# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the app
COPY . .

# Build the app
RUN npm run build

# # Expose app port
# EXPOSE 3002

# Start the app
CMD ["npm", "run", "start:prod"]
