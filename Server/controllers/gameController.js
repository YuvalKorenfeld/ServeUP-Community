import gameService from "../services//gameService.js";
import tokenService from "../services/tokenService.js";
export async function createGame(req, res) {
  try {
    const username = await tokenService.isLoggedIn(req.headers.authorization);
    if (username !== req.body.player1 && username !== req.body.player2){
      throw new Error("Unauthorized");
    }
  } catch (error) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }
  let newGame;
  try {
    newGame = await gameService.createGame(
      req.body.date,
      req.body.player1,
      req.body.player2,
      req.body.sets,
      req.body.winner
    );
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
    return;
  }
  res.status(201).json({ success: true, gameID:newGame._id });
}

export async function getGames(req, res) {
  try {
    const username = await tokenService.isLoggedIn(req.headers.authorization);
  } catch (error) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }
try {
    const games = await gameService.getGames(req.params.username);

    res.status(200).json({ success: true, data: games });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
