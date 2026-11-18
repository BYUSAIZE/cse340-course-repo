import { body, validationResult } from 'express-validator';

import {
    getAllOrganizations,
    getOrganizationById,
    createOrganization,
    updateOrganization
} from '../models/organizations.js';

import { getProjectsByOrganizationId } from '../models/projects.js';

// Logo used for newly created organizations (must exist in public/images)
const DEFAULT_LOGO = 'placeholder-logo.png';

// Validation rules shared by the create and edit forms
const organizationValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Organization name is required')
        .isLength({ min: 3, max: 150 }).withMessage('Organization name must be between 3 and 150 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 500 }).withMessage('Description cannot be longer than 500 characters'),
    body('contactEmail')
        .trim()
        .notEmpty().withMessage('Contact email is required')
        .isEmail().withMessage('Contact email must be a valid email address')
        .isLength({ max: 255 }).withMessage('Contact email cannot be longer than 255 characters')
];

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

// Display the create organization form
const buildNewOrganizationPage = (req, res) => {
    res.render('new-organization', {
        title: 'New Organization',
        errors: [],
        organization: { name: '', description: '', contact_email: '' }
    });
};

// Process the create organization form
const processNewOrganization = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        const { name, description, contactEmail } = req.body;

        if (!errors.isEmpty()) {
            return res.status(400).render('new-organization', {
                title: 'New Organization',
                errors: errors.array(),
                organization: { name, description, contact_email: contactEmail }
            });
        }

        await createOrganization(name, description, contactEmail, DEFAULT_LOGO);
        res.redirect('/organizations');
    } catch (error) {
        next(error);
    }
};

// Display the edit organization form
const buildEditOrganizationPage = async (req, res, next) => {
    try {
        const organizationId = Number(req.params.id);

        if (!Number.isInteger(organizationId) || organizationId <= 0) {
            const error = new Error('Organization not found');
            error.status = 404;
            return next(error);
        }

        const organization = await getOrganizationById(organizationId);

        if (!organization) {
            const error = new Error('Organization not found');
            error.status = 404;
            return next(error);
        }

        res.render('edit-organization', {
            title: 'Edit Organization',
            errors: [],
            organization
        });
    } catch (error) {
        next(error);
    }
};

// Process the edit organization form
const processEditOrganization = async (req, res, next) => {
    try {
        const organizationId = Number(req.params.id);

        if (!Number.isInteger(organizationId) || organizationId <= 0) {
            const error = new Error('Organization not found');
            error.status = 404;
            return next(error);
        }

        const errors = validationResult(req);
        const { name, description, contactEmail } = req.body;

        if (!errors.isEmpty()) {
            return res.status(400).render('edit-organization', {
                title: 'Edit Organization',
                errors: errors.array(),
                organization: {
                    organization_id: organizationId,
                    name,
                    description,
                    contact_email: contactEmail
                }
            });
        }

        await updateOrganization(organizationId, name, description, contactEmail);
        res.redirect('/organizations');
    } catch (error) {
        next(error);
    }
};

export {
    organizationValidation,
    buildOrganizationsPage,
    buildOrganizationPage,
    buildNewOrganizationPage,
    processNewOrganization,
    buildEditOrganizationPage,
    processEditOrganization
};