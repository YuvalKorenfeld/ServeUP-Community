import request from 'supertest'; // Import supertest library
import UserModel from '../models/userModel';
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

describe('Posts API - POST /api/friendRequests', () => {
    it('should create a new friend request', async () => {
      const response = await request(app)
        .post('/api/friendRequests')
        .set('authorization', `Bearer ${accessToken}`)
        .send({fromUser: "65690423011d507d10268845",
        toUser: "6569042b011d507d10268849",
        createdAt: '2023-12-02T12:34:56Z'});
        
      expect(response.status).toBe(201);
    });
  });

  describe('Posts API - POST /api/friendRequests', () => {
    it('should create a new friend request', async () => {
      const response = await request(app)
        .post('/api/friendRequests')
        .set('authorization', `Bearer ${accessToken}`)
        .send({fromUser: "6569044b011d507d1026884e",
        toUser: "65690423011d507d10268845",
        createdAt: '2023-12-02T12:34:56Z'});
        
      expect(response.status).toBe(201);
    });
  });

  
//now for router.get('/:username/sentFriendRequests', getSentFriendRequests); //to make sure add friend button is disabled
describe('Posts API - GET /api/friendRequests/username/sentFriendRequests', () => {
    it('should get all friend requests sent by current user', async () => {
      const response = await request(app)
        .get('/api/friendRequests/username/sentFriendRequests')
        .set('authorization', `Bearer ${accessToken}`)
  
    expect(response.status).toBe(200);
    // Example assertions based on your expected response format
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);

    // Assuming the first friend request in the response has the structure similar to your example
    const firstFriendRequest = response.body[0];
    expect(firstFriendRequest).toHaveProperty('id');
    expect(firstFriendRequest).toHaveProperty('fromUser');
    expect(firstFriendRequest).toHaveProperty('toUser');
    expect(firstFriendRequest).toHaveProperty('createdAt');
    const fromUserObject = await UserModel.findById(firstFriendRequest.fromUser);

    expect(fromUserObject).toHaveProperty('username');
    expect(fromUserObject).toHaveProperty('displayName');
    expect(fromUserObject).toHaveProperty('profilePic');
    expect(fromUserObject).toHaveProperty('level');
        
    });
  });

//now for router.get('/:username/myFriendRequests', getMyFriendRequests); //to approve friend requests
describe('Posts API - GET /api/friendRequests/username/myFriendRequests', () => {
    it('should get all friend requests sent to current user', async () => {
      const response = await request(app)
        .get('/api/friendRequests/username/myFriendRequests')
        .set('authorization', `Bearer ${accessToken}`)
  
    expect(response.status).toBe(200);
    // Example assertions based on your expected response format
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);

    // Assuming the first friend request in the response has the structure similar to your example
    const firstFriendRequest = response.body[0];
    expect(firstFriendRequest).toHaveProperty('id');
    expect(firstFriendRequest).toHaveProperty('fromUser');
    expect(firstFriendRequest).toHaveProperty('toUser');
    expect(firstFriendRequest).toHaveProperty('createdAt');
    const fromUserObject = await UserModel.findById(firstFriendRequest.fromUser.id);
    
    expect(fromUserObject).toHaveProperty('username');
    expect(fromUserObject).toHaveProperty('displayName');
    expect(fromUserObject).toHaveProperty('profilePic');
    expect(fromUserObject).toHaveProperty('level');
        
    });
  });

//now for router.delete('/', deleteFriendRequest); //to delete friend requests
describe('Posts API - DELETE /api/friendRequests', () => {
    it('should delete a friend request', async () => {
      const response = await request(app)
        .delete('/api/friendRequests/decline')
        .set('authorization', `Bearer ${accessToken}`)
        .send({fromUser: "65690423011d507d10268845",
        toUser: "6569042b011d507d10268849"});
  
      expect(response.status).toBe(200);
      // Add assertions based on your expected behavior for a successful deletion
    });
    
  }
);

//now for router.delete('/', deleteFriendRequest); //to delete friend requests
describe('Posts API - DELETE /api/friendRequests', () => {
    it('should delete a friend request', async () => {
      const response = await request(app)
        .delete('/api/friendRequests/decline')
        .set('authorization', `Bearer ${accessToken}`)
        .send({fromUser: "6569044b011d507d1026884e",
        toUser: "65690423011d507d10268845"});
  
      expect(response.status).toBe(200);
      // Add assertions based on your expected behavior for a successful deletion
    });
    
  }
);



  