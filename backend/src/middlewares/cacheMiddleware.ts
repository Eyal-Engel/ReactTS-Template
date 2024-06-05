import { Request, Response, NextFunction } from "express";
import redisClient from "../redisClient";

const cacheMiddleware = (cacheDuration: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = req.originalUrl;

    try {
      const cachedData = await redisClient.get(key);
      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }

      // Override res.json to cache the response
      const originalJson = res.json.bind(res);
      res.json = (body: any): Response => {
        redisClient.setEx(key, cacheDuration, JSON.stringify(body)); // Cache for specified duration
        return originalJson(body);
      };

      next();
    } catch (error) {
      console.error("Redis cache error:", error);
      next();
    }
  };
};

export default cacheMiddleware;
