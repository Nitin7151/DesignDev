#!/bin/sh
# Create MongoDB data directory (if not already created)
mkdir -p /data/db

# Start MongoDB in the background (bind to all IPs)
mongod --dbpath /data/db --bind_ip_all &

# Optionally wait a few seconds for MongoDB to initialize
sleep 3

# Start the Node.js server (which serves your API and static frontend)
exec node backend/dist/server.js
