import express from 'express';
import { rateLimiterMiddleware, rateLimiterRedisMiddleware, globalRateLimiterRedisMiddleware} from "../middlewares/rateLimiter";
import { sendEmail } from '../controllers/email.controller';
import { sendSMS } from '../controllers/sms.controller';
import swaggerUi from 'swagger-ui-express';

const swaggerDocument = require('../../swagger.json');


const router = express.Router();
router.use(rateLimiterMiddleware)
router.use(globalRateLimiterRedisMiddleware)
router.use(rateLimiterRedisMiddleware)

// Route for the root path
router.use('/api-docs',  swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router.get('/', (req, res) => {
    return res.status(200).json({ status: 200, message: 'Welcome to the Notification Service API!' });
});
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
