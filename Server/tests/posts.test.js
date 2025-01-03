import request from 'supertest'; // Import supertest library
let accessToken;
let user2Token;
let postID;
beforeAll(async () => {
  // Obtain access token before running tests
  const response = await request(app)
    .post('/api/tokens')
    .send({
      username: 'user1',
      password: 'password1',
    });

  accessToken = response.body.token;
  const response2 = await request(app)
    .post('/api/tokens')
    .send({
      username: 'user2',
      password: 'password2',
    });

  user2Token = response2.body.token;
});

describe('Posts API - POST /api/posts', () => {
    it('should create a new post', async () => {
      const response = await request(app)
        .post('/api/posts')
        .set('authorization', `Bearer ${accessToken}`)
        .send({ 
          date: "2021-05-11T12:00:00.000Z",
          player: "65690423011d507d10268845",
          location: {
              name: "test",
              adminCode: "02",
          } });
        
      expect(response.status).toBe(201);
      postID=response.body.id;
      // Add other assertions based on your expected response format
    });
  });
  

  describe('Posts API - GET /api/posts', () => {
    it('should get all posts instead of current user', async () => {
      const response = await request(app)
        .get('/api/posts')
        .set('authorization', `Bearer ${user2Token}`)
  
    expect(response.status).toBe(200);
    // Example assertions based on your expected response format
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);

    // Assuming the first post in the response has the structure similar to your example
    const firstPost = response.body[0];
    expect(firstPost).toHaveProperty('id');
    expect(firstPost).toHaveProperty('date');
    expect(firstPost).toHaveProperty('location');
    expect(firstPost).toHaveProperty('player');
    expect(firstPost.player).toHaveProperty('id');
    expect(firstPost.player).toHaveProperty('username');
    expect(firstPost.player).toHaveProperty('displayName');
    expect(firstPost.player).toHaveProperty('profilePic');
    expect(firstPost.player).toHaveProperty('level');
        
    });
  });


  describe('Posts API - DELETE /api/posts/:id', () => {
    it('should delete a post by ID', async () => {
      const response = await request(app)
        .delete(`/api/posts/${postID}`)
        .set('authorization', `Bearer ${accessToken}`);
  
      expect(response.status).toBe(204);
      // Add assertions based on your expected behavior for a successful deletion
    });
    
  });
  