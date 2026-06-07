import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, authenticateUser } from './test-utils';

describe('Product (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let productId: string;

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

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/products')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'test',
          description: 'test',
          minStock: 1,
          stock: 1,
          categoryId: 1,
          locationId: 1,
        })
        .expect(201);

      productId = response.body.id;

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('stock');
      expect(response.body).toHaveProperty('categoryId');
      expect(response.body).toHaveProperty('locationId');
    });

    it('should return 400 for invalid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/products')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'test',
          description: 'test',
          price: 'invalid',
          stock: 'invalid',
          categoryId: 'test',
          locationId: 'test',
        })
        .expect(400);
    });

    it('should return 401 without token', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/products')
        .send({
          name: 'test',
          description: 'test',
          price: 1,
          stock: 1,
          categoryId: 'test',
          locationId: 'test',
        })
        .expect(401);
    });

    it('should return 401 for invalid token', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/products')
        .set('Authorization', 'Bearer invalid-token')
        .send({
          name: 'test',
          description: 'test',
          price: 1,
          stock: 1,
          categoryId: 'test',
          locationId: 'test',
        })
        .expect(401);
    });
  });

  describe('GET /api/products', () => {
    it('should return all products', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/products')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should return 401 without token', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/products')
        .expect(401);
    });

    it('should return 401 for invalid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/products')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a product by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should return 401 without token', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/products/test')
        .expect(401);
    });

    it('should return 401 for invalid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/products/test')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/products/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('PATCH /api/products/:id', () => {
    it('should update a product by id', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          stock: 10,
        })
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('stock');
      expect(response.body).toHaveProperty('categoryId');
      expect(response.body).toHaveProperty('locationId');
    });

    it('should return 401 without token', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/products/${productId}`)
        .send({
          stock: 10,
        })
        .expect(401);
    });

    it('should return 401 for invalid token', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/products/${productId}`)
        .set('Authorization', 'Bearer invalid-token')
        .send({
          stock: 10,
        })
        .expect(401);
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/products/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          stock: 10,
        })
        .expect(404);
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete a product by id', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should return 401 without token', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/products/${productId}`)
        .expect(401);
    });

    it('should return 401 for invalid token', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/products/${productId}`)
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/products/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });
});
