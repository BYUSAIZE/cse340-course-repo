import express from 'express';

import {
    projectValidation,
    buildProjectsPage,
    buildProjectPage,
    buildNewProjectPage,
    processNewProject,
    buildEditProjectPage,
    processEditProject
} from '../controllers/projectController.js';

const router = express.Router();

// Display all service projects
router.get('/', buildProjectsPage);

// Display one service project
router.get('/:id', buildProjectPage);

// Create and edit routes, mounted at the site root in server.js
const projectFormRouter = express.Router();

// Create a new service project
projectFormRouter.get('/new-project', buildNewProjectPage);
projectFormRouter.post('/new-project', projectValidation, processNewProject);

// Edit an existing service project
projectFormRouter.get('/edit-project/:id', buildEditProjectPage);
projectFormRouter.post('/edit-project/:id', projectValidation, processEditProject);

export default router;
export { projectFormRouter };