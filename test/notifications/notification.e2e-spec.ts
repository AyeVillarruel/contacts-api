import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { NotificationType } from 'src/notifications/enum/notification-type.enum';

let app: INestApplication;
let prisma: PrismaService;
let accessToken: string;
let notificationId: string;
let contactId: string;
let userId: string;

describe('NotificationController (e2e)', () => {
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'notitest@test.com',
        password: 'test123',
        name: 'Tester',
      });

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'notitest@test.com',
        password: 'test123',
      });

    accessToken = res.body.access_token;

    const user = await prisma.user.findUnique({
      where: { email: 'notitest@test.com' },
    });

    if (!user) {
      throw new Error('User not found after login');
    }

    userId = user.id;

    const contact = await prisma.contact.create({
      data: {
        name: 'Cumpleañero',
        email: 'cumple@ejemplo.com',
        birthdate: new Date(),
        phone_personal: '123456',
        company: 'Empresa',
        city: 'Ciudad',
        province: 'Provincia',
        user: {
          connect: { id: userId },
        },
      },
    });

    contactId = contact.id;

    const notification = await prisma.notification.create({
      data: {
        message: '¡Feliz cumpleaños!',
        type: NotificationType.BIRTHDAY, 
        contact: {
          connect: { id: contactId },
        },
        user: {
          connect: { id: userId },
        },
      },
    });
    

    notificationId = notification.id;
  });

  it('should get notifications for the user', async () => {
    const res = await request(app.getHttpServer())
      .get('/notifications')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('message');
    notificationId = res.body[0].id;
  });

  afterAll(async () => {
    await prisma.notification.deleteMany({});
    await prisma.contact.deleteMany({});
    await prisma.user.deleteMany({});
    await app.close();
  });
});
