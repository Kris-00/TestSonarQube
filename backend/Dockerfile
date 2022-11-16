# Install node
FROM node:19-alpine

# Create /usr/src/app folder in the docker VM
# Create app directory
WORKDIR /usr/app

# COPY command executes on the HOST machine
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY tsconfig.json ./

COPY . .

RUN ls -a
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

EXPOSE 4001

CMD ["npm", "start"]