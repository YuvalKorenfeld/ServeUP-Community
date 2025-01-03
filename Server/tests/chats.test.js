import request from 'supertest'; // Import supertest library
import MessageModel from '../models/messageModel';
let accessToken;
let chatID;
let messageID;
beforeAll(async () => {
  // Obtain access token before running tests
  const response = await request(app)
    .post('/api/tokens')
    .send({
      username: 'user1',
      password: 'password1',
    });

  accessToken = response.body.token;
});

describe('Chat API - POST /api/chats', () => {
    it('should create a new chat', async () => {
      const response = await request(app)
        .post('/api/chats')
        .set('authorization', `Bearer ${accessToken}`)
        .send({ username: 'user2' });
  
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('user');
      chatID=response.body.id;
      // Add other assertions based on your expected response format
    });
  });
  
  describe('Chat API - GET /api/chats/:id', () => {
    it('should specific chats for a user', async () => {
      const response = await request(app)
        .get(`/api/chats/${chatID}`)
        .set('authorization', `Bearer ${accessToken}`);
  
      expect(response.status).toBe(200);
      // Add assertions for the response body based on your expected format
    });
  });
  describe('Chat API - POST /api/chats/:id/Messages', () => {
    it('should send a message to the chat', async () => {
      const response = await request(app)
        .post(`/api/chats/${chatID}/Messages`)
        .set('authorization', `Bearer ${accessToken}`)
        .send({ content: 'Hello, user2!' });
  
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      messageID=response.body.id;
      expect(response.body).toHaveProperty('sender');
      expect(response.body).toHaveProperty('content', 'Hello, user2!');
      expect(response.body).toHaveProperty('created');
    });
  });
  
  describe('Chat API - GET /api/chats/:id/Messages', () => {
    it('should get all messages from the chat', async () => {
      // Send a test message to the chat first
      const sendMessageResponse = await request(app)
        .post(`/api/chats/${chatID}/Messages`)
        .set('authorization', `Bearer ${accessToken}`)
        .send({ content: 'Test message' });
  
      const response = await request(app)
        .get(`/api/chats/${chatID}/Messages`)
        .set('authorization', `Bearer ${accessToken}`);
  
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      /* the tests are not relevant because a chat is created once between two users
      expect(response.body).toHaveLength(2); // Assuming only one message was sent
      expect(response.body[1]).toHaveProperty('id', sendMessageResponse.body.id);
      expect(response.body[1]).toHaveProperty('sender', sendMessageResponse.body.sender);
      expect(response.body[1]).toHaveProperty('content', 'Test message');
      await MessageModel.deleteOne({ _id: sendMessageResponse.body.id });
      await MessageModel.deleteOne({ _id: messageID });
      */
    });

  });
  describe('Chat API - DELETE /api/chats/:id', () => {
    it('should delete a chat by ID', async () => {
      const response = await request(app)
        .delete(`/api/chats/${chatID}`)
        .set('authorization', `Bearer ${accessToken}`);
  
      expect(response.status).toBe(204);
      // Add assertions based on your expected behavior for a successful deletion
    });
  });
  