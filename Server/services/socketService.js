import { Server } from 'socket.io';
import tokenService from './tokenService.js';
import LiveGame from '../classes/LiveGame.js';
const userSockets = {};
const liveGames =[];

async function initConnection(socket, userSockets) {
  socket.emit("identify", "Hello client!");
  socket.on("token", async (token) => {
    try{
      const username = await tokenService.isLoggedIn(token);
      userSockets[username] = socket;
    }catch{
      console.log("error", token)
    }
  });
  socket.on("logout", async (token) => {
    const username = await tokenService.isLoggedIn(token);
    delete userSockets[username];
  });

//######################################################################

  socket.on("startGame", (data) => {
    const dataObject=JSON.parse(data);
    const opponent= dataObject.opponent;
    const me= dataObject.me;
  

    const socket =userSockets[opponent];
    if (socket){
      userSockets[opponent].emit("requestGame", me);
    }
  
  });
  socket.on("acceptGame", (data) => {
    const dataObject=JSON.parse(data);
    const opponent= dataObject.opponent;
    const me= dataObject.me;
  
    const liveGame= new LiveGame (me, opponent);
    liveGames.push(liveGame);

    userSockets[opponent].emit("gameCreated",JSON.stringify({opponent:me}));
    userSockets[me].emit("gameCreated",JSON.stringify({opponent:opponent}));

  });
  
  socket.on("point", (myUsername) => {
    const currentLiveGame = liveGames.find(liveGame => liveGame.player1 === myUsername || liveGame.player2 === myUsername);
    const opponent = currentLiveGame.player1 ===myUsername ? currentLiveGame.player2 : currentLiveGame.player1;
    const socket = userSockets[opponent];
    if(socket){
      socket.emit("pointReceived", "1");
    }
  });
  
  socket.on("endGame", (data) => {
    const dataObject=JSON.parse(data);
    const username= dataObject.username;
    const result = dataObject.result;
    
    const currentLiveGame = liveGames.find(liveGame => liveGame.player1 === username || liveGame.player2 === username);
    if(currentLiveGame.player1==username){
      currentLiveGame.score1= result;
    }
    if(currentLiveGame.player2==username){
      currentLiveGame.score2= result;
    }
    if (currentLiveGame.score1!=null && currentLiveGame.score2!=null){
      currentLiveGame.culcWinnerAndUpdateDataBase();
      setTimeout(() => {
      let index= liveGames.indexOf(currentLiveGame);
      liveGames.splice(index,1);
      }, 5000);
    }
  });

  socket.on("playAnotherSet", (myUsername) => {
    const currentLiveGame = liveGames.find(liveGame => liveGame.player1 === myUsername || liveGame.player2 === myUsername);
    const opponent = currentLiveGame.player1 ===myUsername ? currentLiveGame.player2 : currentLiveGame.player1;
    const socket = userSockets[opponent];
    if(socket){
      socket.emit("playAnotherSetReceived", "1");
    }
  });
  socket.on("submitGame", (myUsername) => {
    const currentLiveGame = liveGames.find(liveGame => liveGame.player1 === myUsername || liveGame.player2 === myUsername);
    const opponent = currentLiveGame.player1 ===myUsername ? currentLiveGame.player2 : currentLiveGame.player1;
    const socket = userSockets[opponent];
    if(socket){
      socket.emit("submitGameReceived", "1");
    }
  });
  socket.on("vi", (myUsername) => {
    const currentLiveGame = liveGames.find(liveGame => liveGame.player1 === myUsername || liveGame.player2 === myUsername);
    const opponent = currentLiveGame.player1 ===myUsername ? currentLiveGame.player2 : currentLiveGame.player1;
    const socket = userSockets[opponent];
    if(socket){
      socket.emit("viReceived", "1");
    }
  });
  socket.on("pause", (myUsername) => {
    const currentLiveGame = liveGames.find(liveGame => liveGame.player1 === myUsername || liveGame.player2 === myUsername);
    const opponent = currentLiveGame.player1 ===myUsername ? currentLiveGame.player2 : currentLiveGame.player1;
    const socket = userSockets[opponent];
    if(socket){
      socket.emit("pauseReceived", "1");
    }
  });
  socket.on("continuePlay", (myUsername) => {
    const currentLiveGame = liveGames.find(liveGame => liveGame.player1 === myUsername || liveGame.player2 === myUsername);
    const opponent = currentLiveGame.player1 ===myUsername ? currentLiveGame.player2 : currentLiveGame.player1;
    const socket = userSockets[opponent];
    if(socket){
      socket.emit("continuePlayReceived", "1");
    }
  });

//######################################################################

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


