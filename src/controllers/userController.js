import { getAllUsers } from '../models/users.js';

// Display all registered users (admin only)
const buildUsersPage = async (req, res, next) => {
    try {
        const users = await getAllUsers();
        const title = 'Registered Users';

        res.render('users', {
            title,
            users
        });
    } catch (error) {
        next(error);
    }
};

export { buildUsersPage };