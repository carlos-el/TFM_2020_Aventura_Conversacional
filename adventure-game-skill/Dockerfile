FROM node:14-alpine

EXPOSE 3000

# Create dir and give permission to node user so we can install later
# Also create node_modules dir because node cant not create it itself
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

CMD node server.js