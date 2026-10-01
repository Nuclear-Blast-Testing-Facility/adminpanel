import { d as defineEventHandler, r as readBody } from '../../_/nitro.mjs';
import { d as getWwwData, e as setWwwData } from '../../_/adminRedis.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@upstash/redis';
import 'ioredis';

const wwwData = defineEventHandler(async (event) => {
  if (event.method === "GET") {
    const data = await getWwwData();
    return {
      success: true,
      data
    };
  }
  if (event.method === "POST") {
    const body = await readBody(event);
    const user = event.context.user || "admin";
    const success = await setWwwData(body, user);
    return {
      success,
      message: success ? "Game reference data saved to Redis successfully" : "Failed to save to Redis"
    };
  }
});

export { wwwData as default };
//# sourceMappingURL=www-data.mjs.map
