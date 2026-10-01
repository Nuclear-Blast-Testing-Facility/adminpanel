import { d as defineEventHandler } from '../../_/nitro.mjs';
import { r as resetAllToDefaults } from '../../_/adminRedis.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@upstash/redis';
import 'ioredis';

const resetDefaults_post = defineEventHandler(async (event) => {
  const user = event.context.user || "admin";
  const success = await resetAllToDefaults(user);
  return {
    success,
    message: success ? "Master data successfully reset to defaults" : "Failed to reset data"
  };
});

export { resetDefaults_post as default };
//# sourceMappingURL=reset-defaults.post.mjs.map
