import io from 'socket.io-client';
import config from './config';

let socketInstance = null;
const initializeSocket = (token) => {
    if (!socketInstance) {
      socketInstance = io(config.serverAddress);
      // Additional socket setup, such as emitting token
      socketInstance.on('identify', () => {
        socketInstance.emit('token', `bearer ${token}`);
      });
    }
  
    return socketInstance;
  };
  
  const getSocketInstance = () => {
    if (!socketInstance) {
      throw new Error('Socket not initialized. Call initializeSocket first.');
    }
  
    return socketInstance;
  };
  
export default { initializeSocket, getSocketInstance };

