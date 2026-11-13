import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId
} from '../models/categories.js';

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

export {
    buildCategoriesPage,
    buildCategoryPage
};