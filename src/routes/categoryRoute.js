import express from 'express';

import {
    categoryValidation,
    buildCategoriesPage,
    buildCategoryPage,
    buildNewCategoryPage,
    processNewCategory,
    buildEditCategoryPage,
    processEditCategory
} from '../controllers/categoryController.js';

const router = express.Router();

// Display all categories
router.get('/', buildCategoriesPage);

// Display one category
router.get('/:id', buildCategoryPage);

// Create and edit routes, mounted at the site root in server.js
const categoryFormRouter = express.Router();

// Create a new category
categoryFormRouter.get('/new-category', buildNewCategoryPage);
categoryFormRouter.post('/new-category', categoryValidation, processNewCategory);

// Edit an existing category
categoryFormRouter.get('/edit-category/:id', buildEditCategoryPage);
categoryFormRouter.post('/edit-category/:id', categoryValidation, processEditCategory);

export default router;
export { categoryFormRouter };