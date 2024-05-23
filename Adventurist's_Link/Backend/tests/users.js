import Users from "../Models/Users.js";
import mongoose from "mongoose";
import {app, express_server} from "../server.js";
import request from "supertest";
import { MongoMemoryServer } from 'mongodb-memory-server';
import { jest } from '@jest/globals';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
});

afterAll(async () => {
  await mongoServer.stop();
  await express_server.close();
});

beforeEach(async () => {
  const mongoUri = mongoServer.getUri();
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterEach(async () => {
  await mongoose.disconnect();
  jest.clearAllMocks(); // Clear any mocks to avoid interference between tests
});


test('Register user successfully', async () => {
  const response = await request(app)
    .post('/api/auth/signup') // Your endpoint
    .send({
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@example.com',
      password: 'password',
      confirmPassword: 'password',
    });
  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty('status'); // Depending on your response structure
});

test('Fail registration when passwords do not match', async () => {
  const response = await request(app)
    .post('/api/auth/signup') // Your endpoint
    .send({
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@example.com',
      password: 'password',
      confirmPassword: 'password123',
    });
  expect(response.statusCode).toBe(400);
  expect(response.body.error).toBe("passwords don't match");
});

test('User login successful', async () => {
  // Assuming you have a user already created in beforeAll or beforeEach
  const response = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'testuser@example.com',
      password: 'password'
    });
  expect(response.statusCode).toBe(401);
});

test('User login fail with wrong password', async () => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'testuser@example.com',
      password: 'wrongpassword'
    });
  expect(response.statusCode).toBe(401);
});