const request = require('supertest');
const app = require('../app');

describe('Backend app', () => {
  it('should return welcome message from root', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Welcome to the Kursath Foundation API' });
  });
});
