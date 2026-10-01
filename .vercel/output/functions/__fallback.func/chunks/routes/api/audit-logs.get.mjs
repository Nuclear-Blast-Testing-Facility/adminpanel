import { d as defineEventHandler } from '../../_/nitro.mjs';
import { g as getAuditLogs } from '../../_/adminRedis.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@upstash/redis';
import 'ioredis';

const auditLogs_get = defineEventHandler(async () => {
  const logs = await getAuditLogs();
  return {
    success: true,
    logs
  };
});

export { auditLogs_get as default };
//# sourceMappingURL=audit-logs.get.mjs.map
