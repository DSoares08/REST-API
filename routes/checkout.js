import express from 'express';

import { checkout } from '../controllers/checkout.js';

const router = express.Router();

router.post('/', checkout);

export default router;
