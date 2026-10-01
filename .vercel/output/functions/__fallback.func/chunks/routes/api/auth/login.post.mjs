import { d as defineEventHandler, r as readBody, a as getSecretKey, c as createError, b as getHeader, e as getRequestIP, s as signToken, f as setCookie, h as useRuntimeConfig } from '../../../_/nitro.mjs';
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

const failedAttemptsMap = /* @__PURE__ */ new Map();
const login_post = defineEventHandler(async (event) => {
  var _a, _b;
  const body = await readBody(event);
  const config = useRuntimeConfig();
  const isProd = true;
  const expectedUser = config.adminUsername || process.env.ADMIN_USERNAME || ("");
  const expectedPassword = config.adminPassword || process.env.ADMIN_PASSWORD || ("");
  if ((!expectedUser || !expectedPassword || !getSecretKey())) {
    console.error("[SECURITY ALERT] Production deployment is missing ADMIN_USERNAME, ADMIN_PASSWORD, or ADMIN_SECRET_KEY in environment variables!");
    throw createError({
      statusCode: 500,
      statusMessage: "Server configuration error: Administrator environment variables are not configured."
    });
  }
  const clientIp = ((_b = (_a = getHeader(event, "x-forwarded-for")) == null ? void 0 : _a.split(",")[0]) == null ? void 0 : _b.trim()) || getRequestIP(event) || "unknown";
  const attemptRecord = failedAttemptsMap.get(clientIp);
  const now = Date.now();
  if (attemptRecord && attemptRecord.lockedUntil > now) {
    const remainingSeconds = Math.ceil((attemptRecord.lockedUntil - now) / 1e3);
    throw createError({
      statusCode: 429,
      statusMessage: `Too many failed attempts. Temporary cooldown in effect. Try again in ${remainingSeconds}s.`
    });
  }
  const { username, password } = body || {};
  if (!username || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Username and password are required"
    });
  }
  const isUserValid = Boolean(expectedUser && username === expectedUser);
  const isPasswordValid = Boolean(expectedPassword && password === expectedPassword);
  if (isUserValid && isPasswordValid) {
    failedAttemptsMap.delete(clientIp);
    const token = signToken({
      user: username,
      role: "SUPER_ADMIN",
      timestamp: Date.now()
    });
    setCookie(event, "nbtf_admin_token", token, {
      httpOnly: true,
      secure: isProd,
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
      details: `Successful administrator authentication from IP: ${clientIp}`
    });
    return {
      success: true,
      user: {
        username,
        role: "SUPER_ADMIN"
      }
    };
  }
  const currentAttempts = ((attemptRecord == null ? void 0 : attemptRecord.count) || 0) + 1;
  let lockedUntil = 0;
  if (currentAttempts >= 5) {
    lockedUntil = now + 60 * 1e3 * 5;
  } else if (currentAttempts >= 3) {
    lockedUntil = now + 30 * 1e3;
  }
  failedAttemptsMap.set(clientIp, {
    count: currentAttempts,
    lockedUntil
  });
  await new Promise((resolve) => setTimeout(resolve, 600));
  await addAuditLog({
    id: "auth-fail-" + Date.now(),
    action: "Failed Login Attempt",
    target: "system",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    user: username || "unknown",
    details: `Failed credentials attempt (Count: ${currentAttempts}) from IP: ${clientIp}`
  });
  throw createError({
    statusCode: 401,
    statusMessage: "Invalid administrator credentials"
  });
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
