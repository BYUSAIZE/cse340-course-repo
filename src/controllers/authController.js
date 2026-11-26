import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import { createUser, getUserByEmail } from '../models/users.js';

const SALT_ROUNDS = 10;

// Validation rules for the register form
const registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ max: 100 }).withMessage('Name cannot be longer than 100 characters'),
    body('email')
        .trim()
        .toLowerCase()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Email must be a valid email address')
        .isLength({ max: 255 }).withMessage('Email cannot be longer than 255 characters'),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('confirmPassword')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Passwords do not match')
];

// Validation rules for the login form
const loginValidation = [
    body('email')
        .trim()
        .toLowerCase()
        .notEmpty().withMessage('Email is required'),
    body('password')
        .notEmpty().withMessage('Password is required')
];

// Display the register form
const buildRegisterPage = (req, res) => {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }

    res.render('register', {
        title: 'Register',
        errors: [],
        formData: { name: '', email: '' }
    });
};

// Process the register form
const processRegister = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        const { name, email, password } = req.body;

        if (!errors.isEmpty()) {
            return res.status(400).render('register', {
                title: 'Register',
                errors: errors.array(),
                formData: { name, email }
            });
        }

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return res.status(400).render('register', {
                title: 'Register',
                errors: [{ msg: 'An account with that email already exists' }],
                formData: { name, email }
            });
        }

        // Store only the hash, never the plain password
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        await createUser(name, email, passwordHash);

        req.session.flash = { type: 'success', message: 'Account created. Please log in.' };
        res.redirect('/login');
    } catch (error) {
        next(error);
    }
};

// Display the login form
const buildLoginPage = (req, res) => {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }

    res.render('login', {
        title: 'Log In',
        errors: [],
        formData: { email: '' }
    });
};

// Process the login form
const processLogin = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        const { email, password } = req.body;

        if (!errors.isEmpty()) {
            return res.status(400).render('login', {
                title: 'Log In',
                errors: errors.array(),
                formData: { email }
            });
        }

        const user = await getUserByEmail(email);
        const passwordMatches = user
            ? await bcrypt.compare(password, user.password_hash)
            : false;

        // Same message for a wrong email or a wrong password
        if (!passwordMatches) {
            return res.status(400).render('login', {
                title: 'Log In',
                errors: [{ msg: 'Invalid email or password' }],
                formData: { email }
            });
        }

        // New session ID on login, so an old session ID can't be reused
        req.session.regenerate((error) => {
            if (error) {
                return next(error);
            }

            req.session.user = {
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                role: user.role
            };
            req.session.flash = { type: 'success', message: `Welcome, ${user.name}.` };

            res.redirect('/dashboard');
        });
    } catch (error) {
        next(error);
    }
};

// Log the user out
const processLogout = (req, res, next) => {
    req.session.destroy((error) => {
        if (error) {
            return next(error);
        }

        res.clearCookie('connect.sid');
        res.redirect('/');
    });
};

// Display the dashboard (requires login)
const buildDashboardPage = (req, res) => {
    res.render('dashboard', { title: 'Dashboard' });
};

export {
    registerValidation,
    loginValidation,
    buildRegisterPage,
    processRegister,
    buildLoginPage,
    processLogin,
    processLogout,
    buildDashboardPage
};