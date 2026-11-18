import { body, validationResult } from 'express-validator';

import {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject
} from '../models/projects.js';

import { getCategoriesByProjectId } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';

// Validation rules shared by the create and edit forms
const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Project title is required')
        .isLength({ min: 3, max: 150 }).withMessage('Project title must be between 3 and 150 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 500 }).withMessage('Description cannot be longer than 500 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 150 }).withMessage('Location cannot be longer than 150 characters'),
    body('projectDate')
        .trim()
        .notEmpty().withMessage('Project date is required')
        .isISO8601().withMessage('Project date must be a valid date'),
    body('organizationId')
        .trim()
        .notEmpty().withMessage('Please choose an organization')
        .isInt({ min: 1 }).withMessage('Please choose a valid organization')
];

// Display all service projects
const buildProjectsPage = async (req, res, next) => {
    try {
        const projects = await getAllProjects();
        const title = 'Service Projects';

        res.render('projects', {
            title,
            projects
        });
    } catch (error) {
        next(error);
    }
};

// Display one service project and its categories
const buildProjectPage = async (req, res, next) => {
    try {
        const projectId = Number(req.params.id);

        // Validate the project ID
        if (!Number.isInteger(projectId) || projectId <= 0) {
            const error = new Error('Project not found');
            error.status = 404;
            return next(error);
        }

        // Retrieve the project
        const project = await getProjectById(projectId);

        if (!project) {
            const error = new Error('Project not found');
            error.status = 404;
            return next(error);
        }

        // Retrieve categories belonging to this project
        const categories = await getCategoriesByProjectId(projectId);

        const title = project.title;

        res.render('project', {
            title,
            project,
            categories
        });
    } catch (error) {
        next(error);
    }
};

// Display the create project form
const buildNewProjectPage = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();

        res.render('new-project', {
            title: 'New Service Project',
            errors: [],
            organizations,
            project: {
                title: '',
                description: '',
                location: '',
                project_date_input: '',
                organization_id: ''
            }
        });
    } catch (error) {
        next(error);
    }
};

// Process the create project form
const processNewProject = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        const { title, description, location, projectDate, organizationId } = req.body;

        if (!errors.isEmpty()) {
            const organizations = await getAllOrganizations();

            return res.status(400).render('new-project', {
                title: 'New Service Project',
                errors: errors.array(),
                organizations,
                project: {
                    title,
                    description,
                    location,
                    project_date_input: projectDate,
                    organization_id: organizationId
                }
            });
        }

        await createProject(title, description, location, projectDate, Number(organizationId));
        res.redirect('/projects');
    } catch (error) {
        next(error);
    }
};

// Display the edit project form
const buildEditProjectPage = async (req, res, next) => {
    try {
        const projectId = Number(req.params.id);

        if (!Number.isInteger(projectId) || projectId <= 0) {
            const error = new Error('Project not found');
            error.status = 404;
            return next(error);
        }

        const project = await getProjectById(projectId);

        if (!project) {
            const error = new Error('Project not found');
            error.status = 404;
            return next(error);
        }

        const organizations = await getAllOrganizations();

        res.render('edit-project', {
            title: 'Edit Service Project',
            errors: [],
            organizations,
            project
        });
    } catch (error) {
        next(error);
    }
};

// Process the edit project form
const processEditProject = async (req, res, next) => {
    try {
        const projectId = Number(req.params.id);

        if (!Number.isInteger(projectId) || projectId <= 0) {
            const error = new Error('Project not found');
            error.status = 404;
            return next(error);
        }

        const errors = validationResult(req);
        const { title, description, location, projectDate, organizationId } = req.body;

        if (!errors.isEmpty()) {
            const organizations = await getAllOrganizations();

            return res.status(400).render('edit-project', {
                title: 'Edit Service Project',
                errors: errors.array(),
                organizations,
                project: {
                    project_id: projectId,
                    title,
                    description,
                    location,
                    project_date_input: projectDate,
                    organization_id: organizationId
                }
            });
        }

        await updateProject(projectId, title, description, location, projectDate, Number(organizationId));
        res.redirect('/projects');
    } catch (error) {
        next(error);
    }
};

export {
    projectValidation,
    buildProjectsPage,
    buildProjectPage,
    buildNewProjectPage,
    processNewProject,
    buildEditProjectPage,
    processEditProject
};