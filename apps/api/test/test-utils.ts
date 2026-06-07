process.env.NODE_ENV = 'test';
import { config } from 'dotenv';
config({ path: '.env.test', override: true });

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app/app.module';

export async function createTestApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.init();
  return app;
}

export async function authenticateUser(
  app: INestApplication,
  credentials: { name: string; password: string },
): Promise<string> {
  const response = await request(app.getHttpServer())
    .post('/api/auth/login')
    .send(credentials)
    .expect(201);

  return response.body.accessToken;
}