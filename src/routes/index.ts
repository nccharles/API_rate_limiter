import express from 'express';
import { createRateLimiter } from '../middlewares/rateLimiter';
import { sendEmail } from '../controllers/email.controller';
import { sendSMS } from '../controllers/sms.controller';

const router = express.Router();

// Apply rate limiting middleware to all routes
router.use(createRateLimiter());

// Route for sending SMS notifications
router.post('/sms', async (req, res) => {
    const { phoneNumber, message } = req.body;
    const result = await sendSMS(phoneNumber, message);
    return res.status(result.status).json(result);
});

// Route for sending email notifications
router.post('/email', async (req, res) => {
    const { email, subject, message } = req.body;
    const result = await sendEmail(email, subject, message);
    return res.status(result.status).json(result);
});

export default router;
