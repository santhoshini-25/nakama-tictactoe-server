# STEP 1: Build the TypeScript code
FROM node:20-alpine AS builder

# Add git so npm can download the heroiclabs logic
RUN apk add --no-cache git

WORKDIR /backend

COPY package*.json ./

# This will now work because Git is installed
RUN npx tsc --module ESNext --target ESNext

COPY . .

# Ensure typescript is used to build
RUN npx tsc

# STEP 2: Run Nakama
FROM heroiclabs/nakama:3.21.1

COPY --from=builder /backend/build/*.js /nakama/data/modules/