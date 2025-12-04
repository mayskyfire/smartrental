#!/bin/sh

echo "Starting application..."

# Wait for database to be ready
echo "Waiting for database..."
sleep 10

# Regenerate Prisma client for runtime
echo "Regenerating Prisma client for runtime..."
npx prisma generate

# Test Prisma connection if enabled
if [ "$TEST_PRISMA" = "true" ]; then
    echo "Testing Prisma connection..."
    npm run test:prisma
fi

# Run migrations
echo "Running migrations..."
npx prisma migrate deploy || echo "Migration failed, continuing..."

# Seed database (optional)
if [ "$SEED_DATABASE" = "true" ]; then
    echo "Seeding database..."
    npx prisma db seed || echo "Seeding failed, continuing..."
fi

# Start the application
echo "Starting Nuxt application..."
exec npm start