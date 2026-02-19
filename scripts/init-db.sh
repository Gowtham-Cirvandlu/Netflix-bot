#!/bin/bash

# Initialize Aiven PostgreSQL database for Netflix Clone

echo "Starting database initialization..."
echo "Host: $AIVEN_DB_HOST"
echo "Port: $AIVEN_DB_PORT"
echo "Database: $AIVEN_DB_NAME"
echo "User: $AIVEN_DB_USER"
echo ""

# Run the TypeScript init script
npm run init-db

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database initialization complete!"
    echo ""
    echo "Next steps:"
    echo "1. Run 'npm run dev' to start the application"
    echo "2. Navigate to http://localhost:5173"
    echo "3. Try registering a new account"
    echo "4. Login and enjoy the Netflix clone!"
else
    echo ""
    echo "❌ Database initialization failed. Please check:"
    echo "1. Environment variables are set correctly"
    echo "2. Aiven database is accessible"
    echo "3. Network/firewall allows outbound connections"
fi
