"use strict";
const common_vendor = require("../../common/vendor.js");
const config_index = require("../../config/index.js");
const stores_user = require("../../stores/user.js");
const _sfc_main = {
  data() {
    return {
      isLoginMode: true,
      isLoading: false,
      captchaUrl: "",
      captchaId: "",
      loginForm: {
        username: "",
        password: "",
        captcha: "",
        remember: false
      },
      registerForm: {
        username: "",
        email: "",
        name: "",
        password: "",
        confirmPassword: ""
      }
    };
  },
  onLoad() {
    this.refreshCaptcha();
  },
  methods: {
    async refreshCaptcha() {
      try {
        common_vendor.index.__f__("log", "at pages/login/login.vue:201", "请求验证码，URL:", config_index.appConfig.baseUrl + "/auth/captcha");
        common_vendor.index.request({
          url: config_index.appConfig.baseUrl + "/auth/captcha",
          method: "GET",
          responseType: "arraybuffer",
          success: (res) => {
            var _a, _b;
            common_vendor.index.__f__("log", "at pages/login/login.vue:207", "验证码响应:", res);
            common_vendor.index.__f__("log", "at pages/login/login.vue:208", "响应头:", res.header);
            if (res.statusCode === 200) {
              const base64 = common_vendor.index.arrayBufferToBase64(res.data);
              this.captchaUrl = "data:image/png;base64," + base64;
              this.captchaId = ((_a = res.header) == null ? void 0 : _a["x-captcha-id"]) || ((_b = res.header) == null ? void 0 : _b["X-Captcha-Id"]) || "";
              common_vendor.index.__f__("log", "at pages/login/login.vue:213", "验证码ID:", this.captchaId);
            }
          },
          fail: (e) => {
            common_vendor.index.__f__("error", "at pages/login/login.vue:217", "验证码错误", e);
          }
        });
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/login/login.vue:221", "验证码错误", e);
      }
    },
    async handleLogin() {
      var _a, _b;
      if (!this.loginForm.username || !this.loginForm.password || !this.loginForm.captcha) {
        common_vendor.index.showToast({ title: "请完善信息", icon: "none" });
        return;
      }
      if (!this.captchaId) {
        common_vendor.index.showToast({ title: "验证码异常，请刷新", icon: "none" });
        return;
      }
      this.isLoading = true;
      const loginData = {
        username: this.loginForm.username,
        password: this.loginForm.password,
        captcha: this.loginForm.captcha,
        captchaId: this.captchaId
      };
      common_vendor.index.__f__("log", "at pages/login/login.vue:243", "登录请求数据:", loginData);
      try {
        await stores_user.useUserStore.login(
          this.loginForm.username,
          this.loginForm.password,
          this.loginForm.captcha,
          this.captchaId,
          this.loginForm.remember
        );
        common_vendor.index.showToast({ title: "登录成功", icon: "success" });
        setTimeout(() => {
          common_vendor.index.switchTab({ url: "/pages/index/index" });
        }, 1e3);
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/login/login.vue:259", "登录错误详情:", err);
        common_vendor.index.showToast({ title: (err == null ? void 0 : err.message) || ((_a = err == null ? void 0 : err.data) == null ? void 0 : _a.detail) || ((_b = err == null ? void 0 : err.data) == null ? void 0 : _b.msg) || "登录失败", icon: "none" });
        this.refreshCaptcha();
      } finally {
        this.isLoading = false;
      }
    },
    async handleRegister() {
      var _a;
      if (this.registerForm.password !== this.registerForm.confirmPassword) {
        common_vendor.index.showToast({ title: "两次密码不一致", icon: "none" });
        return;
      }
      this.isLoading = true;
      try {
        await stores_user.useUserStore.register({
          username: this.registerForm.username,
          email: this.registerForm.email,
          name: this.registerForm.name,
          password: this.registerForm.password
        });
        common_vendor.index.showToast({ title: "注册成功" });
        this.isLoginMode = true;
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/login/login.vue:286", err);
        common_vendor.index.showToast({ title: ((_a = err == null ? void 0 : err.data) == null ? void 0 : _a.msg) || "注册失败", icon: "none" });
      } finally {
        this.isLoading = false;
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.isLoginMode ? 1 : "",
    b: common_vendor.o(($event) => $data.isLoginMode = true),
    c: !$data.isLoginMode ? 1 : "",
    d: common_vendor.o(($event) => $data.isLoginMode = false),
    e: $data.isLoginMode
  }, $data.isLoginMode ? common_vendor.e({
    f: $data.isLoading,
    g: $data.loginForm.username,
    h: common_vendor.o(($event) => $data.loginForm.username = $event.detail.value),
    i: $data.isLoading,
    j: $data.loginForm.password,
    k: common_vendor.o(($event) => $data.loginForm.password = $event.detail.value),
    l: $data.isLoading,
    m: $data.loginForm.captcha,
    n: common_vendor.o(($event) => $data.loginForm.captcha = $event.detail.value),
    o: $data.captchaUrl
  }, $data.captchaUrl ? {
    p: $data.captchaUrl
  } : {}, {
    q: common_vendor.o((...args) => $options.refreshCaptcha && $options.refreshCaptcha(...args)),
    r: $data.loginForm.remember,
    s: common_vendor.o(($event) => $data.loginForm.remember = $event.detail.value),
    t: $data.isLoading,
    v: common_vendor.t($data.isLoading ? "登录中..." : "登录"),
    w: $data.isLoading ? 1 : "",
    x: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args)),
    y: $data.isLoading
  }) : {
    z: $data.isLoading,
    A: $data.registerForm.username,
    B: common_vendor.o(($event) => $data.registerForm.username = $event.detail.value),
    C: $data.isLoading,
    D: $data.registerForm.email,
    E: common_vendor.o(($event) => $data.registerForm.email = $event.detail.value),
    F: $data.isLoading,
    G: $data.registerForm.name,
    H: common_vendor.o(($event) => $data.registerForm.name = $event.detail.value),
    I: $data.isLoading,
    J: $data.registerForm.password,
    K: common_vendor.o(($event) => $data.registerForm.password = $event.detail.value),
    L: $data.isLoading,
    M: $data.registerForm.confirmPassword,
    N: common_vendor.o(($event) => $data.registerForm.confirmPassword = $event.detail.value),
    O: common_vendor.t($data.isLoading ? "注册中..." : "注册"),
    P: $data.isLoading ? 1 : "",
    Q: common_vendor.o((...args) => $options.handleRegister && $options.handleRegister(...args)),
    R: $data.isLoading
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e4e4508d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
