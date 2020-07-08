import express from 'express';
import {checkAdminToken} from '../middlewares/verifyAdminToken';
import adminController from '../controllers/admin.controller';

const router = express.Router();

router.get('/admin/me', checkAdminToken, adminController.getAdminProfile);

router.get('/admin/users/count', checkAdminToken, adminController.getAllusersCount);

router.get('/admin/tasks/count', checkAdminToken ,adminController.getallTasksCount);

router.delete('/admin/tasks/:id', checkAdminToken ,adminController.deleteTask)

router.put('/admin/suspenduser/:id', checkAdminToken ,adminController.suspendUser)

router.put('/admin/unsuspenduser/:id', checkAdminToken ,adminController.UnSuspendUser);

router.get('/admin/getuser/:id', checkAdminToken ,adminController.getSingleUser);

router.get('/admin/allusers', checkAdminToken ,adminController.getAllUsers);

router.get('/admin/all', checkAdminToken ,adminController.getAllAdmin);

router.get('/admin/tasks', checkAdminToken ,adminController.getAllTasks);

export default router;