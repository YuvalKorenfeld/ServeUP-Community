import express from "express";
import {createGame,getGames} from "../controllers/gameController.js";

const router = express.Router();

router.post("/", createGame);
router.get("/:username", getGames);

export default router;