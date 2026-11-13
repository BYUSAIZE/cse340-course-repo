import express from 'express';
import { buildHomePage } from '../controllers/homeController.js';

const router = express.Router();

// Display the home page
router.get('/', buildHomePage);

export default router;