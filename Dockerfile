# Fetch docker image from Docker Hub.
FROM node:14

# Create working directory.
WORKDIR /application

# Copy the 'package.json' and 'package-lock.json' for deterministic builds.
COPY package*.json ./

# Install our application.
RUN npm ci --only=production

# Run migrations.
RUN npm run migrate

# Copy our installed API to our working directory.
COPY . ./

# Expose port and run the start script.
EXPOSE 3000
CMD ["npm", "start"]
