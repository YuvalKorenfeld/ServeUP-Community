import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const postSchema = new mongoose.Schema({
    date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  location:
    {
    name:{
    type: String,
    required: true,
    },
    adminCode:{
        type:String,
        required: true
    }
    },
});
const postModel = mongoose.model('Post', postSchema);
export default postModel;