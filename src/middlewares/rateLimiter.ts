import express from 'express';
import {
    CLIENT_ID_HEADER_NAME,
    globalRateLimiterRedis,
    rateLimiterMemory,
    rateLimiterRedis,
    SOFT_LIMIT
} from '../constants/index'



// Middleware for rate limiting requests within the same time window from a client
const delayMiddleware = (delay: number, next: express.NextFunction) => {
    setTimeout(() => next(), delay);
};

export const rateLimiterMiddleware = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) => {
    const clientId: any = req.headers[CLIENT_ID_HEADER_NAME] || req.ip;

    await rateLimiterMemory.consume(clientId).then((rateLimiterResponse) => {
        rateLimiterResponse.remainingPoints < SOFT_LIMIT ? delayMiddleware(rateLimiterResponse.msBeforeNext || 0, next) : next();
    }).catch((error: any) => {
        return res.status(429).json({ status: 429, message: 'Too many requests, please try again later.' });
    });
};

// Middleware for rate limiting requests from a specific client on a per-month basis
export const rateLimiterRedisMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const clientId: any = req.headers[CLIENT_ID_HEADER_NAME] || req.ip;
 await rateLimiterRedis.consume(clientId, 1).then((rateLimiterResponse) => {
        next();
    }).catch((error: any) => {
        return res.status(429).json({ status: 429, message: 'Too many requests, please try again later.' });
    })
};

// Middleware for rate limiting requests across the entire system
export const globalRateLimiterRedisMiddleware = async (req : express.Request, res: express.Response, next: express.NextFunction) => {
        await globalRateLimiterRedis.consume('global', 1).then((rateLimiterResponse) => {
        next();
    }).catch((error:any) => {
        return res.status(429).json({ status: 429, message: 'Too many requests, please try again later.' });
    })
}


