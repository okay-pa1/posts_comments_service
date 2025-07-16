# Base image
FROM node:18

# Working directory inside container
WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Expose app port
EXPOSE 8383

# Run the app
CMD ["npm", "start"]
