import { d as defineEventHandler, r as readBody } from '../../_/nitro.mjs';
import { c as getDirectoryData, s as setDirectoryData } from '../../_/adminRedis.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@upstash/redis';
import 'ioredis';

const indexData = defineEventHandler(async (event) => {
  if (event.method === "GET") {
    const data = await getDirectoryData();
    return {
      success: true,
      data
    };
  }
  if (event.method === "POST") {
    const body = await readBody(event);
    const user = event.context.user || "admin";
    const success = await setDirectoryData(body, user);
    return {
      success,
      message: success ? "Directory data saved to Redis successfully" : "Failed to save to Redis"
    };
  }
});

export { indexData as default };
//# sourceMappingURL=index-data.mjs.map
