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
async function socketSendMessage(chatId,username, message) {
    const socket = userSockets[username];
    if (socket) {
        socket.emit("message", JSON.stringify({chatId,username, message }));
    }
}
    

const messageSocketService = (server) => {
const io = new Server(server);
  io.on("connection", (socket) => {
    initConnection(socket, userSockets);
  });
};
export default {messageSocketService,socketSendMessage};
