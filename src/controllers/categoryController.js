import { body, validationResult } from 'express-validator';
import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId,
    createCategory,
    updateCategory
} from '../models/categories.js';

// Validation rules shared by the create and edit forms
const categoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ min: 3, max: 100 }).withMessage('Category name must be between 3 and 100 characters')
];

// Display all categories
const buildCategoriesPage = async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        const title = 'Service Project Categories';

        res.render('categories', {
            title,
            categories
        });
    } catch (error) {
        next(error);
    }
};

// Display one category and its projects
const buildCategoryPage = async (req, res, next) => {
    try {
        const categoryId = Number(req.params.id);

        // Validate the category ID
        if (!Number.isInteger(categoryId) || categoryId <= 0) {
            const error = new Error('Category not found');
            error.status = 404;
            return next(error);
        }

        // Retrieve the category
        const category = await getCategoryById(categoryId);

        if (!category) {
            const error = new Error('Category not found');
            error.status = 404;
            return next(error);
        }

        // Retrieve projects belonging to this category
        const projects = await getProjectsByCategoryId(categoryId);

        const title = `${category.name} Projects`;

        res.render('category', {
            title,
            category,
            projects
        });
    } catch (error) {
        next(error);
    }
};

// Display the create category form
const buildNewCategoryPage = (req, res) => {
    res.render('new-category', {
        title: 'New Category',
        errors: [],
        category: { name: '' }
    });
};

// Process the create category form
const processNewCategory = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).render('new-category', {
                title: 'New Category',
                errors: errors.array(),
                category: { name: req.body.name }
            });
        }

        await createCategory(req.body.name);
        res.redirect('/categories');
    } catch (error) {
        next(error);
    }
};

// Display the edit category form
const buildEditCategoryPage = async (req, res, next) => {
    try {
        const categoryId = Number(req.params.id);

        if (!Number.isInteger(categoryId) || categoryId <= 0) {
            const error = new Error('Category not found');
            error.status = 404;
            return next(error);
        }

        const category = await getCategoryById(categoryId);

        if (!category) {
            const error = new Error('Category not found');
            error.status = 404;
            return next(error);
        }

        res.render('edit-category', {
            title: 'Edit Category',
            errors: [],
            category
        });
    } catch (error) {
        next(error);
    }
};

// Process the edit category form
const processEditCategory = async (req, res, next) => {
    try {
        const categoryId = Number(req.params.id);

        if (!Number.isInteger(categoryId) || categoryId <= 0) {
            const error = new Error('Category not found');
            error.status = 404;
            return next(error);
        }

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).render('edit-category', {
                title: 'Edit Category',
                errors: errors.array(),
                category: { category_id: categoryId, name: req.body.name }
            });
        }

        await updateCategory(categoryId, req.body.name);
        res.redirect('/categories');
    } catch (error) {
        next(error);
    }
};

export {
    categoryValidation,
    buildCategoriesPage,
    buildCategoryPage,
    buildNewCategoryPage,
    processNewCategory,
    buildEditCategoryPage,
    processEditCategory
};