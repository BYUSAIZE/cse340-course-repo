// Require a logged-in user
const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        req.session.flash = { type: 'error', message: 'Please log in to view that page.' };
        return res.redirect('/login');
    }

    next();
};

// Require a logged-in user with a specific role
const requireRole = (role) => {
    return (req, res, next) => {
        const user = req.session.user;

        if (!user) {
            req.session.flash = { type: 'error', message: 'Please log in to view that page.' };
            return res.redirect('/login');
        }

        if (user.role !== role) {
            req.session.flash = { type: 'error', message: 'You do not have permission to view that page.' };
            return res.redirect('/dashboard');
        }

        next();
    };
};

export { requireLogin, requireRole };