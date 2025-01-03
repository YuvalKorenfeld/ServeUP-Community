import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  
    created: {
      type: Date,
      required: true,
      default: Date.now
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    content: {
      type: String,
      default: ''
    }
  });
  
 
  const MessageModel= mongoose.model('Message', messageSchema);
  export default MessageModel;