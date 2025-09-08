
# Use Node 18 (or upgrade if needed)
FROM node:18


WORKDIR /app


# Install dependencies
COPY package*.json ./
RUN npm install


# Copy application source code
COPY . .



# Build TypeScript after all source is copied and verify output
RUN npm run build && ls -l dist/src && test -f dist/src/server.js

# Expose the port your backend runs on (e.g., 5000)
EXPOSE ${BACK_END_PORT}


# Command to start the server
CMD ["npm", "start"]