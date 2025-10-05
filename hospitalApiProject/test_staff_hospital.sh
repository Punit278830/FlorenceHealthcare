#!/bin/bash

# Debug script to test the staff hospital assignment issue
# Run this script to test the API endpoints

API_BASE="http://localhost:5020/api"
STAFF_ID=3183
HOSPITAL_ID=38

echo "=== Testing Staff Hospital Assignment Issue ==="
echo ""

echo "1. Testing debug endpoint for staff ID $STAFF_ID..."
curl -X GET "$API_BASE/StaffInfoes/debug/$STAFF_ID" \
  -H "Accept: application/json" \
  -H "X-Staff-Id: $STAFF_ID" \
  -H "X-Hospital-Id: $HOSPITAL_ID" \
  -H "X-Time-Zone: America/Toronto" | jq '.'

echo ""
echo "2. Testing update hospital assignment..."
curl -X POST "$API_BASE/StaffInfoes/update-hospital/$STAFF_ID/$HOSPITAL_ID" \
  -H "Accept: application/json" | jq '.'

echo ""
echo "3. Re-testing debug endpoint after update..."
curl -X GET "$API_BASE/StaffInfoes/debug/$STAFF_ID" \
  -H "Accept: application/json" \
  -H "X-Staff-Id: $STAFF_ID" \
  -H "X-Hospital-Id: $HOSPITAL_ID" \
  -H "X-Time-Zone: America/Toronto" | jq '.'

echo ""
echo "4. Testing the original endpoint that was failing..."
curl -X GET "$API_BASE/StaffInfoes/doctors" \
  -H "Accept: application/json" \
  -H "X-Staff-Id: $STAFF_ID" \
  -H "X-Hospital-Id: $HOSPITAL_ID" \
  -H "X-Time-Zone: America/Toronto" | jq '.'

echo ""
echo "=== Testing Complete ==="
