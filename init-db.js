import { execSync } from 'child_process';

console.log('🔧 Initializing database...');

try {
    // Deploy migrations
    console.log('📦 Deploying migrations...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('✅ Migrations deployed!');
} catch (error) {
    console.log('⚠️ Migration failed, trying db push...');
    try {
        execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
        console.log('✅ Database schema pushed!');
    } catch (pushError) {
        console.error('❌ Database setup failed:', pushError.message);
        process.exit(1);
    }
}

// Seed database if needed
if (process.env.SEED_DATABASE === 'true') {
    try {
        console.log('🌱 Seeding database...');
        execSync('npm run prisma:seed', { stdio: 'inherit' });
        console.log('✅ Database seeded!');
    } catch (seedError) {
        console.log('⚠️ Seeding failed (this is normal for existing databases)');
    }
}

console.log('✅ Database initialization complete!');