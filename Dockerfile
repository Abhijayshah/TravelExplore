# Use the official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Create a non-root user to run the application
RUN addgroup -g 1001 -S nodejs
RUN adduser -S travelapp -u 1001

# Copy the rest of the application code
COPY --chown=travelapp:nodejs . .

# Create necessary directories
RUN mkdir -p /app/logs && chown -R travelapp:nodejs /app/logs
RUN mkdir -p /app/uploads && chown -R travelapp:nodejs /app/uploads

# Remove unnecessary files
RUN rm -rf .git .gitignore README.md interview_qa.md .env.example

# Switch to non-root user
USER travelapp

# Expose the port the app runs on
EXPOSE 3000

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start the application
CMD ["npm", "start"]