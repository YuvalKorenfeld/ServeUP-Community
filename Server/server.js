import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRoute from './routes/userRoute.js';
import tokenRoute from './routes/tokenRoute.js';
import chatRouter from './routes/chatRoute.js';
import gameRouter from './routes/gameRoute.js';
import postRoute from './routes/postRoute.js';
import friendRequestsRoute from './routes/friendRequestsRoute.js';
import messageSockets from './services/socketService.js';
import podiumRoute from './routes/podiumRoute.js';
const { messageSocketService } = messageSockets;
var server;
async function startServer() {
//create app
const app = express();
server = http.createServer(app);
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
//env(true, './config');
// Start socket.io
messageSocketService(server);

// Connect to MongoDB
mongoose.connect(process.env.DB_HOST);
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  db.once('open', () => {
    console.log('Connected to MongoDB');
  });
  
  app.use(express.json());
  app.use('/api/Users/', userRoute);
  app.use('/api/tokens/', tokenRoute);
  app.use('/api/chats/', chatRouter);
  app.use('/api/games/', gameRouter);
  app.use('/api/posts/', postRoute);
  app.use('/api/friendRequests/', friendRequestsRoute);
  app.use('/api/podium/', podiumRoute);
  server.listen(3000, () => {
    console.log('Server is running on port 3000 http://localhost:3000');
  });
  return app;
}
async function stopServer(){
  await mongoose.connection.close();
  await server.close();
  return;

}
export default {startServer,stopServer};