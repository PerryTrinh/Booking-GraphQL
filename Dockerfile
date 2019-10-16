FROM node:8

# Create app directory and install dependencies
WORKDIR /app
COPY package.json /app
RUN npm install

# Copy source code and run
COPY . /app
EXPOSE 3000
CMD ["npm", "start"]

