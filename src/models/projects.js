import db from './db.js';

// Get the next five upcoming service projects
const getAllProjects = async () => {
    const query = `
        SELECT
            sp.project_id,
            sp.title,
            sp.description,
            sp.location,
            sp.project_date,
            o.organization_id,
            o.name AS organization_name
        FROM public.service_project sp
        JOIN public.organization o
            ON sp.organization_id = o.organization_id
        WHERE sp.project_date >= CURRENT_DATE
        ORDER BY sp.project_date
        LIMIT 5;
    `;

    const result = await db.query(query);

    return result.rows;
};

// Get a single service project by its ID
const getProjectById = async (projectId) => {
    const query = `
        SELECT
            sp.project_id,
            sp.title,
            sp.description,
            sp.location,
            sp.project_date,
            to_char(sp.project_date, 'YYYY-MM-DD') AS project_date_input,
            o.organization_id,
            o.name AS organization_name
        FROM public.service_project sp
        JOIN public.organization o
            ON sp.organization_id = o.organization_id
        WHERE sp.project_id = $1;
    `;

    const result = await db.query(query, [projectId]);

    return result.rows[0];
};

// Get all projects belonging to one organization
const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
            project_id,
            title,
            description,
            location,
            project_date
        FROM public.service_project
        WHERE organization_id = $1
        ORDER BY project_date;
    `;

    const result = await db.query(query, [organizationId]);

    return result.rows;
};

// Create a new service project and return its new ID
const createProject = async (title, description, location, projectDate, organizationId) => {
    const query = `
        INSERT INTO public.service_project (title, description, location, project_date, organization_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id;
    `;

    const result = await db.query(query, [title, description, location, projectDate, organizationId]);

    return result.rows[0].project_id;
};

// Update an existing service project
const updateProject = async (projectId, title, description, location, projectDate, organizationId) => {
    const query = `
        UPDATE public.service_project
        SET title = $1,
            description = $2,
            location = $3,
            project_date = $4,
            organization_id = $5
        WHERE project_id = $6
        RETURNING project_id;
    `;

    const result = await db.query(query, [title, description, location, projectDate, organizationId, projectId]);

    return result.rows[0]?.project_id;
};

// Replace a project's categories with the given list of category IDs
const setProjectCategories = async (projectId, categoryIds) => {
    // Remove links to categories that were not selected
    await db.query(`
        DELETE FROM public.project_category
        WHERE project_id = $1
          AND NOT (category_id = ANY($2::int[]));
    `, [projectId, categoryIds]);

    // Add links for the selected categories (existing ones are skipped)
    if (categoryIds.length > 0) {
        await db.query(`
            INSERT INTO public.project_category (project_id, category_id)
            SELECT $1, category_id
            FROM public.category
            WHERE category_id = ANY($2::int[])
            ON CONFLICT DO NOTHING;
        `, [projectId, categoryIds]);
    }
};

export {
    getAllProjects,
    getProjectById,
    getProjectsByOrganizationId,
    createProject,
    updateProject,
    setProjectCategories
};