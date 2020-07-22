import express from 'express';
import {checkToken} from '../middlewares/auth';
import taskController from '../controllers/tasks.controller';

const router = express.Router();

router.get('/tasks/filter', taskController.filterTask);

router.get('/tasks' ,taskController.getAllTasks);

router.get('/tasks/:id', checkToken ,taskController.getSingleTask)

router.post('/tasks/create', checkToken ,taskController.createNewTask)

router.put('/tasks/update/:id', checkToken ,taskController.updateTask);

router.delete('/tasks/:id', checkToken ,taskController.deleteTask);

router.post('/tasks/apply/:taskId', checkToken, taskController.applyTask);

router.put('/tasks/approve/:taskId', checkToken, taskController.approveTask);

router.put('/tasks/close/:taskId', checkToken, taskController.closeTask);

export default router;