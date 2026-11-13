import express from 'express';

import {
    buildOrganizationsPage,
    buildOrganizationPage
} from '../controllers/organizationController.js';

const router = express.Router();

// Display all organizations
router.get('/', buildOrganizationsPage);

// Display one organization
router.get('/:id', buildOrganizationPage);

export default router;