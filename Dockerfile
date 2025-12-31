# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and lockfile
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the React Frontend
RUN npm run build

# Expose the port the app runs on
# Cloud Run sets the PORT env variable automatically, defaulting to 8080
ENV PORT=8080
EXPOSE 8080

# Start the server
CMD ["npm", "start"]
