import { RateLimiterMemory, RateLimiterRedis } from 'rate-limiter-flexible'
import Redis from'ioredis'
import express from 'express';

// Define the rate limiting options
const rateLimitOptions = {
  points: 1, // Number of requests allowed
  duration: 1, // Time frame in seconds
};

// Create a memory-based rate limiter for requests within the same time window from a client
const rateLimiterMemory = new RateLimiterMemory(rateLimitOptions);

// Create a Redis-based rate limiter for requests from a specific client on a per-month basis
const redisClient = new Redis("redis://default:DxIdn1ucSsAiXsMlY11Yq3TIo7VkjmdJ@redis-19696.c293.eu-central-1-1.ec2.cloud.redislabs.com:19696"); // Replace with your Redis URL
const rateLimiterRedis = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rateLimiter',
  points: 100, // Number of requests allowed
  duration: 30 * 24 * 60 * 60, // Time frame in seconds (30 days)
});

const globalRateLimiterRedis = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'globalRateLimiter',
    points: 10, // Number of requests allowed
    duration: 1, // Time frame in seconds
});

// Middleware for rate limiting requests within the same time window from a client
export const rateLimiterMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const clientId: any = req.headers['client-id'] || req.ip; // Replace with your client ID header
  rateLimiterMemory.consume(clientId)
      .then(() => {
        next();
      })
      .catch(() => {
        return res.status(429).json({ status: 429, message: `Too many requests, please try again later.` });
      });
};

// Middleware for rate limiting requests from a specific client on a per-month basis
export const rateLimiterRedisMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const clientId: any = req.headers['client-id'] || req.ip; // Replace with your client ID header
  rateLimiterRedis.consume(clientId, 1)
      .then(() => {
        next();
      })
      .catch(() => {
        return res.status(429).json({ status: 429, message: `Too many requests, please try again later.` });
      });
};

// Middleware for rate limiting requests across the entire system
export const globalRateLimiterRedisMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const clientId = 'global';
    globalRateLimiterRedis.consume(clientId, 1)
      .then(() => {
        next();
      })
      .catch(() => {
        return res.status(429).json({ status: 429, message: `Too many requests, please try again later.` });
      });
};

