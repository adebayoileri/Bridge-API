import {Router} from "express";
import reviewController from "../controllers/review.controller";
import { checkToken } from "../middlewares/auth";
const router = Router();

router.post('/review/:id/create', checkToken, reviewController.reviewUser);

export default router;