import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

async function main() {
  const email = process.env.USER_EMAIL || 'user@email.com';
  const password = await hash(process.env.USER_PASSWORD || 'Password@123', 10);
  const first_name = process.env.USER_FIRST_NAME || 'First Name';
  const last_name = process.env.USER_LAST_NAME || 'Last Name';
  const address = process.env.USER_ADDRESS || 'colombo';
  const contact = process.env.USER_CONTACT || '0000000000';
  const postal_code = process.env.USER_POSTAL_CODE || parseInt('000000');
  const bio = process.env.USER_BIO || "this is my bio";
  const dob = process.env.USER_DOB ?  new Date(process.env.USER_DOB) : new Date('2004-09-18');

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      first_name,
      last_name,
      address,
      contact,
      dob,
      email,
      password,
      postal_code: parseInt(postal_code.toString())
    }
  });

  console.log('✅ Seeded user:', user);
}

main()
  .catch((err) => {
    console.error('❌ Error seeding user:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
