import {Router} from "express";
import userController from "../controllers/user.controller";
import { checkToken } from "../middlewares/auth";
const router = Router();


router.get('/user/:id', checkToken, userController.getProfile);

router.put('/user/edit/:id', checkToken, userController.editProfile);

module.exports = router;