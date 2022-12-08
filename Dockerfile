# Choose the node image
FROM node:16.15.1-alpine

# Set a work directory to container
WORKDIR /home/rtaengenheiros_api

# COPY package.json
COPY package.json .

# COPY prisma folder
COPY prisma ./prisma/

# COPY yarn.lock
COPY yarn.lock .

# COPY ENV variable
COPY .env ./

# COPY tsconfig.json file
COPY tsconfig.json ./

# Installing dependencies
RUN yarn

# COPY all folder to container
COPY . .

# Execute command to start application
CMD ["yarn", "start:dev"]
