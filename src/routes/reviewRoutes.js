import {Router} from "express";
import reviewController from "../controllers/review.controller";
import { checkToken } from "../middlewares/auth";
const router = Router();

router.post('/review/:id/create', checkToken, reviewController.reviewUser);

// get all reviews for a user by id
router.post('/reviews/user/:id', checkToken, reviewController.getUserReview);

// to get all reviews for a user personally
router.get('/reviews/me', checkToken, reviewController.getPersonalUserReview);

// to get all reviews a user posted
router.get('/reviews/created/me', checkToken, reviewController.getReviewsPosted);
export default router;