import express from 'express';

import {
    buildProjectsPage,
    buildProjectPage
} from '../controllers/projectController.js';

const router = express.Router();

// Display all service projects
router.get('/', buildProjectsPage);

// Display one service project
router.get('/:id', buildProjectPage);

export default router;