FROM node:8

# Create app directory and install dependencies
WORKDIR /app
COPY package.json .
RUN npm install

# Copy source code and run
COPY . .
EXPOSE 8000
CMD ["npm", "start"]

