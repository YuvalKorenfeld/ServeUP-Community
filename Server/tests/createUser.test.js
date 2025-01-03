// createUser.test.js
import request from 'supertest';
var auth="";
describe('POST /api/users', () => {
  let userId; // Variable to store the created user's ID

  it('should create a new user', async () => {
    const response = await request(global.app)
      .post('/api/users')
      .send({
        username: 'testUser',
        password: 'testPassword',
        email: 'test@example.com',
        displayName: 'Test User',
        profilePic: 'test.jpg',
        age:20,
        location:{"name":"test","adminCode":"test"},
        realLevel:1
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('authorization');
    auth = response.body.authorization;
  });

  it('should return status 409 for a duplicate user and delete the user from the database', async () => {
    // Attempt to create the same user again
    const response = await request(global.app)
      .post('/api/users')
      .send({
        username: 'testUser',
        password: 'testPassword',
        email: 'test@example.com',
        displayName: 'Test User',
        profilePic: 'test.jpg',
      });

    // Check if the response status is 409 (Conflict)
    expect(response.status).toBe(409);

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