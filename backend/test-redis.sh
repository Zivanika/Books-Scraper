#!/bin/bash

# Redis Connectivity Test Script
# Tests Redis connection using redis-cli or Node.js

BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Redis Connectivity Test${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found!${NC}"
    exit 1
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

echo -e "${YELLOW}Testing Redis connection...${NC}\n"

# Method 1: Try redis-cli (if installed)
if command -v redis-cli &> /dev/null; then
    echo -e "${BLUE}Method 1: Using redis-cli${NC}"
    
    if [ -n "$REDIS_URL" ]; then
        # Extract host and port from REDIS_URL
        REDIS_HOST_PORT=$(echo $REDIS_URL | sed -E 's|rediss?://[^:]+:([^@]+)@([^:]+):([0-9]+).*|\2:\3|')
        REDIS_PASSWORD=$(echo $REDIS_URL | sed -E 's|rediss?://[^:]+:([^@]+)@.*|\1|')
        
        if redis-cli -h $(echo $REDIS_HOST_PORT | cut -d: -f1) \
                     -p $(echo $REDIS_HOST_PORT | cut -d: -f2) \
                     -a "$REDIS_PASSWORD" \
                     ping 2>/dev/null | grep -q PONG; then
            echo -e "${GREEN}✅ Redis is accessible via redis-cli!${NC}\n"
            exit 0
        fi
    elif [ -n "$REDIS_HOST" ] && [ -n "$REDIS_PORT" ]; then
        if redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" ping 2>/dev/null | grep -q PONG; then
            echo -e "${GREEN}✅ Redis is accessible via redis-cli!${NC}\n"
            exit 0
        fi
    fi
fi

# Method 2: Use Node.js script
if command -v node &> /dev/null; then
    echo -e "${BLUE}Method 2: Using Node.js${NC}"
    
    if [ -f "test-redis.js" ]; then
        node test-redis.js
        exit $?
    else
        echo -e "${YELLOW}⚠️  test-redis.js not found. Creating it...${NC}"
    fi
fi

# Method 3: Try curl (for Upstash REST API)
if [ -n "$REDIS_URL" ] && command -v curl &> /dev/null; then
    echo -e "${BLUE}Method 3: Testing Upstash REST API${NC}"
    
    # Upstash provides REST API endpoint
    UPSTASH_REST_URL=$(echo $REDIS_URL | sed -E 's|rediss?://[^@]+@([^:]+):[0-9]+|https://\1|')
    
    if curl -s "$UPSTASH_REST_URL/ping" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Upstash REST API is accessible!${NC}\n"
        exit 0
    fi
fi

echo -e "${RED}❌ Could not test Redis connection${NC}"
echo -e "${YELLOW}Please install redis-cli or ensure Node.js is available${NC}\n"
exit 1
