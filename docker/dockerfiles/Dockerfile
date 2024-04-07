FROM node:lts-alpine3.19

# Create app directory
WORKDIR /usr/src/app

# update alpine

RUN apk update
RUN apk upgrade
# Install app dependencies
COPY package*.json ./
COPY generate-json*.json ./
RUN npm install \
    && npm install -g serve \
    && npm run build \
    && rm -fr node_modules
# /photos  /Users/royb/Desktop/HTML<>CSS<>JS/RN-Sales-project/assets
# Bundle app source /json/images  /Users/royb/Desktop/HTML<>CSS<>JS/RN-Sales-project/jsonfiles/
COPY . .

CMD [ "npm", "start" ]

EXPOSE 3001