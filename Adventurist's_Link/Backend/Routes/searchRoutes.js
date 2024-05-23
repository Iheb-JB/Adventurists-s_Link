import express from "express";
import { protectRoute } from "../Middlewares/protectRoute.js";
import { matchUsers } from "../Controllers/travelMatch.js";

const router = express.Router();

router.post("/",matchUsers);

export default router;