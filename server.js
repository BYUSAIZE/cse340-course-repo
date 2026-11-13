import { testConnection } from './src/models/db.js';

import homeRoute from './src/routes/homeRoute.js';
import categoryRoute from './src/routes/categoryRoute.js';
import projectRoute from './src/routes/projectRoute.js';
import organizationRoute from './src/routes/organizationRoute.js';

import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Home page
app.use('/', homeRoute);

// Organization routes
app.use('/organizations', organizationRoute);
app.use('/organization', organizationRoute);

// Project routes
app.use('/projects', projectRoute);
app.use('/project', projectRoute);

// Category routes
app.use('/categories', categoryRoute);
app.use('/category', categoryRoute);

// 404 error handler
app.use((req, res, next) => {
    const error = new Error('The page you requested could not be found.');
    error.status = 404;
    next(error);
});

// Global error handler
app.use((error, req, res, next) => {
    const statusCode = error.status || 500;

    const title = statusCode === 404
        ? 'Page Not Found'
        : 'Server Error';

    const message = statusCode === 404
        ? error.message
        : 'Something went wrong while processing your request.';

    res.status(statusCode).render('error', {
        title,
        statusCode,
        message
    });
});

// Start server
app.listen(PORT, async () => {
    try {
        await testConnection();

        console.log(`Server is running at http://127.0.0.1:${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
});