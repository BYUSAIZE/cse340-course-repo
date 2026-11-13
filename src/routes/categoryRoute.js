import express from 'express';

import {
    buildCategoriesPage,
    buildCategoryPage
} from '../controllers/categoryController.js';

const router = express.Router();

// Display all categories
router.get('/', buildCategoriesPage);

// Display one category
router.get('/:id', buildCategoryPage);

export default router;