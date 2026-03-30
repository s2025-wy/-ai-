"use strict";
const utils_request = require("../utils/request.js");
const agentApi = {
  sendMessage(userId, message) {
    return utils_request.request.post("/agent/send-message", null, {
      params: {
        user_id: userId,
        message
      }
    });
  }
};
exports.agentApi = agentApi;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/agent.js.map
