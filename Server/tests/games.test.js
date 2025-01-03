import request from 'supertest';
import gameModel from '../models/gameModel';
let accessToken;
let gameID;
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
  
describe("Game API", () => {
  test("POST /games - Create a new game", async () => {
    const newGame = {
      date: "2023-11-26T12:00:00Z",
      player1: "user1", 
      player2: "user2",
      sets: [{ player1: 4, player2: 2 },{player1: 5, player2: 1 },{player1: 3, player2: 3 }],
      winner: "user1",
    };

    const response = await request(app)
      .post("/api/games")
      .set("authorization", `Bearer ${accessToken}`)
      .send(newGame)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body).toHaveProperty("gameID");
    gameID=response.body.gameID;
  });
  test("GET /api/games/:username - Get games for a user", async () => {
    const response = await request(app)
      .get(`/api/games/user1`)
      .set("authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data[0]).toHaveProperty("date", "2023-11-26T12:00:00.000Z");
    expect(response.body.data[0]).toHaveProperty("player1");
    expect(response.body.data[0]).toHaveProperty("player2");
    expect(response.body.data[0]).toHaveProperty("sets");
    expect(response.body.data[0].sets).toBeInstanceOf(Array);
    expect(response.body.data[0]).toHaveProperty("winner");
    gameModel.deleteOne({_id:gameID})
    
  });
  test("GET /api/games/:nonexistentusername - User not found", async () => {
    const nonexistentUsername = "nonexistentuser";

    const response = await request(app)
      .get(`/api/games/${nonexistentUsername}`)
      .set("authorization", `Bearer ${accessToken}`)
      .expect(500);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Failed to get games: User not found");
  });
});

