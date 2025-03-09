# Use a lightweight Node.js image
FROM node:18-alpine  

# Set the working directory
WORKDIR /app  

# Copy package.json and yarn.lock for dependency caching
COPY package.json yarn.lock ./  

# Install dependencies
RUN yarn  

# Copy the rest of the project files
COPY . .  

# Generate Prisma Client
RUN yarn prisma generate

# Build Next.js
RUN yarn build

# Expose the Next.js port
EXPOSE 3000  

# Set the user to 'node' for security
USER node  

# Start the container (migrations and seeding are executed before starting the server)
CMD ["sh", "-c", "yarn prisma migrate deploy && node scripts/seed.js && yarn dev"]
