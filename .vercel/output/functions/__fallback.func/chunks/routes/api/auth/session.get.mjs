import { d as defineEventHandler, f as getCookie, h as getHeader, v as verifyToken } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const session_get = defineEventHandler(async (event) => {
  var _a;
  const token = getCookie(event, "nbtf_admin_token") || ((_a = getHeader(event, "authorization")) == null ? void 0 : _a.replace("Bearer ", ""));
  if (!token) {
    return {
      authenticated: false,
      user: null
    };
  }
  const payload = verifyToken(token);
  if (payload && payload.user) {
    return {
      authenticated: true,
      user: {
        username: payload.user,
        role: payload.role || "SUPER_ADMIN"
      }
    };
  }
  return {
    authenticated: false,
    user: null
  };
});

export { session_get as default };
//# sourceMappingURL=session.get.mjs.map
