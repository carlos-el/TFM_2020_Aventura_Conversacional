FROM node:14-alpine

EXPOSE 4000

# Create dir and give permission to node user so we can install later
RUN mkdir -p /home/node/app \
&& chown -R node:node /home/node/app

# Change workdir
WORKDIR /home/node/app
# Copy package-json file
COPY package.json ./
# Use node user
USER node
# Install project dependencies
RUN npm install --production
# Copy project code with the appropiate permissions
COPY --chown=node:node . .

CMD npm start