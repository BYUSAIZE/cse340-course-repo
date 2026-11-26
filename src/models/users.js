import db from './db.js';

// Create a new user and return the new ID
const createUser = async (name, email, passwordHash, role = 'user') => {
    const query = `
        INSERT INTO public.users (name, email, password_hash, role)
        VALUES ($1, $2, $3, $4)
        RETURNING user_id;
    `;

    const result = await db.query(query, [name, email, passwordHash, role]);

    return result.rows[0].user_id;
};

// Get one user by email (includes the password hash, for login only)
const getUserByEmail = async (email) => {
    const query = `
        SELECT user_id, name, email, password_hash, role
        FROM public.users
        WHERE email = $1;
    `;

    const result = await db.query(query, [email]);

    return result.rows[0];
};

// Get all users (never selects the password hash)
const getAllUsers = async () => {
    const query = `
        SELECT user_id, name, email, role
        FROM public.users
        ORDER BY name;
    `;

    const result = await db.query(query);

    return result.rows;
};

export { createUser, getUserByEmail, getAllUsers };