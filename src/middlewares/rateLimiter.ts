import { RateLimiterMemory } from 'rate-limiter-flexible';
import express from 'express';
const rateLimiter = new RateLimiterMemory({
  points: 10, // Number of requests allowed before rate limiting kicks in
  duration: 60, // Duration in seconds of the sliding time window
});

export const createRateLimiter = () => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const rateLimiterResponse = await rateLimiter.consume(req.ip); // Consume 1 point for each request
    //   set the Retry-After header to the number of seconds before the client can retry
    console.log(rateLimiterResponse);
    const retryAfter = rateLimiterResponse.msBeforeNext / 1000;
      res.set('Retry-After',retryAfter.toString() ); // Set the Retry-After header to the number of seconds before the client can retry
      next();
    } catch (rateLimiterResponse: any) {
      // If the rate limiter returns an error, send a 429 (Too Many Requests) response to the client
      return res.status(429).json({ status: 429, message: `Too many requests, please try again in ${rateLimiterResponse.msBeforeNext / 1000} seconds.` });
    }
  };
};
