import express from 'express';

import { requireLogin, requireRole } from '../middleware/auth.js';

import {
    registerValidation,
    loginValidation,
    buildRegisterPage,
    processRegister,
    buildLoginPage,
    processLogin,
    processLogout,
    buildDashboardPage
} from '../controllers/authController.js';

import { buildUsersPage } from '../controllers/userController.js';

const router = express.Router();

// Register
router.get('/register', buildRegisterPage);
router.post('/register', registerValidation, processRegister);

// Login and logout
router.get('/login', buildLoginPage);
router.post('/login', loginValidation, processLogin);
router.get('/logout', processLogout);

// Dashboard (any logged-in user)
router.get('/dashboard', requireLogin, buildDashboardPage);

// Users page (admin only)
router.get('/users', requireLogin, requireRole('admin'), buildUsersPage);

export default router;