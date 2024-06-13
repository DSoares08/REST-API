import express from 'express';

import { webhook } from '../controllers/webhook.js';

const router = express.Router();

router.post('/', webhook)

export default router;
