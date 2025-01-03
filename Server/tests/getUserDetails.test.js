// getUserDetails.test.js
import request from 'supertest';
describe('GET /api/users/:username', () => {
  let authToken; // Variable to store the authorization token

  beforeAll(async () => {
    // Log in with user1 and password1 to obtain an authorization token
    const loginResponse = await request(global.app)
      .post('/api/tokens') // Assuming you have a login endpoint
      .send({
        username: 'user1',
        password: 'password1',
      });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty('token');
    authToken = loginResponse.body.token; // Store the authorization token for later use
  });

  it('should retrieve user details for the authenticated user', async () => {
    const userDetailsResponse = await request(global.app)
      .get('/api/users/user1') // Adjust the endpoint based on your setup
      .set('authorization', "Bearer "+authToken);

    // Check if the response status is 200 (OK)
    expect(userDetailsResponse.status).toBe(200);
  
    // Assuming you have a function to validate the user details in the response
    // You need to implement this function based on your expected user details structure
    validateUserDetails(userDetailsResponse.body);
  });
  it('should retrieve user details for another user (user2)', async () => {
    const userDetailsResponse = await request(global.app)
      .get('/api/Users/other/user2') // Adjust the endpoint based on your setup
      .set('authorization', "Bearer "+authToken);

    // Check if the response status is 200 (OK)
    expect(userDetailsResponse.status).toBe(200);
    // Assuming you have a function to validate the user details in the response
    // You need to implement this function based on your expected user details structure
    validateOtherUserDetails(userDetailsResponse.body);
});
});

// Add a function to validate user details in the response
function validateUserDetails(userDetails) {
  // Implement the logic to validate the user details based on your expectations
  // For example, check properties like username, email, etc.
  expect(userDetails).toHaveProperty('username', 'user1');
  //expect(userDetails).toHaveProperty('email', 'user1@example.com');
  // Add more validations based on your expected user details
}

// Add a function to validate user details in the response
function validateOtherUserDetails(userDetails) {
  // Implement the logic to validate the user details based on your expectations
  // For example, check properties like username, email, etc.
  expect(userDetails).toHaveProperty('username', 'user2');
  //expect(userDetails).toHaveProperty('email', 'user1@example.com');
  // Add more validations based on your expected user details
}

