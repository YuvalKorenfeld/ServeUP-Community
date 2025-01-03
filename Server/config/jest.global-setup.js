// jest.global-setup.js
import Server from '../server.js'; // Adjust the path to your server module

beforeAll(async () => {
  global.app = await Server.startServer();
});

afterAll(async () => {
  await Server.stopServer();
});