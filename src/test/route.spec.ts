import request from 'supertest';
import app from '../index';

describe('routes tests', () => {
    afterAll(async () => {
        await new Promise(resolve => setTimeout(() => resolve(app), 500));
    });
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
