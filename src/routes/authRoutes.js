// imported middle ware to check token
import {Router} from 'express';
import Authentication from '../controllers/authController';

const router = Router();

router.post('/signup',  Authentication.signUp);
router.post('/login',  Authentication.login);

export default router;