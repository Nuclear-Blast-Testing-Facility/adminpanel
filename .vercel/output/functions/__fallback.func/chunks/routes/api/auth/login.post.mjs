import { d as defineEventHandler, r as readBody, c as createError, s as signToken, a as setCookie, b as useRuntimeConfig } from '../../../_/nitro.mjs';
import { a as addAuditLog } from '../../../_/adminRedis.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@upstash/redis';
import 'ioredis';

const login_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();
  const expectedUser = config.adminUsername || process.env.ADMIN_USERNAME || "admin";
  const expectedPassword = config.adminPassword || process.env.ADMIN_PASSWORD || "nbtf-2026-secure";
  const { username, password } = body || {};
  if (!username || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Username and password are required"
    });
  }
  if (username === expectedUser && password === expectedPassword) {
    const token = signToken({
      user: username,
      role: "SUPER_ADMIN",
      timestamp: Date.now()
    });
    setCookie(event, "nbtf_admin_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      // 7 days
      path: "/"
    });
    await addAuditLog({
      id: "auth-" + Date.now(),
      action: "Admin Login",
      target: "system",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      user: username,
      details: "Successful administrator credential verification"
    });
    return {
      success: true,
      user: {
        username,
        role: "SUPER_ADMIN"
      }
    };
  }
  await addAuditLog({
    id: "auth-fail-" + Date.now(),
    action: "Failed Login Attempt",
    target: "system",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    user: username || "unknown",
    details: "Invalid access credentials supplied"
  });
  throw createError({
    statusCode: 401,
    statusMessage: "Invalid administrator credentials"
  });
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
