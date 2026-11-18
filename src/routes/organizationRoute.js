import express from 'express';

import {
    organizationValidation,
    buildOrganizationsPage,
    buildOrganizationPage,
    buildNewOrganizationPage,
    processNewOrganization,
    buildEditOrganizationPage,
    processEditOrganization
} from '../controllers/organizationController.js';

const router = express.Router();

// Display all organizations
router.get('/', buildOrganizationsPage);

// Display one organization
router.get('/:id', buildOrganizationPage);

// Create and edit routes, mounted at the site root in server.js
const organizationFormRouter = express.Router();

// Create a new organization
organizationFormRouter.get('/new-organization', buildNewOrganizationPage);
organizationFormRouter.post('/new-organization', organizationValidation, processNewOrganization);

// Edit an existing organization
organizationFormRouter.get('/edit-organization/:id', buildEditOrganizationPage);
organizationFormRouter.post('/edit-organization/:id', organizationValidation, processEditOrganization);

export default router;
export { organizationFormRouter };