import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true
    },
    password: {
      type: String, 
      required: true
    },
    email: {
      type: String,
      required: false
    },
    displayName: {
      type: String,
      default: ''
    },
    profilePic: {
      type: String,
      default: ''
    },
    age: {
      type: Number,
      required: true
    },
    level: {
      number:{
      type: Number,
      default: 0
    },
    percentage:{
      type: Number,
      default: 0
    },
  },
    bio: {
      type: String,
      default: ''
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
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    realLevel: {
      type: Number,
      required: true
    },
    lastConnectedDevice: {
      type: String,
      requires: false,
      default: " "
    },
  });
  
  const UserModel = mongoose.model('User', userSchema);
  export default UserModel;
