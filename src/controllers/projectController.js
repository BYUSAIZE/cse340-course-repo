import {
    getAllProjects,
    getProjectById
} from '../models/projects.js';

import { getCategoriesByProjectId } from '../models/categories.js';

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

export {
    buildProjectsPage,
    buildProjectPage
};