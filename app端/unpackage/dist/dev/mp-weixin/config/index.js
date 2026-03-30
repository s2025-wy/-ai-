"use strict";
const config = {
  dev: {
    baseUrl: "http://localhost:8000"
  },
  prod: {
    baseUrl: "https://your-production-domain.com"
  },
  lan: {
    baseUrl: "http://10.216.80.152:8000"
  }
};
const appConfig = {
  baseUrl: config.lan.baseUrl,
  setBaseUrl(url) {
    this.baseUrl = url;
  }
};
exports.appConfig = appConfig;
//# sourceMappingURL=../../.sourcemap/mp-weixin/config/index.js.map
