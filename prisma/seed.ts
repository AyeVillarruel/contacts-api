import { PrismaClient } from '@prisma/client';
import { Logger } from '@nestjs/common';
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();
const logger = new Logger('PrismaSeed');

async function main() {
  const existingUsers = await prisma.user.count();

  if (existingUsers > 0) {
    logger.warn('Seed skipped: users already exist.');
    return;
  }

  const passwordHash = await bcrypt.hash('123456', 10);

   await prisma.user.createMany({
    data: [
      { email: 'demo@example.com', password: passwordHash, name: 'Demo User' },
      { email: 'lisa@example.com', password: passwordHash, name: 'Lisa Simpson' },
      { email: 'tony@example.com', password: passwordHash, name: 'Tony Stark' },
    ],
  });

  const users = await prisma.user.findMany();

  await prisma.contact.createMany({
    data: [
      {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        birthdate: new Date('1990-01-01'),
        phone_personal: '1122334455',
        company: 'Empresa X',
        city: 'Buenos Aires',
        province: 'Buenos Aires',
        is_favorite: true,
        userId: users[0].id,
      },
      {
        name: 'Ana Gómez',
        email: 'ana@example.com',
        birthdate: new Date('1985-07-15'),
        phone_personal: '1133445566',
        phone_work: '1144556677',
        company: 'TechCorp',
        city: 'Córdoba',
        province: 'Córdoba',
        profile_image: 'https://placekitten.com/200/200',
        is_favorite: false,
        userId: users[0].id,
      },
      {
        name: 'Bart Simpson',
        email: 'bart@example.com',
        birthdate: new Date('2005-10-10'),
        phone_personal: '1177889900',
        company: 'Springfield Inc.',
        city: 'Springfield',
        province: 'Illinois',
        is_favorite: false,
        userId: users[1].id,
      },
      {
        name: 'Pepper Potts',
        email: 'pepper@example.com',
        birthdate: new Date('1980-03-20'),
        phone_personal: '1166442288',
        phone_work: '1199223344',
        company: 'Stark Industries',
        city: 'New York',
        province: 'New York',
        is_favorite: true,
        userId: users[2].id,
      },
    ],
  });

  const allContacts = await prisma.contact.findMany({ where: { deletedAt: null } });

  const juanP = allContacts.find(c => c.name === 'Juan Pérez');
  const bart = allContacts.find(c => c.name === 'Bart Simpson');
  const pepper = allContacts.find(c => c.name === 'Pepper Potts');

  const logs = [
    juanP && {
      contactId: juanP.id,
      userId: users[0].id,
      action: 'UPDATE',
      field: 'name',
      oldValue: 'Juan Pérez',
      newValue: 'Juan Pedro',
    },
    juanP && {
      contactId: juanP.id,
      userId: users[0].id,
      action: 'UPDATE',
      field: 'city',
      oldValue: 'Buenos Aires',
      newValue: 'La Plata',
    },
    bart && {
      contactId: bart.id,
      userId: users[1].id,
      action: 'UPDATE',
      field: 'company',
      oldValue: 'Springfield Inc.',
      newValue: 'Duff Corp',
    },
    pepper && {
      contactId: pepper.id,
      userId: users[2].id,
      action: 'UPDATE',
      field: 'phone_personal',
      oldValue: '1166442288',
      newValue: '1100223344',
    },
  ].filter(Boolean); 

  for (const log of logs) {
    await prisma.contactLog.create({ data: log });
  }

  logger.log('Seed completed: Users, contacts, and logs created.');
}

main()
  .catch((e) => {
    logger.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
