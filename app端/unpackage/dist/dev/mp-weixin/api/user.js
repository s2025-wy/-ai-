"use strict";
const common_vendor = require("../common/vendor.js");
const utils_request = require("../utils/request.js");
const userApi = {
  // 获取验证码
  getCaptcha() {
    return common_vendor.index.request({
      url: "http://localhost:8000/auth/captcha",
      method: "GET",
      responseType: "arraybuffer"
    });
  },
  // 登录
  login(username, password, captcha, captchaId) {
    return utils_request.request.post("/auth/login", {
      username,
      password,
      captcha,
      captchaId
    });
  },
  // 注册
  register(userData) {
    return utils_request.request.post("/auth/register", userData);
  },
  // 退出登录
  logout() {
    return utils_request.request.post("/auth/logout");
  },
  // 获取当前用户信息
  getCurrentUser() {
    return utils_request.request.get("/auth/me");
  }
};
exports.userApi = userApi;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/user.js.map
