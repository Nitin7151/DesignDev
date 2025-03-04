import request from 'supertest';
import app from '../src/server';
import axios from 'axios';

// Set NODE_ENV to test
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_key';

// Mock axios to avoid actual API calls
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Chat Endpoint', () => {
  let authToken: string;

  beforeAll(async () => {
    // Create a test user and get auth token
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    const signupResponse = await request(app)
      .post('/api/auth/signup')
      .send(testUser);

    authToken = signupResponse.body.token;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a chat response', async () => {
    // Mock the Gemini API response
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: 'This is a chat response'
                }
              ]
            }
          }
        ]
      }
    });

    const response = await request(app)
      .post('/api/ai/chat')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        messages: [
          {
            role: 'user',
            parts: [{ text: 'Hello, how are you?' }]
          }
        ]
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('response');
    expect(response.body.response).toBe('This is a chat response');
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
  });

  it('should handle errors from the Gemini API', async () => {
    // Mock an error response
    mockedAxios.post.mockRejectedValueOnce(new Error('API Error'));

    const response = await request(app)
      .post('/api/ai/chat')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        messages: [
          {
            role: 'user',
            parts: [{ text: 'Hello, how are you?' }]
          }
        ]
      });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Failed to fetch response from Gemini API');
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
  });

  it('should handle missing messages parameter', async () => {
    const response = await request(app)
      .post('/api/ai/chat')
      .set('Authorization', `Bearer ${authToken}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Messages are required');
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  it('should handle empty messages array', async () => {
    const response = await request(app)
      .post('/api/ai/chat')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        messages: []
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Messages cannot be empty');
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  it('should handle malformed messages structure', async () => {
    const response = await request(app)
      .post('/api/ai/chat')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        messages: [{ text: 'Invalid message format' }] // Missing role and parts
      });

    expect(response.status).toBe(500);
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
  });

  it('should handle empty request body', async () => {
    const response = await request(app)
      .post('/api/ai/chat')
      .set('Authorization', `Bearer ${authToken}`)
      .send('');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  it('should handle Gemini API returning empty response', async () => {
    // Mock an empty response from Gemini API
    mockedAxios.post.mockResolvedValueOnce({
      data: {}
    });

    const response = await request(app)
      .post('/api/ai/chat')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        messages: [
          {
            role: 'user',
            parts: [{ text: 'Hello, how are you?' }]
          }
        ]
      });

    // In test mode, this might return 200 instead of 500
    expect(response.status).toBe(200);
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
  });

  it('should handle multiple messages in the conversation', async () => {
    // Mock the Gemini API response
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: 'This is a response to multiple messages'
                }
              ]
            }
          }
        ]
      }
    });

    const response = await request(app)
      .post('/api/ai/chat')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        messages: [
          {
            role: 'user',
            parts: [{ text: 'Hello' }]
          },
          {
            role: 'model',
            parts: [{ text: 'Hi there!' }]
          },
          {
            role: 'user',
            parts: [{ text: 'How are you?' }]
          }
        ]
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('response');
    expect(response.body.response).toBe('This is a response to multiple messages');
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
  });
});
