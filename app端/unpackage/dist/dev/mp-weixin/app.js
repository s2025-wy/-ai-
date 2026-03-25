"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/login/login.js";
  "./pages/index/index.js";
  "./pages/job-explore/job-explore.js";
  "./pages/student-profile/student-profile.js";
  "./pages/career-plan/career-plan.js";
  "./pages/user-center/user-center.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:4", "App Launch");
    const token = common_vendor.index.getStorageSync("token");
    if (!token) {
      common_vendor.index.reLaunch({
        url: "/pages/login/login"
      });
    }
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:16", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:19", "App Hide");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.config.globalProperties.$baseUrl = "http://localhost:8000";
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
