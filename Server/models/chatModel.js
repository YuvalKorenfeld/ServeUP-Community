import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const chatSchema = new mongoose.Schema({

    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    messages: [{
      type: mongoose.Schema.Types.ObjectId,
      default: [],
      ref: 'Message'
    }]
  });


  const chatModel = mongoose.model('Chat', chatSchema);
  export default chatModel;