import Redis from 'ioredis';
import { RateLimiterMemory, RateLimiterRedis } from 'rate-limiter-flexible';


const MEMORY_RATE_LIMIT_OPTIONS = {
    points: 1, // Number of requests allowed
    duration: 1, // Time frame in seconds
};

const MONTHLY_RATE_LIMIT_OPTIONS = {
    points: 100, // Number of requests allowed
    duration: 30 * 24 * 60 * 60, // Time frame in seconds (30 days)
};

const GLOBAL_RATE_LIMIT_OPTIONS = {
    points: 10, // Number of requests allowed
    duration: 1, // Time frame in seconds
};

const CLIENT_ID_HEADER_NAME = 'Client_ID';
const SOFT_LIMIT = 3;

const redisClient = new Redis('redis://default:DxIdn1ucSsAiXsMlY11Yq3TIo7VkjmdJ@redis-19696.c293.eu-central-1-1.ec2.cloud.redislabs.com:19696'); // Replace with your Redis URL

// Create a memory-based rate limiter for requests within the same time window from a client
const rateLimiterMemory = new RateLimiterMemory(MEMORY_RATE_LIMIT_OPTIONS);


// Create a Redis-based rate limiter for requests from a specific client on a per-month basis
const rateLimiterRedis = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'rateLimiter',
    ...MONTHLY_RATE_LIMIT_OPTIONS,
});

// Create a Redis-based rate limiter for requests across the entire system
const globalRateLimiterRedis = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'globalRateLimiter',
    ...GLOBAL_RATE_LIMIT_OPTIONS,
});

export { rateLimiterMemory, rateLimiterRedis, globalRateLimiterRedis, CLIENT_ID_HEADER_NAME, SOFT_LIMIT,redisClient };