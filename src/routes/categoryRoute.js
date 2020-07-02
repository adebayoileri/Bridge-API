import express from 'express';
import checkToken from '../middlewares/auth';
import categoryController from '../controllers/category.controller';

const router = express.Router();

router.get('/category', checkToken , categoryController.getAllCategory);

router.get('/category/:id', checkToken , categoryController.getSingleCategory)

router.post('/category/create', checkToken , categoryController.createNewCategory)

router.put('/category/update/:id', checkToken , categoryController.updateCategory);

router.delete('/category/:id', checkToken , categoryController.deleteCategory);

export default router;