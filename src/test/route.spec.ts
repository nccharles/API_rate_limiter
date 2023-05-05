import request from 'supertest';
import app from '../index';
import {randomUUID} from "crypto";
import Redis from'ioredis'

const redisClient = new Redis("redis://default:DxIdn1ucSsAiXsMlY11Yq3TIo7VkjmdJ@redis-19696.c293.eu-central-1-1.ec2.cloud.redislabs.com:19696");

describe('Testing endpoints', () => {
    beforeEach(async () => {
        // Delete all data in Redis before running the test
        await redisClient.flushdb();
    });

    afterAll(async () => {
        // Close the Redis connection after running the test
        await redisClient.quit();
    });
    it('should return 200 status code for the /api/v3 route', async () => {
        const response = await request(app).get('/api/v3').set('client-id', randomUUID());
        expect(response.status).toBe(200);
    });
    test.each(['email', 'sms'])('should return 200 status code for the /api/v3/%s route', async (route) => {
        let payroad= {};
        if (route === 'email') {
            payroad = {email: 'email@example.com', subject: 'Hello', message: 'Hello world!'};
        } else if (route === 'sms') {
            payroad = {phoneNumber: '1234567890', message: 'Hello world!'};
        }
        const response = await request(app).post(`/api/v3/${route}`).set('client-id', randomUUID()).send(payroad);
        expect(response.status).toBe(200);
    });
    it('should return 429 status code for too many requests', async () => {
        // Send 1 requests to the /sms route
        await request(app).post('/api/v3/sms').send({phoneNumber: '1234567890', message: 'Hello world!'});
        // Send 1 more request to the /sms route
        const response = await request(app).post('/api/v3/sms').send({phoneNumber: '1234567890', message: 'Hello world!'});

        // Expect the response to have a 429 status code
        expect(response.status).toBe(429);
    });

    it('should return 429 status code for too many requests across the entire system', async () => {
        const requests = [];

        // Send 10 requests to the /sms route
        for (let i = 0; i < 10; i++) {
            const requestPromise = request(app)
                .post('/api/v3/sms')
                .set('client-id', randomUUID())
                .send({phoneNumber: '1234567890', message: 'Hello world!'});

            requests.push(requestPromise);
        }

        // Send 1 more request to the /sms route
        const additionalRequest = request(app)
            .post('/api/v3/sms')
            .set('client-id', randomUUID())
            .send({phoneNumber: '1234567890', message: 'Hello world!'});

        requests.push(additionalRequest);

        // Wait for all requests to complete
        const responses = await Promise.all(requests);

        // Expect the last response to have a 429 status code
        expect(responses[responses.length - 1].status).toBe(429);
    });

    it('should return 429 status code for too many requests from a specific client on a per-month basis', async () => {
        // Send 100 requests to the /sms route
        const clientID=randomUUID()
        const requests = [];

        // Send 100 requests to the /sms route
        for (let i = 0; i < 100; i++) {
            const requestPromise = request(app)
                .post('/api/v3/sms')
                .set('client-id', clientID)
                .send({phoneNumber: '1234567890', message: 'Hello world!'});

            requests.push(requestPromise);
        }

        // Send 1 more request to the /sms route
        const additionalRequest = request(app)
            .post('/api/v3/sms')
            .set('client-id', clientID)
            .send({phoneNumber: '1234567890', message: 'Hello world!'});

        requests.push(additionalRequest);

        // Wait for all requests to complete
        const responses = await Promise.all(requests);

        // Expect the last response to have a 429 status code
        expect(responses[responses.length - 1].status).toBe(429);
    });
});
