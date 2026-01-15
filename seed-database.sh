#!/bin/bash

# Database Seeding Script for Books Scraper
# This script populates the database with scraped data from World of Books

API_URL="http://localhost:8000"
BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Books Scraper - Database Seeding${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check if API is running
echo -e "${YELLOW}Checking if API is running...${NC}"
if ! curl -s "$API_URL/api/v1/products" > /dev/null 2>&1; then
    echo -e "${RED}❌ API is not running at $API_URL${NC}"
    echo -e "${YELLOW}Please start the backend first:${NC}"
    echo -e "  cd backend && npm run start:dev\n"
    exit 1
fi
echo -e "${GREEN}✓ API is running${NC}\n"

# Check if database is already populated
PRODUCT_COUNT=$(curl -s "$API_URL/api/v1/products?limit=1" | jq -r '.meta.total')
if [ "$PRODUCT_COUNT" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Database already has $PRODUCT_COUNT products${NC}"
    read -p "Do you want to scrape more data anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}Seeding cancelled.${NC}"
        exit 0
    fi
fi

echo -e "${GREEN}Starting database seeding...${NC}\n"

# Option 1: Quick seed (recommended)
echo -e "${YELLOW}Choose seeding method:${NC}"
echo -e "  ${GREEN}1)${NC} Quick Seed (Recommended) - One command to seed everything"
echo -e "  ${GREEN}2)${NC} Manual Seed - Step by step with more control"
echo -e "  ${GREEN}3)${NC} Custom URLs - Provide your own URLs to scrape"
read -p "Enter choice (1-3): " -n 1 -r
echo -e "\n"

case $REPLY in
    1)
        # Quick seed
        echo -e "${GREEN}=== Quick Seed ===${NC}\n"
        echo -e "${YELLOW}Triggering seed endpoint...${NC}"
        RESPONSE=$(curl -s -X POST "$API_URL/api/v1/scraper/seed")
        echo "$RESPONSE" | jq '.'
        
        NAV_JOB=$(echo "$RESPONSE" | jq -r '.jobs.navigation.jobId')
        CAT_COUNT=$(echo "$RESPONSE" | jq -r '.jobs.categories | length')
        
        echo -e "\n${GREEN}✓ Seed jobs queued!${NC}"
        echo -e "  • Navigation job: $NAV_JOB"
        echo -e "  • Category jobs: $CAT_COUNT queued"
        
        echo -e "\n${YELLOW}⏳ Waiting for scraping to complete (this may take 1-2 minutes)...${NC}"
        
        for i in {1..12}; do
            sleep 10
            NEW_COUNT=$(curl -s "$API_URL/api/v1/products?limit=1" | jq -r '.meta.total')
            echo -e "${BLUE}Progress check $i/12: $NEW_COUNT products found${NC}"
            
            if [ "$NEW_COUNT" -gt 0 ]; then
                echo -e "\n${GREEN}🎉 Success! Database now has $NEW_COUNT products!${NC}"
                break
            fi
        done
        ;;
        
    2)
        # Manual seed
        echo -e "${GREEN}=== Manual Seed ===${NC}\n"
        
        echo -e "${YELLOW}Step 1/3: Scraping navigation...${NC}"
        NAV_RESPONSE=$(curl -s -X POST "$API_URL/api/v1/scraper/navigation")
        echo "$NAV_RESPONSE" | jq '.'
        NAV_JOB=$(echo "$NAV_RESPONSE" | jq -r '.jobId')
        echo -e "${GREEN}✓ Navigation job queued: $NAV_JOB${NC}"
        sleep 15
        
        echo -e "\n${YELLOW}Step 2/3: Scraping categories...${NC}"
        
        # Scrape ONLY homepage (as requested)
        echo -e "${BLUE}  Scraping homepage: https://www.worldofbooks.com${NC}"
        HOMEPAGE_RESPONSE=$(curl -s -X POST "$API_URL/api/v1/scraper/homepage")
        HOMEPAGE_JOB=$(echo "$HOMEPAGE_RESPONSE" | jq -r '.jobId')
        echo -e "${GREEN}  ✓ Homepage job queued: $HOMEPAGE_JOB${NC}"
        
        echo -e "\n${YELLOW}Step 3/3: Waiting for jobs to complete...${NC}"
        sleep 30
        
        FINAL_COUNT=$(curl -s "$API_URL/api/v1/products?limit=1" | jq -r '.meta.total')
        echo -e "\n${GREEN}✓ Manual seeding complete!${NC}"
        echo -e "${GREEN}Database now has $FINAL_COUNT products${NC}"
        ;;
        
    3)
        # Custom URLs
        echo -e "${GREEN}=== Custom URL Scraping ===${NC}\n"
        echo -e "${YELLOW}Enter URLs to scrape (one per line, empty line to finish):${NC}"
        
        URLS=()
        while IFS= read -r line; do
            [[ -z "$line" ]] && break
            URLS+=("$line")
        done
        
        if [ ${#URLS[@]} -eq 0 ]; then
            echo -e "${RED}No URLs provided. Exiting.${NC}"
            exit 0
        fi
        
        echo -e "\n${YELLOW}Scraping ${#URLS[@]} URLs...${NC}"
        
        for url in "${URLS[@]}"; do
            echo -e "${BLUE}Scraping: $url${NC}"
            
            # Detect URL type
            if [[ $url == *"/category/"* ]] || [[ $url == *"/books"* ]]; then
                RESPONSE=$(curl -s -X POST "$API_URL/api/v1/scraper/category?url=$url")
            elif [[ $url == *"/product/"* ]]; then
                RESPONSE=$(curl -s -X POST "$API_URL/api/v1/scraper/product?url=$url")
            else
                RESPONSE=$(curl -s -X POST "$API_URL/api/v1/scraper/navigation")
            fi
            
            JOB_ID=$(echo "$RESPONSE" | jq -r '.jobId')
            echo -e "${GREEN}✓ Job queued: $JOB_ID${NC}"
            sleep 10
        done
        
        echo -e "\n${YELLOW}Waiting for jobs to complete...${NC}"
        sleep 30
        
        FINAL_COUNT=$(curl -s "$API_URL/api/v1/products?limit=1" | jq -r '.meta.total')
        echo -e "\n${GREEN}✓ Custom scraping complete!${NC}"
        echo -e "${GREEN}Database now has $FINAL_COUNT products${NC}"
        ;;
        
    *)
        echo -e "${RED}Invalid choice. Exiting.${NC}"
        exit 1
        ;;
esac

# Final status
echo -e "\n${BLUE}========================================${NC}"
echo -e "${BLUE}Seeding Complete!${NC}"
echo -e "${BLUE}========================================${NC}\n"

FINAL_COUNT=$(curl -s "$API_URL/api/v1/products?limit=1" | jq -r '.meta.total')
echo -e "${GREEN}📊 Total Products: $FINAL_COUNT${NC}\n"

if [ "$FINAL_COUNT" -gt 0 ]; then
    echo -e "${YELLOW}Sample products:${NC}"
    curl -s "$API_URL/api/v1/products?limit=5" | jq '.items[] | {title, author, price}'
    
    echo -e "\n${GREEN}✓ Database is ready!${NC}"
    echo -e "\n${YELLOW}Next steps:${NC}"
    echo -e "  • View all products: ${BLUE}curl $API_URL/api/v1/products${NC}"
    echo -e "  • Search products: ${BLUE}curl '$API_URL/api/v1/products?search=Harry%20Potter'${NC}"
    echo -e "  • API docs: ${BLUE}http://localhost:8000/api/docs${NC}"
    echo -e "  • Run tests: ${BLUE}./test-api.sh${NC}\n"
else
    echo -e "${RED}⚠️  No products found after seeding${NC}"
    echo -e "${YELLOW}This could mean:${NC}"
    echo -e "  • Scraping is still in progress (wait a bit longer)"
    echo -e "  • Website structure changed (check logs)"
    echo -e "  • Network issues (check connection)"
    echo -e "\n${YELLOW}Check scrape job status:${NC}"
    echo -e "  ${BLUE}curl $API_URL/api/v1/scraper/jobs${NC}\n"
fi
