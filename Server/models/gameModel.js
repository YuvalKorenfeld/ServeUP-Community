import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  player1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  player2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sets: [
    {
      player1: {
        type: Number,
        default: 0,
      },
      player2: {
        type: Number,
        default: 0,
      },
    },
  ],
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
});


const gameModel = mongoose.model('Game', gameSchema);

// Export the model
export default gameModel;