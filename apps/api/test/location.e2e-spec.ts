import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, authenticateUser } from './test-utils';

describe('Location (e2e)' , () => {
  let app: INestApplication;
  let accessToken: string;
  let locationId: string;

  beforeAll(async () => {
    app = await createTestApp();
    accessToken = await authenticateUser(app, {
      name: 'test',
      password: 'password123',
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/locations', () => {
    it('should create a new location', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/locations')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Location B',
        })
        .expect(201);

      locationId = response.body.id;

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
    });

    it('should return 400 for invalid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/locations')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 1,
        })
        .expect(400);
    });

    it('should return 401 without token', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/locations')
        .send({
          name: 'Location C',
        })
        .expect(401);
    });

    it('should return 401 for invalid token', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/locations')
        .set('Authorization', 'Bearer invalid-token')
        .send({
          name: 'Location D',
        })
        .expect(401);
    });
  });

  describe('GET /api/locations', () => {
    it('should return all locations', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/locations')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should return 401 without token', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/locations')
        .expect(401);
    });

    it('should return 401 for invalid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/locations')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('GET /api/locations/:id', () => {
    it('should return a location by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/locations/${locationId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should return 401 without token', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/locations/${locationId}`)
        .expect(401);
    });

    it('should return 401 for invalid token', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/locations/${locationId}`)
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('should return 404 for non-existent location', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/locations/99')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('PATCH /api/locations/:id', () => {
    it('should update a location by id', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/locations/${locationId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Location E',
        })
        .expect(200);
    });

    it('should return 401 without token', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/locations/${locationId}`)
        .send({
          name: 'Location F',
        })
        .expect(401);
    });

    it('should return 401 for invalid token', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/locations/${locationId}`)
        .set('Authorization', 'Bearer invalid-token')
        .send({
          name: 'Location G',
        })
        .expect(401);
    });

    it('should return 404 for non-existent location', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/locations/99')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Location H',
        })
        .expect(404);
    });
  });

  describe('DELETE /api/locations/:id', () => {
    it('should delete a location by id', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/locations/${locationId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should return 401 without token', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/locations/${locationId}`)
        .expect(401);
    });

    it('should return 401 for invalid token', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/locations/${locationId}`)
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('should return 404 for non-existent location', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/locations/99')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });
})