// imported middle ware to check token
import {checkToken} from '../middlewares/auth';
import {Router} from 'express';
import Upload from '../controllers/upload.controller';

const router = Router();

router.post('/upload', checkToken,  Upload.upLoadphoto);

export default router;