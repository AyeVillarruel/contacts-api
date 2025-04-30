import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Contacts (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let contactId: string;

  const email = `contact_e2e_${Date.now()}@test.com`;
  const password = 'password123';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Registro
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password, name: 'Contacto Tester' })
      .expect(201);

    // Login
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(200);

    accessToken = res.body.access_token;
    if (!accessToken) throw new Error('Login failed: no token received');
  });

  it('should create a contact', async () => {
    const res = await request(app.getHttpServer())
      .post('/contacts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Juan Contacto',
        email: 'juan@contacto.com',
        birthdate: '1992-02-02',
        phone_personal: '123456789',
        company: 'Empresa Demo',
        city: 'Ciudad Test',
        province: 'Provincia Test',
      })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    contactId = res.body.id;
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
    await request(app.getHttpServer())
      .patch(`/contacts/${contactId}/favorite`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ is_favorite: true })
      .expect(200);
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
    await app.close();
  });
});
