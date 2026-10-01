import { d as defineEventHandler } from '../../_/nitro.mjs';
import { b as getRedisClient } from '../../_/adminRedis.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@upstash/redis';
import 'ioredis';

const health_get = defineEventHandler(async () => {
  const redis = getRedisClient();
  return {
    status: "ok",
    service: "adminpanel-nbtf-ca",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    redisMode: redis.type
  };
});

export { health_get as default };
//# sourceMappingURL=health.get.mjs.map
