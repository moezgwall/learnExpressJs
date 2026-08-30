// REDIS CACHING /+/ RATE LIMITER 

import { createClient, RedisClientType } from 'redis';
import { process } from 'zod/v4/core';

const redisClient: RedisClientType = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.error(err));

async function connectRedis() {
  if (!redisClient.isOpen) await redisClient.connect();
}

async function checkRateLimit(key: string, limit: number, windowS: number): Promise<{ allowed: boolean, remaining: number }> {
  const redisKey = `ratelimit:${key}`;
  const count = await redisClient.incr(redisKey);
  if (count === 1) {
    await redisClient.expire(redisKey, windowS);
  }
  const allowed = count <= limit;
  const remaining = Math.max(0, limit - count);

  return { allowed, remaining };
}

async function gsCache<T>(key: string, ttls: number, fetcher: () => Promise<T>): Promise<T> {
  const cached = await redisClient.get(key);
  if (cached) {
    return JSON.parse(cached) as T;
  }
  const fresh = await fetcher();
  await redisClient.set(key, JSON.stringify(fresh), { expireIn: ttls });
  return fresh;
}

// const userId = (req.header['x-user-id'] as string) || req.ip;
// const {allowed,remaining} = await checkRateLimit(userId,50,30);
// res.setHeader('X-RateLimit-Remaining',remaining.toString());
// if (!allowed) res.status(429).json({error : "too many request"});

