import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaClient } from '@prisma/client';

describe('Contacts (e2e)', () => {
  let contactId: string;
  const prisma = new PrismaClient();
  let app: INestApplication;
  let accessToken: string;
  let userId: string;

  const email = `contact_e2e_${Date.now()}@test.com`;
  const password = 'password123';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password, name: 'Contacto Tester' })
      .expect(201);

    let res;
    for (let i = 0; i < 5; i++) {
      res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email, password });

      if (res.status === 200 && res.body.access_token) break;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    accessToken = res.body.access_token;
    expect(accessToken).toBeDefined();

    const user = await prisma.user.findUnique({ where: { email } });
    expect(user).toBeDefined();
    userId = user.id;

    const createRes = await request(app.getHttpServer())
      .post('/contacts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Juan Contacto',
        email: 'juan@contacto.com',
        birthdate: '1992-02-02T00:00:00.000Z',
        phone_personal: '123456789',
        company: 'Empresa Demo',
        city: 'Ciudad Test',
        province: 'Provincia Test',
        
      })
      .expect(201);

    contactId = createRes.body.id;
  });

  it('should get all contacts', async () => {
    const res = await request(app.getHttpServer())
      .get('/contacts')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });


  it('should mark the contact as favorite', async () => {
    console.log(contactId, 'contactId');
    const res = await request(app.getHttpServer())
      .patch(`/contacts/${contactId}/favorite`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ is_favorite: true })
      .expect(200);

    expect(res.body).toHaveProperty('id');
    expect(res.body.id).toBe(contactId);
    expect(res.body.is_favorite).toBe(true);
  });

  it('should get favorite contacts with pagination', async () => {
    const res = await request(app.getHttpServer())
      .get('/contacts/favorites?limit=10&offset=0')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('limit');
    expect(res.body).toHaveProperty('offset');
  });
  console.log(contactId, 'contactId');

  it('should delete the contact', async () => {
    await request(app.getHttpServer())
      .delete(`/contacts/${contactId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });

  it('should not return deleted contact in get all', async () => {
    const res = await request(app.getHttpServer())
      .get('/contacts')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const deleted = res.body.data.find((c: any) => c.id === contactId);
    expect(deleted).toBeUndefined();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }

    await prisma.$transaction([
      prisma.contactLog.deleteMany({}),
      prisma.notification.deleteMany({}),
      prisma.contact.deleteMany({}),
      prisma.user.deleteMany({}),
    ]);
  });
});
