import {
    getAllOrganizations,
    getOrganizationById
} from '../models/organizations.js';

import { getProjectsByOrganizationId } from '../models/projects.js';

// Display all organizations
const buildOrganizationsPage = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();
        const title = 'Our Partner Organizations';

        res.render('organizations', {
            title,
            organizations
        });
    } catch (error) {
        next(error);
    }
};

// Display one organization and its projects
const buildOrganizationPage = async (req, res, next) => {
    try {
        const organizationId = Number(req.params.id);

        // Validate the organization ID
        if (!Number.isInteger(organizationId) || organizationId <= 0) {
            const error = new Error('Organization not found');
            error.status = 404;
            return next(error);
        }

        // Retrieve the organization
        const organization = await getOrganizationById(organizationId);

        if (!organization) {
            const error = new Error('Organization not found');
            error.status = 404;
            return next(error);
        }

        // Retrieve projects belonging to this organization
        const projects = await getProjectsByOrganizationId(organizationId);

        const title = organization.name;

        res.render('organization', {
            title,
            organization,
            projects
        });
    } catch (error) {
        next(error);
    }
};

export {
    buildOrganizationsPage,
    buildOrganizationPage
};