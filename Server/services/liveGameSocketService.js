import { Server } from 'socket.io';
import tokenService from './tokenService.js';
const userSockets = {};

async function initConnection(socket, userSockets) {
    socket.emit("identify", "Hello client!");
    socket.on("token", async (token) => {
      const username = await tokenService.isLoggedIn(token);
      userSockets[username] = socket;
    });
    socket.on("logout", async (token) => {
      const username = await tokenService.isLoggedIn(token);
      delete userSockets[username];
    });
  }