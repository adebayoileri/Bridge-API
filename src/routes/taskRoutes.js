import express from 'express';
import taskController from '../controllers/tasks.controller';

const router = express.Router();

router.get('/tasks',taskController.getAllTasks);

router.get('/tasks/:id',taskController.getSingleTask)

router.post('/tasks/create',taskController.createNewTask)

router.delete('/tasks/:id',taskController.deleteTask);

export default router;