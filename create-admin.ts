// create-admin.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const db = new PrismaClient();

async function createAdmin() {
  try {
    console.log('🧹 Cleaning up existing admin user...');
    
    // Clean up existing
    await db.account.deleteMany({
      where: { accountId: 'admin@example.com' }
    });
    
    await db.user.deleteMany({
      where: { email: 'admin@example.com' }
    });

    console.log('🔨 Creating new admin user...');
    
    const now = new Date();
    const userId = randomUUID();
    
    // Create user with account in one transaction
    const user = await db.user.create({
      data: {
        id: userId,
        email: 'admin@example.com',
        name: 'Admin',
        emailVerified: true,
        createdAt: now,
        updatedAt: now,
        role: 'admin',
        accounts: {
          create: {
            id: randomUUID(),
            providerId: 'credential',
            accountId: 'admin@example.com',
            password: await bcrypt.hash('testpassword!', 10),
            createdAt: now,
            updatedAt: now,
          }
        }
      },
      include: {
        accounts: true
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', user.email);
    console.log('🔑 Password: testpassword!');
    console.log('👤 User ID:', user.id);
    console.log('🔗 Account Provider:', user.accounts[0]?.providerId);
    
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    await db.$disconnect();
  }
}

createAdmin();
