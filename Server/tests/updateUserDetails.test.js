// updateUserAndDelete.test.js
import request from 'supertest';
let auth; // Variable to store the user's authorization token

// Setup before all tests
beforeAll(async () => {
  // Create a new user for testing
  const createUserResponse = await request(global.app)
    .post('/api/users')
    .send({
      username: 'testUser',
      password: 'testPassword',
      email: 'test@example.com',
      displayName: 'Test User',
      profilePic: 'test.jpg',
      age: 20,
      location: { name: 'test', adminCode: 'test' },
      realLevel: 1,
    });

  // Extract authorization token from the response
  auth = createUserResponse.body.authorization;
});

describe('PATCH, GET, and DELETE /api/users/:username', () => {
    it('should update user details using PATCH method', async () => {
      const updatedDisplayName = 'Updated User';
  
      // Send a PATCH request to update user details
      const updateResponse = await request(app)
        .patch('/api/users/testUser')
        .set('authorization', auth)
        .send({ displayName: updatedDisplayName });
  
      // Check if the response status is 200 (OK)
      expect(updateResponse.status).toBe(200);
  
      // Check if the updated field is present in the user's JSON response
      const getUserResponse = await request(app)
        .get('/api/users/testUser')
        .set('authorization', auth);
  
      // Check if the response status is 200 (OK)
      expect(getUserResponse.status).toBe(200);
  
      // Check if the specific field is updated in the user's JSON response
      expect(getUserResponse.body.displayName).toBe(updatedDisplayName);

          // Assuming you have a function to delete a user from the database
    // You need to implement this function based on your database setup
    const deleteUserResponse = await deleteUserFromDatabase(auth);

    // Check if the user has been successfully deleted from the database
    expect(deleteUserResponse.status).toBe(200);
    });    
});

// Add a function to delete a user from the database
async function deleteUserFromDatabase(auth) {
    // Implement the logic to delete the user based on your database setup
    // You might use a database query or an API endpoint to delete the user
    // Return the response from the delete operation
    return request(global.app).delete(`/api/users`).set('authorization',auth);
  }