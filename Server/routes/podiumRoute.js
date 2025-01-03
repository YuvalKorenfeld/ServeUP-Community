import { getPodium} from "../controllers/podiumController.js";
import express from "express";

const router = express.Router();

router.get("/", getPodium);

export default router;
