import { execSync } from 'child_process';

console.log('🔍 Railway: Checking database...');

// Generate Prisma client
console.log('🔄 Generating Prisma client...');
try {
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma client generated!');
} catch (error) {
    console.error('❌ Prisma generate failed:', error.message);
}

// Test Prisma connection
if (process.env.TEST_PRISMA === 'true') {
    console.log('🔍 Testing Prisma connection...');
    try {
        execSync('npm run test:prisma', { stdio: 'inherit' });
    } catch (error) {
        console.error('❌ Prisma test failed:', error.message);
    }
}

// Run database initialization
console.log('🔧 Running database initialization...');
try {
    execSync('npm run init:db', { stdio: 'inherit' });
    console.log('✅ Database initialization completed!');
} catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    // Try alternative method
    console.log('⚠️ Trying alternative database setup...');
    try {
        execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
        console.log('✅ Database setup completed with db push!');
    } catch (pushError) {
        console.error('❌ Alternative setup also failed:', pushError.message);
    }
}

console.log('🚀 Proceeding to start application...');