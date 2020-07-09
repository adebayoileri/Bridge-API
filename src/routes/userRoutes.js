import {Router} from "express";
import userController from "../controllers/user.controller";
import { checkToken } from "../middlewares/auth";
const router = Router();


router.get('/user', checkToken, userController.getProfile);

router.put('/user/edit', checkToken, userController.editProfile);

router.post('/user/gender/set', checkToken, userController.setGender);
module.exports = router;