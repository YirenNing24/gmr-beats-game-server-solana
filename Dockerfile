# Use the official Bun image as a base image
FROM oven/bun:latest

# Set the working directory
WORKDIR /app

# Copy only package files first to leverage Docker's layer caching
COPY package.json ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Expose the desired port (replace with your app's actual port if needed)
EXPOSE 8085

# Use a specific production script for deployment if applicable
CMD ["bun", "dev"]
