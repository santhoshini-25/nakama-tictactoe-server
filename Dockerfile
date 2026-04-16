# STEP 1: Build the TypeScript code
FROM node:20-alpine AS builder

WORKDIR /backend

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code and compile TypeScript
COPY . .
RUN npx tsc

# STEP 2: Run Nakama and copy the built files
FROM heroiclabs/nakama:3.21.1

# Copy the compiled JS from the builder stage to Nakama's modules folder
COPY --from=builder /backend/build/*.js /nakama/data/modules/