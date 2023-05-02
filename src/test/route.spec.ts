import express from 'express';
import request from 'supertest';
import { createRateLimiter } from '../middlewares/rateLimiter';
import router from '../routes';

const app = express();

// Apply the rate limiter middleware to all routes in the router
router.use(createRateLimiter());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', router);
describe('routes tests', () => {
    it('should return 200 status code for the / route', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
    });
    test.each(['email', 'sms'])('should return 200 status code for the /%s route', async (route) => {
        let payroad= {};
        if (route === 'email') {
            payroad = {email: 'email@example.com', subject: 'Hello', message: 'Hello world!'};
        } else if (route === 'sms') {
            payroad = {phoneNumber: '1234567890', message: 'Hello world!'};
        }
        const response = await request(app).post(`/${route}`).send(payroad);
        expect(response.status).toBe(200);
    });
    it('should return 429 status code for too many requests', async () => {
        // Send 10 requests to the /sms route
        for (let i = 0; i < 10; i++) {
            await request(app).post('/sms').send({phoneNumber: '1234567890', message: 'Hello world!'});
        }

        // Send 1 more request to the /sms route
        const response = await request(app).post('/sms').send({phoneNumber: '1234567890', message: 'Hello world!'});

        // Expect the response to have a 429 status code
        expect(response.status).toBe(429);
    });
});
