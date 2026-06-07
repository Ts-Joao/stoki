import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, authenticateUser } from './test-utils';

describe('Category (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let categoryId: string;

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

  describe('POST /api/category', () => {
    it('should create a new category', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/categories')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Category A',
        })
        .expect(201);

      categoryId = response.body.id;

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
    });

    it('should return 400 for invalid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/categories')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 1,
        })
        .expect(400);
    });

    it('should return 401 without token', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/categories')
        .send({
          name: 'Category C',
        })
        .expect(401);
    });

    it('should return 401 for invalid token', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/categories')
        .set('Authorization', 'Bearer invalid-token')
        .send({
          name: 'Category D',
        })
        .expect(401);
    });
  });

  describe('GET /api/category', () => {
    it('should return all categories', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/categories')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should return 401 without token', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/categories')
        .expect(401);
    });

    it('should return 401 for invalid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/categories')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('GET /api/categories/:id', () => {
    it('should return a category by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should return 401 without token', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/categories/${categoryId}`)
        .expect(401);
    });

    it('should return 401 for invalid token', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/categories/${categoryId}`)
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('should return 404 for non-existent category', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/categories/99')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('PATCH /api/categories/:id', () => {
    it('should update a category by id', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Category E',
        })
        .expect(200);
    });

    it('should return 401 without token', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/categories/${categoryId}`)
        .send({
          name: 'Category F',
        })
        .expect(401);
    });

    it('should return 401 for invalid token', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/categories/${categoryId}`)
        .set('Authorization', 'Bearer invalid-token')
        .send({
          name: 'Category G',
        })
        .expect(401);
    });

    it('should return 404 for non-existent category', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/categories/99')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Category H',
        })
        .expect(404);
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should delete a category by id', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should return 401 without token', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/categories/${categoryId}`)
        .expect(401);
    });

    it('should return 401 for invalid token', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/categories/${categoryId}`)
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('should return 404 for non-existent category', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/categories/99`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });
});
