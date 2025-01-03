import Game from "../models/gameModel.js";
import storageService from "./storageService.js";
import userService from "./userService.js";
const gameService = {
  async createGame(date, player1, player2, sets, winner) {
    try {
      // Check if both players exist
      const player1ID = await userService.getUserID(player1);
      const player2ID = await userService.getUserID(player2);
      const winnerID = await userService.getUserID(winner);
      if (!player1ID || !player2ID) {
        //throw new Error("One or more players do not exist");
      }

      const game =  new Game({
        date,
        player1: player1ID,
        player2: player2ID,
        sets,
        winner: winnerID,
      });

      const savedGame = await game.save();
      const updatePlayersStats = await userService.updatePlayersStats(game);
      return savedGame;
    } catch (error) {
      console.log(`Failed to create game: ${error.message}`)
      // throw new Error(`Failed to create game: ${error.message}`);
    }
  },

  async getGames(username) {
    try {
      const user = await userService.getUserID(username);

      if (!user) {
        console.log("User not found")
        // throw new Error("User not found");
      }

      // Retrieve games where the user is either player1 or player2
      const games = await Game.find({
        $or: [{ player1: user._id }, { player2: user._id }],
      }).populate([
        { path: 'player1', select: 'displayName profilePic username' },
        { path: 'player2', select: 'displayName profilePic username' },
        { path: 'winner', select: 'displayName profilePic username' },
      ]);

      const updatedGames = await Promise.all(games.map(async (game) => {
        game.player1.profilePic = await storageService.getProfilePicUrl(game.player1.profilePic);
        game.player2.profilePic = await storageService.getProfilePicUrl(game.player2.profilePic);
        return game;
      }));

      return updatedGames.reverse();
    } catch (error) {
      console.log(`Failed to get games: ${error.message}`)
      console.log(error.message)
      // throw new Error(`Failed to get games: ${error.message}`);
    }
  },
};

export default gameService;
