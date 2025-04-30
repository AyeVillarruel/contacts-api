import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export async function loginAndGetToken(
  app: INestApplication,
  email: string,
  password: string,
): Promise<string> {
  const loginResponse = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email, password });

  if (!loginResponse.body.access_token) {
    throw new Error('Login failed: no access_token returned');
  }

  return loginResponse.body.access_token;
}
