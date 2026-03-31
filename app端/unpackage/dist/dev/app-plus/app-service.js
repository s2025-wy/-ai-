if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
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
  const BASE_URL = appConfig.baseUrl;
  function requestInterceptor(options) {
    const token = uni.getStorageSync("token");
    const url = options.url || "";
    const isAuthRequest = url.includes("/auth/login") || url.includes("/auth/register");
    options.header = options.header || {};
    if (token && !isAuthRequest) {
      options.header.Authorization = `Bearer ${token}`;
    }
    options.header["Content-Type"] = "application/json";
    return options;
  }
  function responseInterceptor(response, options) {
    const { statusCode, data } = response;
    const url = options.url || "";
    const isLoginRequest = url.includes("/auth/login");
    if (statusCode >= 200 && statusCode < 300) {
      return { data, status: statusCode, statusCode };
    }
    if (statusCode === 401 && !isLoginRequest) {
      uni.showToast({
        title: "登录已过期，请重新登录",
        icon: "none"
      });
      uni.removeStorageSync("token");
      uni.removeStorageSync("user");
      setTimeout(() => {
        uni.reLaunch({
          url: "/pages/login/login"
        });
      }, 1500);
    } else if (statusCode === 403 && !isLoginRequest) {
      uni.showToast({
        title: "没有权限执行此操作",
        icon: "none"
      });
    } else if (statusCode === 404 && !isLoginRequest) {
      uni.showToast({
        title: "请求的资源不存在",
        icon: "none"
      });
    } else if (statusCode === 500 && !isLoginRequest) {
      uni.showToast({
        title: "服务器内部错误",
        icon: "none"
      });
    }
    return Promise.reject({
      response,
      data,
      status: statusCode,
      statusCode,
      message: (data == null ? void 0 : data.detail) || (data == null ? void 0 : data.msg) || "请求失败"
    });
  }
  function buildQueryParams(params) {
    if (!params || Object.keys(params).length === 0) {
      return "";
    }
    return "?" + Object.keys(params).map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(params[key])).join("&");
  }
  function request(options) {
    return new Promise((resolve, reject) => {
      const finalOptions = requestInterceptor({
        ...options,
        url: BASE_URL + options.url
      });
      formatAppLog("log", "at utils/request.js:93", "发送请求:", {
        url: finalOptions.url,
        method: finalOptions.method,
        data: finalOptions.data,
        headers: finalOptions.header
      });
      uni.request({
        ...finalOptions,
        success: (res) => {
          formatAppLog("log", "at utils/request.js:103", "请求成功响应:", res);
          try {
            const result = responseInterceptor(res, finalOptions);
            resolve(result);
          } catch (err) {
            formatAppLog("log", "at utils/request.js:108", "响应拦截器错误:", err);
            reject(err);
          }
        },
        fail: (err) => {
          formatAppLog("log", "at utils/request.js:113", "请求失败:", err);
          uni.showToast({
            title: "网络错误，请检查后端服务是否启动",
            icon: "none"
          });
          reject(err);
        }
      });
    });
  }
  const request$1 = {
    get(url, data = {}, options = {}) {
      const queryString = buildQueryParams(data);
      return request({
        url: url + queryString,
        method: "GET",
        ...options
      });
    },
    post(url, data = {}, options = {}) {
      let finalUrl = url;
      if (options.params) {
        const queryString = buildQueryParams(options.params);
        finalUrl = url + queryString;
      }
      return request({
        url: finalUrl,
        method: "POST",
        data,
        ...options
      });
    },
    put(url, data = {}, options = {}) {
      return request({
        url,
        method: "PUT",
        data,
        ...options
      });
    },
    delete(url, data = {}, options = {}) {
      const queryString = buildQueryParams(data);
      return request({
        url: url + queryString,
        method: "DELETE",
        ...options
      });
    },
    upload(url, filePath, formData = {}, options = {}) {
      return new Promise((resolve, reject) => {
        const token = uni.getStorageSync("token");
        uni.uploadFile({
          url: BASE_URL + url,
          filePath,
          name: "file",
          formData,
          header: {
            "Authorization": token ? `Bearer ${token}` : ""
          },
          success: (res) => {
            try {
              const data = JSON.parse(res.data);
              resolve(data);
            } catch (err) {
              resolve(res.data);
            }
          },
          fail: reject
        });
      });
    }
  };
  const userApi = {
    // 获取验证码
    getCaptcha() {
      return request$1.get("/auth/captcha", {}, { responseType: "arraybuffer" });
    },
    // 登录
    login(username, password, captcha, captchaId) {
      return request$1.post("/auth/login", {
        username,
        password,
        captcha,
        captchaId
      });
    },
    // 注册
    register(userData) {
      return request$1.post("/auth/register", userData);
    },
    // 退出登录
    logout() {
      return request$1.post("/auth/logout");
    },
    // 获取用户信息
    getUserInfo() {
      return request$1.get("/auth/user");
    },
    // 获取当前用户信息
    getCurrentUser() {
      return request$1.get("/auth/user");
    },
    // 更新用户信息
    updateUserInfo(userData) {
      return request$1.put("/auth/user", userData);
    },
    // 修改密码
    changePassword(passwordData) {
      return request$1.post("/auth/change-password", passwordData);
    },
    // 获取申请记录
    getApplications() {
      return request$1.get("/jobs/applications");
    },
    // 取消申请
    cancelApplication(applicationId) {
      return request$1.delete(`/jobs/applications/${applicationId}`);
    },
    // 获取学生画像进度
    getProfileStep() {
      return request$1.get("/auth/profile-step");
    },
    // 更新学生画像进度
    updateProfileStep(step) {
      return request$1.put("/auth/profile-step", null, { params: { step } });
    }
  };
  const useUserStore = {
    state: {
      token: uni.getStorageSync("token") || null,
      user: uni.getStorageSync("user") ? JSON.parse(uni.getStorageSync("user")) : null,
      isLoading: false,
      error: null
    },
    get isLoggedIn() {
      return !!this.state.token;
    },
    get userRole() {
      var _a;
      return ((_a = this.state.user) == null ? void 0 : _a.role) || "guest";
    },
    async login(username, password, captcha, captchaId, remember = false) {
      try {
        this.state.isLoading = true;
        this.state.error = null;
        const response = await userApi.login(username, password, captcha, captchaId);
        const { token: accessToken, user: userData } = response.data;
        this.state.token = accessToken;
        this.state.user = userData;
        uni.setStorageSync("token", accessToken);
        if (remember) {
          uni.setStorageSync("user", JSON.stringify(userData));
        } else {
          uni.setStorage({
            key: "user",
            data: JSON.stringify(userData)
          });
        }
        return { success: true, message: "登录成功" };
      } catch (err) {
        formatAppLog("error", "at stores/user.js:42", "登录失败:", err);
        this.state.error = err;
        throw err;
      } finally {
        this.state.isLoading = false;
      }
    },
    async register(userData) {
      try {
        this.state.isLoading = true;
        this.state.error = null;
        await userApi.register(userData);
        return { success: true, message: "注册成功" };
      } catch (err) {
        formatAppLog("error", "at stores/user.js:58", "注册失败:", err);
        this.state.error = err;
        throw err;
      } finally {
        this.state.isLoading = false;
      }
    },
    logout() {
      try {
        userApi.logout().catch((err) => {
          formatAppLog("error", "at stores/user.js:69", "退出登录失败:", err);
        });
      } catch (err) {
        formatAppLog("error", "at stores/user.js:72", "退出登录失败:", err);
      } finally {
        this.state.token = null;
        this.state.user = null;
        uni.removeStorageSync("token");
        uni.removeStorageSync("user");
        uni.reLaunch({
          url: "/pages/login/login"
        });
      }
    },
    async fetchCurrentUser() {
      try {
        const response = await userApi.getUserInfo();
        if (response && response.data) {
          this.state.user = response.data;
          uni.setStorageSync("user", JSON.stringify(response.data));
        }
      } catch (err) {
        formatAppLog("error", "at stores/user.js:93", "获取用户信息失败:", err);
      }
    }
  };
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$d = {
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
          formatAppLog("log", "at pages/login/login.vue:201", "请求验证码，URL:", appConfig.baseUrl + "/auth/captcha");
          uni.request({
            url: appConfig.baseUrl + "/auth/captcha",
            method: "GET",
            responseType: "arraybuffer",
            success: (res) => {
              var _a, _b;
              formatAppLog("log", "at pages/login/login.vue:207", "验证码响应:", res);
              formatAppLog("log", "at pages/login/login.vue:208", "响应头:", res.header);
              if (res.statusCode === 200) {
                const base64 = uni.arrayBufferToBase64(res.data);
                this.captchaUrl = "data:image/png;base64," + base64;
                this.captchaId = ((_a = res.header) == null ? void 0 : _a["x-captcha-id"]) || ((_b = res.header) == null ? void 0 : _b["X-Captcha-Id"]) || "";
                formatAppLog("log", "at pages/login/login.vue:213", "验证码ID:", this.captchaId);
              }
            },
            fail: (e) => {
              formatAppLog("error", "at pages/login/login.vue:217", "验证码错误", e);
            }
          });
        } catch (e) {
          formatAppLog("error", "at pages/login/login.vue:221", "验证码错误", e);
        }
      },
      async handleLogin() {
        var _a, _b;
        if (!this.loginForm.username || !this.loginForm.password || !this.loginForm.captcha) {
          uni.showToast({ title: "请完善信息", icon: "none" });
          return;
        }
        if (!this.captchaId) {
          uni.showToast({ title: "验证码异常，请刷新", icon: "none" });
          return;
        }
        this.isLoading = true;
        const loginData = {
          username: this.loginForm.username,
          password: this.loginForm.password,
          captcha: this.loginForm.captcha,
          captchaId: this.captchaId
        };
        formatAppLog("log", "at pages/login/login.vue:243", "登录请求数据:", loginData);
        try {
          await useUserStore.login(
            this.loginForm.username,
            this.loginForm.password,
            this.loginForm.captcha,
            this.captchaId,
            this.loginForm.remember
          );
          uni.showToast({ title: "登录成功", icon: "success" });
          setTimeout(() => {
            uni.switchTab({ url: "/pages/index/index" });
          }, 1e3);
        } catch (err) {
          formatAppLog("error", "at pages/login/login.vue:259", "登录错误详情:", err);
          uni.showToast({ title: (err == null ? void 0 : err.message) || ((_a = err == null ? void 0 : err.data) == null ? void 0 : _a.detail) || ((_b = err == null ? void 0 : err.data) == null ? void 0 : _b.msg) || "登录失败", icon: "none" });
          this.refreshCaptcha();
        } finally {
          this.isLoading = false;
        }
      },
      async handleRegister() {
        var _a;
        if (this.registerForm.password !== this.registerForm.confirmPassword) {
          uni.showToast({ title: "两次密码不一致", icon: "none" });
          return;
        }
        this.isLoading = true;
        try {
          await useUserStore.register({
            username: this.registerForm.username,
            email: this.registerForm.email,
            name: this.registerForm.name,
            password: this.registerForm.password
          });
          uni.showToast({ title: "注册成功" });
          this.isLoginMode = true;
        } catch (err) {
          formatAppLog("error", "at pages/login/login.vue:286", err);
          uni.showToast({ title: ((_a = err == null ? void 0 : err.data) == null ? void 0 : _a.msg) || "注册失败", icon: "none" });
        } finally {
          this.isLoading = false;
        }
      }
    }
  };
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "login-container" }, [
      vue.createElementVNode("view", { class: "login-card" }, [
        vue.createElementVNode("view", { class: "logo-section" }, [
          vue.createElementVNode("view", { class: "logo-icon" }, [
            vue.createElementVNode("text", { class: "logo-text" }, "📚")
          ]),
          vue.createElementVNode("text", { class: "app-title" }, "职业规划系统"),
          vue.createElementVNode("text", { class: "app-subtitle" }, "基于AI的大学生职业规划智能体")
        ]),
        vue.createElementVNode("view", { class: "form-section" }, [
          vue.createElementVNode("view", { class: "mode-switch" }, [
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["mode-tab", { active: $data.isLoginMode }]),
                onClick: _cache[0] || (_cache[0] = ($event) => $data.isLoginMode = true)
              },
              " 登录 ",
              2
              /* CLASS */
            ),
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["mode-tab", { active: !$data.isLoginMode }]),
                onClick: _cache[1] || (_cache[1] = ($event) => $data.isLoginMode = false)
              },
              " 注册 ",
              2
              /* CLASS */
            )
          ]),
          $data.isLoginMode ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "login-form"
          }, [
            vue.createElementVNode("view", { class: "input-group" }, [
              vue.createElementVNode("view", { class: "input-wrapper" }, [
                vue.createElementVNode("text", { class: "input-icon" }, "👤"),
                vue.withDirectives(vue.createElementVNode("input", {
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.loginForm.username = $event),
                  class: "input-field",
                  placeholder: "请输入用户名",
                  disabled: $data.isLoading
                }, null, 8, ["disabled"]), [
                  [vue.vModelText, $data.loginForm.username]
                ])
              ])
            ]),
            vue.createElementVNode("view", { class: "input-group" }, [
              vue.createElementVNode("view", { class: "input-wrapper" }, [
                vue.createElementVNode("text", { class: "input-icon" }, "🔒"),
                vue.withDirectives(vue.createElementVNode("input", {
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.loginForm.password = $event),
                  class: "input-field",
                  type: "password",
                  placeholder: "请输入密码",
                  disabled: $data.isLoading
                }, null, 8, ["disabled"]), [
                  [vue.vModelText, $data.loginForm.password]
                ])
              ])
            ]),
            vue.createElementVNode("view", { class: "input-group" }, [
              vue.createElementVNode("view", { class: "input-wrapper captcha-wrapper" }, [
                vue.createElementVNode("text", { class: "input-icon" }, "🔐"),
                vue.withDirectives(vue.createElementVNode("input", {
                  "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.loginForm.captcha = $event),
                  class: "input-field captcha-input",
                  placeholder: "请输入验证码",
                  maxlength: "4",
                  disabled: $data.isLoading
                }, null, 8, ["disabled"]), [
                  [vue.vModelText, $data.loginForm.captcha]
                ]),
                vue.createElementVNode("view", {
                  class: "captcha-image",
                  onClick: _cache[5] || (_cache[5] = (...args) => $options.refreshCaptcha && $options.refreshCaptcha(...args))
                }, [
                  $data.captchaUrl ? (vue.openBlock(), vue.createElementBlock("image", {
                    key: 0,
                    src: $data.captchaUrl,
                    mode: "aspectFill"
                  }, null, 8, ["src"])) : (vue.openBlock(), vue.createElementBlock("text", { key: 1 }, "加载中..."))
                ])
              ])
            ]),
            vue.createElementVNode("view", { class: "form-options" }, [
              vue.createElementVNode("label", { class: "remember-me" }, [
                vue.createElementVNode("checkbox", {
                  checked: $data.loginForm.remember,
                  onChange: _cache[6] || (_cache[6] = ($event) => $data.loginForm.remember = $event.detail.value),
                  disabled: $data.isLoading
                }, null, 40, ["checked", "disabled"]),
                vue.createElementVNode("text", null, "记住我")
              ])
            ]),
            vue.createElementVNode("button", {
              class: vue.normalizeClass(["btn btn-primary login-btn", { loading: $data.isLoading }]),
              onClick: _cache[7] || (_cache[7] = (...args) => $options.handleLogin && $options.handleLogin(...args)),
              disabled: $data.isLoading
            }, vue.toDisplayString($data.isLoading ? "登录中..." : "登录"), 11, ["disabled"])
          ])) : (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "register-form"
          }, [
            vue.createElementVNode("view", { class: "input-group" }, [
              vue.createElementVNode("view", { class: "input-wrapper" }, [
                vue.createElementVNode("text", { class: "input-icon" }, "👤"),
                vue.withDirectives(vue.createElementVNode("input", {
                  "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $data.registerForm.username = $event),
                  class: "input-field",
                  placeholder: "请输入用户名",
                  disabled: $data.isLoading
                }, null, 8, ["disabled"]), [
                  [vue.vModelText, $data.registerForm.username]
                ])
              ])
            ]),
            vue.createElementVNode("view", { class: "input-group" }, [
              vue.createElementVNode("view", { class: "input-wrapper" }, [
                vue.createElementVNode("text", { class: "input-icon" }, "📧"),
                vue.withDirectives(vue.createElementVNode("input", {
                  "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $data.registerForm.email = $event),
                  class: "input-field",
                  type: "email",
                  placeholder: "请输入邮箱",
                  disabled: $data.isLoading
                }, null, 8, ["disabled"]), [
                  [vue.vModelText, $data.registerForm.email]
                ])
              ])
            ]),
            vue.createElementVNode("view", { class: "input-group" }, [
              vue.createElementVNode("view", { class: "input-wrapper" }, [
                vue.createElementVNode("text", { class: "input-icon" }, "📛"),
                vue.withDirectives(vue.createElementVNode("input", {
                  "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => $data.registerForm.name = $event),
                  class: "input-field",
                  placeholder: "请输入姓名",
                  disabled: $data.isLoading
                }, null, 8, ["disabled"]), [
                  [vue.vModelText, $data.registerForm.name]
                ])
              ])
            ]),
            vue.createElementVNode("view", { class: "input-group" }, [
              vue.createElementVNode("view", { class: "input-wrapper" }, [
                vue.createElementVNode("text", { class: "input-icon" }, "🔒"),
                vue.withDirectives(vue.createElementVNode("input", {
                  "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => $data.registerForm.password = $event),
                  class: "input-field",
                  type: "password",
                  placeholder: "请输入密码",
                  disabled: $data.isLoading
                }, null, 8, ["disabled"]), [
                  [vue.vModelText, $data.registerForm.password]
                ])
              ])
            ]),
            vue.createElementVNode("view", { class: "input-group" }, [
              vue.createElementVNode("view", { class: "input-wrapper" }, [
                vue.createElementVNode("text", { class: "input-icon" }, "🔒"),
                vue.withDirectives(vue.createElementVNode("input", {
                  "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => $data.registerForm.confirmPassword = $event),
                  class: "input-field",
                  type: "password",
                  placeholder: "请确认密码",
                  disabled: $data.isLoading
                }, null, 8, ["disabled"]), [
                  [vue.vModelText, $data.registerForm.confirmPassword]
                ])
              ])
            ]),
            vue.createElementVNode("button", {
              class: vue.normalizeClass(["btn btn-primary register-btn", { loading: $data.isLoading }]),
              onClick: _cache[13] || (_cache[13] = (...args) => $options.handleRegister && $options.handleRegister(...args)),
              disabled: $data.isLoading
            }, vue.toDisplayString($data.isLoading ? "注册中..." : "注册"), 11, ["disabled"])
          ]))
        ])
      ])
    ]);
  }
  const PagesLoginLogin = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$c], ["__scopeId", "data-v-e4e4508d"], ["__file", "D:/计算机编程/A13/app端/pages/login/login.vue"]]);
  const _sfc_main$c = {
    data() {
      return {
        userName: "同学"
      };
    },
    onLoad() {
      const user = useUserStore.state.user;
      if (user && user.username) {
        this.userName = user.username;
      }
    },
    onShow() {
      const user = useUserStore.state.user;
      if (user && user.username) {
        this.userName = user.username;
      }
    },
    methods: {
      navigateTo(url) {
        uni.switchTab({
          url,
          fail: () => {
            uni.navigateTo({
              url
            });
          }
        });
      },
      openAIAssistant() {
        uni.switchTab({
          url: "/pages/ai-assistant/ai-assistant"
        });
      }
    }
  };
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "header" }, [
        vue.createElementVNode("view", { class: "welcome-card" }, [
          vue.createElementVNode("text", { class: "welcome-text" }, "👋 欢迎回来"),
          vue.createElementVNode(
            "text",
            { class: "user-name" },
            vue.toDisplayString($data.userName),
            1
            /* TEXT */
          ),
          vue.createElementVNode("text", { class: "welcome-desc" }, "开始你的职业规划之旅吧！")
        ])
      ]),
      vue.createElementVNode("view", { class: "quick-actions" }, [
        vue.createElementVNode("view", { class: "section-title" }, "快捷入口"),
        vue.createElementVNode("view", { class: "action-grid" }, [
          vue.createElementVNode("view", {
            class: "action-item",
            onClick: _cache[0] || (_cache[0] = ($event) => $options.navigateTo("/pages/job-explore/job-explore"))
          }, [
            vue.createElementVNode("view", { class: "action-icon job-icon" }, "🔍"),
            vue.createElementVNode("text", { class: "action-text" }, "岗位探索")
          ]),
          vue.createElementVNode("view", {
            class: "action-item",
            onClick: _cache[1] || (_cache[1] = ($event) => $options.navigateTo("/pages/student-profile/student-profile"))
          }, [
            vue.createElementVNode("view", { class: "action-icon profile-icon" }, "👤"),
            vue.createElementVNode("text", { class: "action-text" }, "学生画像")
          ]),
          vue.createElementVNode("view", {
            class: "action-item",
            onClick: _cache[2] || (_cache[2] = ($event) => $options.navigateTo("/pages/career-plan/career-plan"))
          }, [
            vue.createElementVNode("view", { class: "action-icon career-icon" }, "📊"),
            vue.createElementVNode("text", { class: "action-text" }, "职业规划")
          ]),
          vue.createElementVNode("view", {
            class: "action-item",
            onClick: _cache[3] || (_cache[3] = ($event) => $options.navigateTo("/pages/interview-prep/interview-prep"))
          }, [
            vue.createElementVNode("view", { class: "action-icon interview-icon" }, "💼"),
            vue.createElementVNode("text", { class: "action-text" }, "面试准备")
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "ai-assistant-section" }, [
        vue.createElementVNode("view", {
          class: "ai-card",
          onClick: _cache[4] || (_cache[4] = (...args) => $options.openAIAssistant && $options.openAIAssistant(...args))
        }, [
          vue.createElementVNode("view", { class: "ai-icon" }, "🤖"),
          vue.createElementVNode("view", { class: "ai-content" }, [
            vue.createElementVNode("text", { class: "ai-title" }, "AI职业助手"),
            vue.createElementVNode("text", { class: "ai-desc" }, "有任何职业问题，随时问我！")
          ]),
          vue.createElementVNode("text", { class: "ai-arrow" }, "›")
        ])
      ]),
      vue.createElementVNode("view", { class: "features" }, [
        vue.createElementVNode("view", { class: "section-title" }, "功能特点"),
        vue.createElementVNode("view", { class: "feature-list" }, [
          vue.createElementVNode("view", { class: "feature-item" }, [
            vue.createElementVNode("view", { class: "feature-icon" }, "🧠"),
            vue.createElementVNode("view", { class: "feature-content" }, [
              vue.createElementVNode("text", { class: "feature-title" }, "AI智能分析"),
              vue.createElementVNode("text", { class: "feature-desc" }, "基于大模型的智能职业规划分析")
            ])
          ]),
          vue.createElementVNode("view", { class: "feature-item" }, [
            vue.createElementVNode("view", { class: "feature-icon" }, "📈"),
            vue.createElementVNode("view", { class: "feature-content" }, [
              vue.createElementVNode("text", { class: "feature-title" }, "知识图谱"),
              vue.createElementVNode("text", { class: "feature-desc" }, "可视化展示岗位关系和技能要求")
            ])
          ]),
          vue.createElementVNode("view", { class: "feature-item" }, [
            vue.createElementVNode("view", { class: "feature-icon" }, "🎯"),
            vue.createElementVNode("view", { class: "feature-content" }, [
              vue.createElementVNode("text", { class: "feature-title" }, "精准匹配"),
              vue.createElementVNode("text", { class: "feature-desc" }, "智能推荐最适合你的岗位")
            ])
          ]),
          vue.createElementVNode("view", { class: "feature-item" }, [
            vue.createElementVNode("view", { class: "feature-icon" }, "💬"),
            vue.createElementVNode("view", { class: "feature-content" }, [
              vue.createElementVNode("text", { class: "feature-title" }, "智能对话"),
              vue.createElementVNode("text", { class: "feature-desc" }, "随时与AI助手交流职业问题")
            ])
          ])
        ])
      ])
    ]);
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$b], ["__scopeId", "data-v-1cf27b2a"], ["__file", "D:/计算机编程/A13/app端/pages/index/index.vue"]]);
  const agentApi = {
    sendMessage(userId, message) {
      return request$1.post("/agent/send-message", null, {
        params: {
          user_id: userId,
          message
        }
      });
    }
  };
  const _sfc_main$b = {
    data() {
      return {
        messages: [],
        inputText: "",
        isLoading: false,
        bottomPadding: "20rpx",
        scrollIntoView: "",
        quickMessages: [
          "前端开发能晋升到哪些岗位？",
          "Java可以转岗到哪些方向？",
          "C/C++的发展路径？"
        ]
      };
    },
    onLoad() {
      this.setSafeArea();
    },
    methods: {
      setSafeArea() {
        var _a;
        const systemInfo = uni.getSystemInfoSync();
        this.bottomPadding = (((_a = systemInfo.safeAreaInsets) == null ? void 0 : _a.bottom) || 0) + 20 + "rpx";
      },
      scrollToBottom() {
        this.$nextTick(() => {
          if (this.messages.length > 0) {
            this.scrollIntoView = "msg-" + (this.messages.length - 1);
          }
        });
      },
      sendQuickMessage(message) {
        this.inputText = message;
        this.sendMessage();
      },
      async sendMessage() {
        var _a, _b;
        if (!this.inputText.trim() || this.isLoading)
          return;
        const userMessage = this.inputText.trim();
        this.inputText = "";
        this.messages.push({
          isUser: true,
          content: userMessage
        });
        this.scrollToBottom();
        this.isLoading = true;
        try {
          const userId = "user_" + Date.now();
          const response = await agentApi.sendMessage(userId, userMessage);
          formatAppLog("log", "at pages/ai-assistant/ai-assistant.vue:131", "API响应:", response);
          if (response && response.data) {
            const aiResponse = ((_a = response.data) == null ? void 0 : _a.response) || ((_b = response.data) == null ? void 0 : _b.message) || "抱歉，我现在无法回答你的问题。";
            this.messages.push({
              isUser: false,
              content: aiResponse
            });
            this.scrollToBottom();
          }
        } catch (err) {
          formatAppLog("error", "at pages/ai-assistant/ai-assistant.vue:142", "请求错误:", err);
          this.messages.push({
            isUser: false,
            content: "抱歉，网络连接失败，请检查网络设置。"
          });
          this.scrollToBottom();
        } finally {
          this.isLoading = false;
        }
      }
    }
  };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("scroll-view", {
        class: "messages-container",
        style: vue.normalizeStyle({ paddingBottom: $data.bottomPadding }),
        "scroll-y": "true",
        "scroll-into-view": $data.scrollIntoView,
        "scroll-with-animation": true
      }, [
        $data.messages.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "empty-state"
        }, [
          vue.createElementVNode("text", { class: "empty-icon" }, "🤖"),
          vue.createElementVNode("text", { class: "empty-title" }, "你好！我是AI职业助手"),
          vue.createElementVNode("text", { class: "empty-desc" }, "有什么职业问题可以问我哦~")
        ])) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("view", { class: "messages-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.messages, (msg, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: index,
                id: "msg-" + index,
                class: vue.normalizeClass(["message-item", { "user-message": msg.isUser, "ai-message": !msg.isUser }])
              }, [
                vue.createElementVNode("view", { class: "avatar" }, [
                  msg.isUser ? (vue.openBlock(), vue.createElementBlock("text", { key: 0 }, "👤")) : (vue.openBlock(), vue.createElementBlock("text", { key: 1 }, "🤖"))
                ]),
                vue.createElementVNode("view", { class: "message-content" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "message-text" },
                    vue.toDisplayString(msg.content),
                    1
                    /* TEXT */
                  )
                ])
              ], 10, ["id"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ], 12, ["scroll-into-view"]),
      vue.createElementVNode("view", { class: "quick-messages-container" }, [
        vue.createElementVNode("scroll-view", {
          class: "quick-messages-scroll",
          "scroll-x": "true",
          "show-scrollbar": "false"
        }, [
          vue.createElementVNode("view", { class: "quick-messages" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.quickMessages, (msg, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: index,
                  class: "quick-message-btn",
                  onClick: ($event) => $options.sendQuickMessage(msg)
                }, [
                  vue.createElementVNode(
                    "text",
                    null,
                    vue.toDisplayString(msg),
                    1
                    /* TEXT */
                  )
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "input-area" }, [
        vue.createElementVNode("view", { class: "input-wrapper" }, [
          vue.withDirectives(vue.createElementVNode("input", {
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.inputText = $event),
            class: "input-field",
            placeholder: "输入你的问题...",
            onConfirm: _cache[1] || (_cache[1] = (...args) => $options.sendMessage && $options.sendMessage(...args)),
            disabled: $data.isLoading
          }, null, 40, ["disabled"]), [
            [vue.vModelText, $data.inputText]
          ]),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["send-btn", { disabled: !$data.inputText.trim() || $data.isLoading }]),
              onClick: _cache[2] || (_cache[2] = (...args) => $options.sendMessage && $options.sendMessage(...args))
            },
            [
              vue.createElementVNode(
                "text",
                null,
                vue.toDisplayString($data.isLoading ? "..." : "发送"),
                1
                /* TEXT */
              )
            ],
            2
            /* CLASS */
          )
        ])
      ])
    ]);
  }
  const PagesAiAssistantAiAssistant = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a], ["__scopeId", "data-v-8303b4fc"], ["__file", "D:/计算机编程/A13/app端/pages/ai-assistant/ai-assistant.vue"]]);
  const jobApi = {
    // 获取岗位列表
    getJobList(params) {
      return request$1.get("/jobs", params);
    },
    // 获取岗位详情
    getJobDetail(jobId) {
      return request$1.get(`/jobs/${jobId}`);
    },
    // 获取岗位画像
    getJobProfile(jobId) {
      return request$1.get(`/jobs/${jobId}/profile`);
    },
    // 获取岗位关联图谱
    getJobGraph(jobId) {
      return request$1.get(`/jobs/${jobId}/graph`);
    },
    // 搜索岗位
    searchJobs(keyword, params) {
      return request$1.get("/jobs/search", { keyword, ...params });
    },
    // 添加收藏
    addFavorite(jobId) {
      return request$1.post(`/jobs/${jobId}/favorite`);
    },
    // 取消收藏
    removeFavorite(jobId) {
      return request$1.delete(`/jobs/${jobId}/favorite`);
    },
    // 获取收藏列表
    getFavorites() {
      return request$1.get("/jobs/favorites");
    },
    // 申请岗位
    applyJob(jobId) {
      return request$1.post(`/jobs/${jobId}/apply`);
    },
    // 获取申请列表
    getApplications() {
      return request$1.get("/jobs/applications");
    }
  };
  const _sfc_main$a = {
    data() {
      return {
        searchKeyword: "",
        activeFilter: 0,
        filters: ["全部", "前端", "后端", "算法", "产品", "运营"],
        jobList: [],
        allJobList: [],
        loading: false,
        hasMore: true,
        page: 1,
        pageSize: 20
      };
    },
    onLoad() {
      this.loadJobList();
    },
    onPullDownRefresh() {
      this.refresh();
    },
    methods: {
      parseTags(tagsStr) {
        if (!tagsStr)
          return [];
        if (Array.isArray(tagsStr))
          return tagsStr;
        return tagsStr.split(",").filter((t) => t.trim());
      },
      async loadJobList() {
        if (this.loading)
          return;
        this.loading = true;
        formatAppLog("log", "at pages/job-explore/job-explore.vue:114", "开始加载数据, 页码:", this.page, "搜索关键词:", this.searchKeyword);
        try {
          const params = {
            skip: (this.page - 1) * this.pageSize,
            limit: this.pageSize
          };
          if (this.searchKeyword.trim()) {
            params.keyword = this.searchKeyword.trim();
          }
          const response = await jobApi.getJobList(params);
          formatAppLog("log", "at pages/job-explore/job-explore.vue:127", "岗位列表响应:", response);
          if (response && response.data && Array.isArray(response.data)) {
            const newData = response.data;
            formatAppLog("log", "at pages/job-explore/job-explore.vue:131", "获取到数据数量:", newData.length);
            if (this.page === 1) {
              this.allJobList = newData;
            } else {
              this.allJobList = [...this.allJobList, ...newData];
            }
            this.hasMore = newData.length >= this.pageSize;
            if (this.searchKeyword.trim()) {
              this.jobList = this.allJobList;
            } else {
              this.applyFilter();
            }
          } else {
            formatAppLog("log", "at pages/job-explore/job-explore.vue:147", "响应数据格式不正确");
          }
        } catch (error) {
          formatAppLog("error", "at pages/job-explore/job-explore.vue:150", "加载岗位列表失败:", error);
          if (this.page === 1) {
            this.allJobList = this.getMockJobs();
            this.jobList = this.allJobList;
          }
        } finally {
          this.loading = false;
          uni.stopPullDownRefresh();
        }
      },
      getMockJobs() {
        return [
          {
            id: 1,
            title: "前端开发工程师",
            company: "字节跳动",
            salary: "25-45K",
            location: "北京",
            experience: "1-3年",
            education: "本科",
            tags: ["Vue", "React", "TypeScript"]
          },
          {
            id: 2,
            title: "后端开发工程师",
            company: "阿里巴巴",
            salary: "30-50K",
            location: "杭州",
            experience: "3-5年",
            education: "本科",
            tags: ["Java", "Spring", "MySQL"]
          },
          {
            id: 3,
            title: "算法工程师",
            company: "腾讯",
            salary: "35-60K",
            location: "深圳",
            experience: "3-5年",
            education: "硕士",
            tags: ["Python", "机器学习", "深度学习"]
          }
        ];
      },
      async handleSearch() {
        this.page = 1;
        this.hasMore = true;
        await this.loadJobList();
      },
      clearSearch() {
        this.searchKeyword = "";
        this.page = 1;
        this.hasMore = true;
        this.loadJobList();
      },
      handleFilterChange(index) {
        if (this.searchKeyword.trim()) {
          uni.showToast({
            title: "请先清除搜索再使用筛选",
            icon: "none"
          });
          return;
        }
        this.activeFilter = index;
        this.applyFilter();
      },
      applyFilter() {
        if (this.searchKeyword.trim()) {
          this.jobList = this.allJobList;
          return;
        }
        const filter = this.filters[this.activeFilter];
        formatAppLog("log", "at pages/job-explore/job-explore.vue:228", "应用筛选:", filter);
        if (filter === "全部") {
          this.jobList = this.allJobList;
        } else {
          this.jobList = this.allJobList.filter((job) => {
            const title = job.title || "";
            const tags = this.parseTags(job.tags);
            return title.includes(filter) || tags.includes(filter);
          });
        }
        formatAppLog("log", "at pages/job-explore/job-explore.vue:239", "筛选后数据数量:", this.jobList.length);
      },
      loadMore() {
        if (this.loading || !this.hasMore) {
          formatAppLog("log", "at pages/job-explore/job-explore.vue:244", "不加载更多:", { loading: this.loading, hasMore: this.hasMore });
          return;
        }
        formatAppLog("log", "at pages/job-explore/job-explore.vue:248", "加载更多数据");
        this.page++;
        this.loadJobList();
      },
      refresh() {
        formatAppLog("log", "at pages/job-explore/job-explore.vue:254", "刷新数据");
        this.page = 1;
        this.hasMore = true;
        this.loadJobList();
      },
      viewJobDetail(job) {
        uni.navigateTo({
          url: `/pages/job-detail/job-detail?id=${job.id}`
        });
      }
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "search-section" }, [
        vue.createElementVNode("view", { class: "search-bar" }, [
          vue.createElementVNode("text", { class: "search-icon" }, "🔍"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.searchKeyword = $event),
              class: "search-input",
              placeholder: "输入关键词搜索岗位名称...",
              onConfirm: _cache[1] || (_cache[1] = (...args) => $options.handleSearch && $options.handleSearch(...args))
            },
            null,
            544
            /* NEED_HYDRATION, NEED_PATCH */
          ), [
            [vue.vModelText, $data.searchKeyword]
          ]),
          $data.searchKeyword ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "clear-button",
            onClick: _cache[2] || (_cache[2] = (...args) => $options.clearSearch && $options.clearSearch(...args))
          }, "✕")) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("view", {
            class: "search-button",
            onClick: _cache[3] || (_cache[3] = (...args) => $options.handleSearch && $options.handleSearch(...args))
          }, "搜索")
        ])
      ]),
      vue.createElementVNode("view", { class: "filter-section" }, [
        vue.createElementVNode("scroll-view", {
          class: "filter-scroll",
          "scroll-x": "true"
        }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.filters, (filter, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: index,
                class: vue.normalizeClass(["filter-item", { active: $data.activeFilter === index }]),
                onClick: ($event) => $options.handleFilterChange(index)
              }, vue.toDisplayString(filter), 11, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ]),
      vue.createElementVNode(
        "scroll-view",
        {
          class: "job-scroll",
          "scroll-y": "true",
          onScrolltolower: _cache[4] || (_cache[4] = (...args) => $options.loadMore && $options.loadMore(...args)),
          "lower-threshold": 100
        },
        [
          $data.jobList.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "job-list"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.jobList, (job) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: job.id,
                  class: "job-card",
                  onClick: ($event) => $options.viewJobDetail(job)
                }, [
                  vue.createElementVNode("view", { class: "job-header" }, [
                    vue.createElementVNode(
                      "view",
                      { class: "job-title" },
                      vue.toDisplayString(job.title || "岗位名称"),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "view",
                      { class: "job-salary" },
                      vue.toDisplayString(job.salary || "薪资面议"),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode(
                    "view",
                    { class: "job-company" },
                    vue.toDisplayString(job.company || "公司名称"),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("view", { class: "job-info" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "info-tag" },
                      vue.toDisplayString(job.location || "地点"),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "info-tag" },
                      vue.toDisplayString(job.experience || "经验不限"),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "info-tag" },
                      vue.toDisplayString(job.education || "学历不限"),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "job-tags" }, [
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList($options.parseTags(job.tags), (tag, i) => {
                        return vue.openBlock(), vue.createElementBlock(
                          "text",
                          {
                            key: i,
                            class: "tag"
                          },
                          vue.toDisplayString(tag),
                          1
                          /* TEXT */
                        );
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ])
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])) : vue.createCommentVNode("v-if", true),
          $data.loading ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "loading-state"
          }, [
            vue.createElementVNode("text", null, "加载中...")
          ])) : $data.jobList.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 2,
            class: "empty-state"
          }, [
            vue.createElementVNode("text", { class: "empty-icon" }, "📭"),
            vue.createElementVNode("text", { class: "empty-text" }, "暂无岗位数据"),
            vue.createElementVNode("text", { class: "empty-desc" }, "请确保后端服务已启动")
          ])) : !$data.hasMore ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 3,
            class: "no-more-state"
          }, [
            vue.createElementVNode("text", null, "没有更多数据了")
          ])) : vue.createCommentVNode("v-if", true)
        ],
        32
        /* NEED_HYDRATION */
      )
    ]);
  }
  const PagesJobExploreJobExplore = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__scopeId", "data-v-71ef44db"], ["__file", "D:/计算机编程/A13/app端/pages/job-explore/job-explore.vue"]]);
  const _sfc_main$9 = {
    data() {
      return {
        userName: "同学",
        userRole: "学生",
        initial: "同",
        currentStep: 1,
        steps: [
          { icon: "📝", text: "简历分析" },
          { icon: "📊", text: "能力评估" },
          { icon: "🎯", text: "岗位匹配" },
          { icon: "🚀", text: "职业规划" }
        ]
      };
    },
    onLoad() {
      const user = useUserStore.state.user;
      if (user) {
        this.userName = user.username || user.name || "同学";
        this.userRole = user.role === "admin" ? "管理员" : "学生";
        this.initial = this.userName.charAt(0).toUpperCase();
      }
    },
    methods: {
      uploadResume() {
        uni.navigateTo({
          url: "/pages/upload-resume/upload-resume"
        });
      },
      editProfile() {
        uni.navigateTo({
          url: "/pages/edit-profile/edit-profile"
        });
      }
    }
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "profile-header" }, [
        vue.createElementVNode("view", { class: "avatar-section" }, [
          vue.createElementVNode("view", { class: "avatar" }, [
            vue.createElementVNode(
              "text",
              { class: "avatar-text" },
              vue.toDisplayString($data.initial),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "user-info" }, [
            vue.createElementVNode(
              "text",
              { class: "user-name" },
              vue.toDisplayString($data.userName),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              { class: "user-role" },
              vue.toDisplayString($data.userRole),
              1
              /* TEXT */
            )
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "progress-section" }, [
        vue.createElementVNode("view", { class: "section-title" }, "画像进度"),
        vue.createElementVNode("view", { class: "progress-steps" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.steps, (step, index) => {
              return vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: index,
                  class: vue.normalizeClass(["step-item", { completed: index <= $data.currentStep, active: index === $data.currentStep }])
                },
                [
                  vue.createElementVNode(
                    "view",
                    { class: "step-icon" },
                    vue.toDisplayString(step.icon),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "step-text" },
                    vue.toDisplayString(step.text),
                    1
                    /* TEXT */
                  )
                ],
                2
                /* CLASS */
              );
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ]),
      vue.createElementVNode("view", { class: "ability-section" }, [
        vue.createElementVNode("view", { class: "section-title" }, "能力雷达图"),
        vue.createElementVNode("view", { class: "radar-placeholder" }, [
          vue.createElementVNode("text", { class: "placeholder-icon" }, "📊"),
          vue.createElementVNode("text", { class: "placeholder-text" }, "能力雷达图开发中")
        ])
      ]),
      vue.createElementVNode("view", { class: "action-section" }, [
        vue.createElementVNode("view", { class: "section-title" }, "快捷操作"),
        vue.createElementVNode("view", { class: "action-list" }, [
          vue.createElementVNode("view", {
            class: "action-card",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.uploadResume && $options.uploadResume(...args))
          }, [
            vue.createElementVNode("text", { class: "action-icon" }, "📄"),
            vue.createElementVNode("view", { class: "action-content" }, [
              vue.createElementVNode("text", { class: "action-title" }, "上传简历"),
              vue.createElementVNode("text", { class: "action-desc" }, "AI智能分析你的简历")
            ]),
            vue.createElementVNode("text", { class: "action-arrow" }, "›")
          ]),
          vue.createElementVNode("view", {
            class: "action-card",
            onClick: _cache[1] || (_cache[1] = (...args) => $options.editProfile && $options.editProfile(...args))
          }, [
            vue.createElementVNode("text", { class: "action-icon" }, "✏️"),
            vue.createElementVNode("view", { class: "action-content" }, [
              vue.createElementVNode("text", { class: "action-title" }, "编辑画像"),
              vue.createElementVNode("text", { class: "action-desc" }, "完善你的个人信息")
            ]),
            vue.createElementVNode("text", { class: "action-arrow" }, "›")
          ])
        ])
      ])
    ]);
  }
  const PagesStudentProfileStudentProfile = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__scopeId", "data-v-c6fc90ce"], ["__file", "D:/计算机编程/A13/app端/pages/student-profile/student-profile.vue"]]);
  const _sfc_main$8 = {
    data() {
      return {
        userName: "同学",
        userRole: "学生",
        initial: "同"
      };
    },
    onLoad() {
      const user = useUserStore.state.user;
      if (user) {
        this.userName = user.username || user.name || "同学";
        this.userRole = user.role === "admin" ? "管理员" : "学生";
        this.initial = this.userName.charAt(0).toUpperCase();
      }
    },
    methods: {
      viewMyProfile() {
        uni.switchTab({
          url: "/pages/student-profile/student-profile"
        });
      },
      viewMyApplications() {
        uni.navigateTo({
          url: "/pages/my-applications/my-applications"
        });
      },
      viewMyFavorites() {
        uni.navigateTo({
          url: "/pages/my-favorites/my-favorites"
        });
      },
      editPersonalInfo() {
        uni.navigateTo({
          url: "/pages/edit-profile/edit-profile"
        });
      },
      editSettings() {
        uni.showToast({
          title: "功能开发中",
          icon: "none"
        });
      },
      viewAbout() {
        uni.showModal({
          title: "关于我们",
          content: "基于AI的大学生职业规划智能体 v1.0.0",
          showCancel: false
        });
      },
      contactSupport() {
        uni.showToast({
          title: "功能开发中",
          icon: "none"
        });
      },
      handleLogout() {
        uni.showModal({
          title: "提示",
          content: "确定要退出登录吗？",
          success: (res) => {
            if (res.confirm) {
              useUserStore.logout();
            }
          }
        });
      }
    }
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "user-header" }, [
        vue.createElementVNode("view", { class: "user-info" }, [
          vue.createElementVNode("view", { class: "avatar" }, [
            vue.createElementVNode(
              "text",
              { class: "avatar-text" },
              vue.toDisplayString($data.initial),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "info" }, [
            vue.createElementVNode(
              "text",
              { class: "username" },
              vue.toDisplayString($data.userName),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              { class: "role" },
              vue.toDisplayString($data.userRole),
              1
              /* TEXT */
            )
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "menu-section" }, [
        vue.createElementVNode("view", {
          class: "menu-item",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.viewMyProfile && $options.viewMyProfile(...args))
        }, [
          vue.createElementVNode("text", { class: "menu-icon" }, "👤"),
          vue.createElementVNode("text", { class: "menu-text" }, "我的画像"),
          vue.createElementVNode("text", { class: "menu-arrow" }, "›")
        ]),
        vue.createElementVNode("view", {
          class: "menu-item",
          onClick: _cache[1] || (_cache[1] = (...args) => $options.viewMyApplications && $options.viewMyApplications(...args))
        }, [
          vue.createElementVNode("text", { class: "menu-icon" }, "📋"),
          vue.createElementVNode("text", { class: "menu-text" }, "我的申请"),
          vue.createElementVNode("text", { class: "menu-arrow" }, "›")
        ]),
        vue.createElementVNode("view", {
          class: "menu-item",
          onClick: _cache[2] || (_cache[2] = (...args) => $options.viewMyFavorites && $options.viewMyFavorites(...args))
        }, [
          vue.createElementVNode("text", { class: "menu-icon" }, "⭐"),
          vue.createElementVNode("text", { class: "menu-text" }, "我的收藏"),
          vue.createElementVNode("text", { class: "menu-arrow" }, "›")
        ])
      ]),
      vue.createElementVNode("view", { class: "menu-section" }, [
        vue.createElementVNode("view", {
          class: "menu-item",
          onClick: _cache[3] || (_cache[3] = (...args) => $options.editPersonalInfo && $options.editPersonalInfo(...args))
        }, [
          vue.createElementVNode("text", { class: "menu-icon" }, "✏️"),
          vue.createElementVNode("text", { class: "menu-text" }, "编辑个人信息"),
          vue.createElementVNode("text", { class: "menu-arrow" }, "›")
        ]),
        vue.createElementVNode("view", {
          class: "menu-item",
          onClick: _cache[4] || (_cache[4] = (...args) => $options.editSettings && $options.editSettings(...args))
        }, [
          vue.createElementVNode("text", { class: "menu-icon" }, "⚙️"),
          vue.createElementVNode("text", { class: "menu-text" }, "设置"),
          vue.createElementVNode("text", { class: "menu-arrow" }, "›")
        ]),
        vue.createElementVNode("view", {
          class: "menu-item",
          onClick: _cache[5] || (_cache[5] = (...args) => $options.viewAbout && $options.viewAbout(...args))
        }, [
          vue.createElementVNode("text", { class: "menu-icon" }, "ℹ️"),
          vue.createElementVNode("text", { class: "menu-text" }, "关于我们"),
          vue.createElementVNode("text", { class: "menu-arrow" }, "›")
        ]),
        vue.createElementVNode("view", {
          class: "menu-item",
          onClick: _cache[6] || (_cache[6] = (...args) => $options.contactSupport && $options.contactSupport(...args))
        }, [
          vue.createElementVNode("text", { class: "menu-icon" }, "💬"),
          vue.createElementVNode("text", { class: "menu-text" }, "联系客服"),
          vue.createElementVNode("text", { class: "menu-arrow" }, "›")
        ])
      ]),
      vue.createElementVNode("view", { class: "logout-section" }, [
        vue.createElementVNode("button", {
          class: "logout-btn",
          onClick: _cache[7] || (_cache[7] = (...args) => $options.handleLogout && $options.handleLogout(...args))
        }, "退出登录")
      ])
    ]);
  }
  const PagesUserCenterUserCenter = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__scopeId", "data-v-5df2242c"], ["__file", "D:/计算机编程/A13/app端/pages/user-center/user-center.vue"]]);
  const _sfc_main$7 = {
    data() {
      return {
        jobId: null,
        job: {
          title: "前端开发工程师",
          salary: "15-25K",
          company: "字节跳动",
          location: "北京",
          experience: "3-5年",
          education: "本科",
          tags: [],
          responsibilities: "",
          requirements: "",
          benefits: [],
          applied: false
        },
        isFavorite: false,
        appliedJobIds: /* @__PURE__ */ new Set()
      };
    },
    onLoad(options) {
      if (options.id) {
        this.jobId = options.id;
        this.loadJobDetail();
        this.loadApplications();
      }
    },
    methods: {
      parseTags(tagsStr) {
        if (!tagsStr)
          return [];
        if (Array.isArray(tagsStr))
          return tagsStr;
        return tagsStr.split(",").filter((t) => t.trim());
      },
      splitText(text) {
        if (!text)
          return [];
        return text.replace(/<br\s*\/?>/gi, "\n").replace(/<br>/gi, "\n").split("\n").filter((line) => line.trim());
      },
      async loadApplications() {
        try {
          const response = await jobApi.getApplications();
          formatAppLog("log", "at pages/job-detail/job-detail.vue:117", "申请列表响应:", response);
          if (response && response.data && Array.isArray(response.data)) {
            this.appliedJobIds = new Set(response.data.map((app) => app.job_id || app.jobId));
            this.checkIfApplied();
          }
        } catch (err) {
          formatAppLog("error", "at pages/job-detail/job-detail.vue:123", "获取申请列表失败:", err);
        }
      },
      checkIfApplied() {
        if (this.jobId && this.appliedJobIds.has(Number(this.jobId))) {
          this.job.applied = true;
        }
      },
      async loadJobDetail() {
        try {
          uni.showLoading({ title: "加载中..." });
          const response = await jobApi.getJobDetail(this.jobId);
          formatAppLog("log", "at pages/job-detail/job-detail.vue:137", "岗位详情响应:", response);
          if (response && response.data) {
            this.job = response.data;
            this.job.applied = false;
            if (!this.job.tags) {
              this.job.tags = [];
            }
            if (!this.job.benefits) {
              this.job.benefits = [];
            }
            this.checkIfApplied();
          }
        } catch (err) {
          formatAppLog("error", "at pages/job-detail/job-detail.vue:150", err);
          uni.showToast({
            title: "加载失败",
            icon: "none"
          });
        } finally {
          uni.hideLoading();
        }
      },
      async toggleFavorite() {
        try {
          if (this.isFavorite) {
            await jobApi.removeFavorite(this.jobId);
            this.isFavorite = false;
            uni.showToast({ title: "取消收藏", icon: "success" });
          } else {
            await jobApi.addFavorite(this.jobId);
            this.isFavorite = true;
            uni.showToast({ title: "收藏成功", icon: "success" });
          }
        } catch (err) {
          formatAppLog("error", "at pages/job-detail/job-detail.vue:172", err);
          uni.showToast({ title: "操作失败", icon: "none" });
        }
      },
      async applyJob() {
        var _a;
        if (this.job.applied) {
          uni.showToast({
            title: "岗位已申请",
            icon: "none"
          });
          return;
        }
        try {
          uni.showLoading({ title: "申请中..." });
          await jobApi.applyJob(this.jobId);
          this.job.applied = true;
          this.appliedJobIds.add(Number(this.jobId));
          uni.showToast({
            title: "申请成功",
            icon: "success"
          });
        } catch (err) {
          formatAppLog("error", "at pages/job-detail/job-detail.vue:196", err);
          uni.showToast({
            title: (err == null ? void 0 : err.message) || ((_a = err == null ? void 0 : err.data) == null ? void 0 : _a.detail) || "申请失败",
            icon: "none"
          });
        } finally {
          uni.hideLoading();
        }
      }
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "job-header" }, [
        vue.createElementVNode("view", { class: "job-info" }, [
          vue.createElementVNode(
            "text",
            { class: "job-title" },
            vue.toDisplayString($data.job.title),
            1
            /* TEXT */
          ),
          vue.createElementVNode("view", { class: "job-tags" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($options.parseTags($data.job.tags), (tag, index) => {
                return vue.openBlock(), vue.createElementBlock(
                  "text",
                  {
                    key: index,
                    class: "job-tag"
                  },
                  vue.toDisplayString(tag),
                  1
                  /* TEXT */
                );
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ]),
        vue.createElementVNode(
          "view",
          { class: "job-salary" },
          vue.toDisplayString($data.job.salary),
          1
          /* TEXT */
        )
      ]),
      vue.createElementVNode("view", { class: "section" }, [
        vue.createElementVNode("view", { class: "section-title" }, "岗位信息"),
        vue.createElementVNode("view", { class: "info-grid" }, [
          vue.createElementVNode("view", { class: "info-item" }, [
            vue.createElementVNode("text", { class: "info-label" }, "公司"),
            vue.createElementVNode(
              "text",
              { class: "info-value" },
              vue.toDisplayString($data.job.company),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "info-item" }, [
            vue.createElementVNode("text", { class: "info-label" }, "地点"),
            vue.createElementVNode(
              "text",
              { class: "info-value" },
              vue.toDisplayString($data.job.location),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "info-item" }, [
            vue.createElementVNode("text", { class: "info-label" }, "经验"),
            vue.createElementVNode(
              "text",
              { class: "info-value" },
              vue.toDisplayString($data.job.experience),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "info-item" }, [
            vue.createElementVNode("text", { class: "info-label" }, "学历"),
            vue.createElementVNode(
              "text",
              { class: "info-value" },
              vue.toDisplayString($data.job.education),
              1
              /* TEXT */
            )
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "section" }, [
        vue.createElementVNode("view", { class: "section-title" }, "岗位详情"),
        vue.createElementVNode("view", { class: "content-box" }, [
          $data.job.requirements || $data.job.description ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "content-text"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($options.splitText($data.job.requirements || $data.job.description), (line, index) => {
                return vue.openBlock(), vue.createElementBlock("text", { key: index }, [
                  vue.createTextVNode(
                    vue.toDisplayString(line) + " ",
                    1
                    /* TEXT */
                  ),
                  index < $options.splitText($data.job.requirements || $data.job.description).length - 1 ? (vue.openBlock(), vue.createElementBlock("text", { key: 0 }, "\\n")) : vue.createCommentVNode("v-if", true)
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])) : (vue.openBlock(), vue.createElementBlock("text", {
            key: 1,
            class: "content-placeholder"
          }, "暂无信息"))
        ])
      ]),
      $data.job.benefits && $data.job.benefits.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "section"
      }, [
        vue.createElementVNode("view", { class: "section-title" }, "福利待遇"),
        vue.createElementVNode("view", { class: "benefits-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.job.benefits, (benefit, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: index,
                class: "benefit-item"
              }, [
                vue.createElementVNode("text", { class: "benefit-icon" }, "🎁"),
                vue.createElementVNode(
                  "text",
                  { class: "benefit-text" },
                  vue.toDisplayString(benefit),
                  1
                  /* TEXT */
                )
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("view", { class: "bottom-actions" }, [
        vue.createElementVNode(
          "button",
          {
            class: "btn btn-secondary",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.toggleFavorite && $options.toggleFavorite(...args))
          },
          vue.toDisplayString($data.isFavorite ? "已收藏" : "收藏"),
          1
          /* TEXT */
        ),
        vue.createElementVNode(
          "button",
          {
            class: "btn btn-primary",
            onClick: _cache[1] || (_cache[1] = (...args) => $options.applyJob && $options.applyJob(...args))
          },
          vue.toDisplayString($data.job.applied ? "已申请" : "立即申请"),
          1
          /* TEXT */
        )
      ])
    ]);
  }
  const PagesJobDetailJobDetail = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__scopeId", "data-v-2bde8e2a"], ["__file", "D:/计算机编程/A13/app端/pages/job-detail/job-detail.vue"]]);
  const _sfc_main$6 = {
    data() {
      return {
        selectedFile: null,
        isUploading: false
      };
    },
    methods: {
      chooseFile() {
        uni.chooseMessageFile({
          count: 1,
          type: "file",
          extension: [".pdf", ".doc", ".docx"],
          success: (res) => {
            const file = res.tempFiles[0];
            this.selectedFile = file;
          },
          fail: (err) => {
            formatAppLog("error", "at pages/upload-resume/upload-resume.vue:76", "选择文件失败:", err);
            uni.showToast({
              title: "选择文件失败",
              icon: "none"
            });
          }
        });
      },
      removeFile() {
        this.selectedFile = null;
      },
      formatFileSize(bytes) {
        if (bytes === 0)
          return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
      },
      async uploadResume() {
        if (!this.selectedFile) {
          uni.showToast({
            title: "请先选择文件",
            icon: "none"
          });
          return;
        }
        this.isUploading = true;
        try {
          uni.showLoading({ title: "上传中..." });
          const uploadTask = uni.uploadFile({
            url: appConfig.baseUrl + "/resume/upload",
            filePath: this.selectedFile.path,
            name: "file",
            success: (res) => {
              const data = JSON.parse(res.data);
              if (res.statusCode === 200) {
                uni.showToast({
                  title: "上传成功",
                  icon: "success"
                });
                setTimeout(() => {
                  uni.navigateBack();
                }, 1500);
              } else {
                uni.showToast({
                  title: data.msg || "上传失败",
                  icon: "none"
                });
              }
            },
            fail: (err) => {
              formatAppLog("error", "at pages/upload-resume/upload-resume.vue:133", "上传失败:", err);
              uni.showToast({
                title: "上传失败",
                icon: "none"
              });
            },
            complete: () => {
              this.isUploading = false;
              uni.hideLoading();
            }
          });
          uploadTask.onProgressUpdate((res) => {
            formatAppLog("log", "at pages/upload-resume/upload-resume.vue:146", "上传进度", res.progress);
          });
        } catch (err) {
          formatAppLog("error", "at pages/upload-resume/upload-resume.vue:150", err);
          this.isUploading = false;
          uni.hideLoading();
        }
      }
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "upload-section" }, [
        vue.createElementVNode("view", {
          class: "upload-area",
          onClick: _cache[1] || (_cache[1] = (...args) => $options.chooseFile && $options.chooseFile(...args))
        }, [
          !$data.selectedFile ? (vue.openBlock(), vue.createElementBlock("text", {
            key: 0,
            class: "upload-icon"
          }, "📄")) : vue.createCommentVNode("v-if", true),
          !$data.selectedFile ? (vue.openBlock(), vue.createElementBlock("text", {
            key: 1,
            class: "upload-text"
          }, "点击上传简历")) : vue.createCommentVNode("v-if", true),
          !$data.selectedFile ? (vue.openBlock(), vue.createElementBlock("text", {
            key: 2,
            class: "upload-desc"
          }, "支持PDF、DOC、DOCX格式")) : vue.createCommentVNode("v-if", true),
          $data.selectedFile ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 3,
            class: "file-info"
          }, [
            vue.createElementVNode("text", { class: "file-icon" }, "📎"),
            vue.createElementVNode("view", { class: "file-detail" }, [
              vue.createElementVNode(
                "text",
                { class: "file-name" },
                vue.toDisplayString($data.selectedFile.name),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "text",
                { class: "file-size" },
                vue.toDisplayString($options.formatFileSize($data.selectedFile.size)),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("text", {
              class: "file-remove",
              onClick: _cache[0] || (_cache[0] = vue.withModifiers((...args) => $options.removeFile && $options.removeFile(...args), ["stop"]))
            }, "✕")
          ])) : vue.createCommentVNode("v-if", true)
        ])
      ]),
      vue.createElementVNode("view", { class: "tips-section" }, [
        vue.createElementVNode("view", { class: "section-title" }, "上传提示"),
        vue.createElementVNode("view", { class: "tips-list" }, [
          vue.createElementVNode("view", { class: "tip-item" }, [
            vue.createElementVNode("text", { class: "tip-icon" }, "✅"),
            vue.createElementVNode("text", { class: "tip-text" }, "建议使用最新版本的简历")
          ]),
          vue.createElementVNode("view", { class: "tip-item" }, [
            vue.createElementVNode("text", { class: "tip-icon" }, "✅"),
            vue.createElementVNode("text", { class: "tip-text" }, "确保简历包含完整的教育和工作经历")
          ]),
          vue.createElementVNode("view", { class: "tip-item" }, [
            vue.createElementVNode("text", { class: "tip-icon" }, "✅"),
            vue.createElementVNode("text", { class: "tip-text" }, "文件大小不超过10MB")
          ]),
          vue.createElementVNode("view", { class: "tip-item" }, [
            vue.createElementVNode("text", { class: "tip-icon" }, "✅"),
            vue.createElementVNode("text", { class: "tip-text" }, "上传后AI将自动分析你的简历")
          ])
        ])
      ]),
      $data.selectedFile ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "action-section"
      }, [
        vue.createElementVNode("button", {
          class: vue.normalizeClass(["btn btn-primary", { loading: $data.isUploading }]),
          onClick: _cache[2] || (_cache[2] = (...args) => $options.uploadResume && $options.uploadResume(...args)),
          disabled: $data.isUploading
        }, vue.toDisplayString($data.isUploading ? "分析中..." : "开始分析"), 11, ["disabled"])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesUploadResumeUploadResume = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__scopeId", "data-v-615e4326"], ["__file", "D:/计算机编程/A13/app端/pages/upload-resume/upload-resume.vue"]]);
  const _sfc_main$5 = {
    data() {
      const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
      const yearOptions = [];
      for (let i = currentYear; i <= currentYear + 10; i++) {
        yearOptions.push(i + "年");
      }
      return {
        isSaving: false,
        genderOptions: [
          { label: "男", value: "male" },
          { label: "女", value: "female" }
        ],
        educationOptions: ["专科", "本科", "硕士", "博士"],
        yearOptions,
        form: {
          name: "",
          gender: "",
          phone: "",
          email: "",
          school: "",
          major: "",
          education: "",
          graduationYear: "",
          bio: ""
        }
      };
    },
    onLoad() {
      this.loadProfile();
    },
    methods: {
      async loadProfile() {
        try {
          uni.showLoading({ title: "加载中..." });
          const res = await userApi.getUserInfo();
          if (res && res.data) {
            this.form = { ...this.form, ...res.data };
          }
        } catch (err) {
          formatAppLog("error", "at pages/edit-profile/edit-profile.vue:170", "加载个人信息失败:", err);
        } finally {
          uni.hideLoading();
        }
      },
      onEducationChange(e) {
        this.form.education = this.educationOptions[e.detail.value];
      },
      onYearChange(e) {
        this.form.graduationYear = this.yearOptions[e.detail.value];
      },
      async saveProfile() {
        if (!this.form.name) {
          uni.showToast({
            title: "请输入姓名",
            icon: "none"
          });
          return;
        }
        this.isSaving = true;
        try {
          await userApi.updateUserInfo(this.form);
          uni.showToast({
            title: "保存成功",
            icon: "success"
          });
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        } catch (err) {
          formatAppLog("error", "at pages/edit-profile/edit-profile.vue:205", err);
          uni.showToast({
            title: "保存失败",
            icon: "none"
          });
        } finally {
          this.isSaving = false;
        }
      }
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "form-section" }, [
        vue.createElementVNode("view", { class: "form-group" }, [
          vue.createElementVNode("text", { class: "form-label" }, "姓名"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.form.name = $event),
              class: "form-input",
              placeholder: "请输入姓名"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.form.name]
          ])
        ]),
        vue.createElementVNode("view", { class: "form-group" }, [
          vue.createElementVNode("text", { class: "form-label" }, "性别"),
          vue.createElementVNode("view", { class: "gender-select" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.genderOptions, (item) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: item.value,
                  class: vue.normalizeClass(["gender-option", { active: $data.form.gender === item.value }]),
                  onClick: ($event) => $data.form.gender = item.value
                }, [
                  vue.createElementVNode(
                    "text",
                    null,
                    vue.toDisplayString(item.label),
                    1
                    /* TEXT */
                  )
                ], 10, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ]),
        vue.createElementVNode("view", { class: "form-group" }, [
          vue.createElementVNode("text", { class: "form-label" }, "手机号"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.form.phone = $event),
              class: "form-input",
              type: "number",
              placeholder: "请输入手机号",
              maxlength: "11"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.form.phone]
          ])
        ]),
        vue.createElementVNode("view", { class: "form-group" }, [
          vue.createElementVNode("text", { class: "form-label" }, "邮箱"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.form.email = $event),
              class: "form-input",
              type: "email",
              placeholder: "请输入邮箱"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.form.email]
          ])
        ]),
        vue.createElementVNode("view", { class: "form-group" }, [
          vue.createElementVNode("text", { class: "form-label" }, "学校"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.form.school = $event),
              class: "form-input",
              placeholder: "请输入学校"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.form.school]
          ])
        ]),
        vue.createElementVNode("view", { class: "form-group" }, [
          vue.createElementVNode("text", { class: "form-label" }, "专业"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.form.major = $event),
              class: "form-input",
              placeholder: "请输入专业"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.form.major]
          ])
        ]),
        vue.createElementVNode("view", { class: "form-group" }, [
          vue.createElementVNode("text", { class: "form-label" }, "学历"),
          vue.createElementVNode("picker", {
            mode: "selector",
            range: $data.educationOptions,
            onChange: _cache[5] || (_cache[5] = (...args) => $options.onEducationChange && $options.onEducationChange(...args))
          }, [
            vue.createElementVNode("view", { class: "picker" }, [
              vue.createElementVNode(
                "text",
                {
                  class: vue.normalizeClass({ placeholder: !$data.form.education })
                },
                vue.toDisplayString($data.form.education || "请选择学历"),
                3
                /* TEXT, CLASS */
              ),
              vue.createElementVNode("text", { class: "picker-arrow" }, "›")
            ])
          ], 40, ["range"])
        ]),
        vue.createElementVNode("view", { class: "form-group" }, [
          vue.createElementVNode("text", { class: "form-label" }, "毕业年份"),
          vue.createElementVNode("picker", {
            mode: "selector",
            range: $data.yearOptions,
            onChange: _cache[6] || (_cache[6] = (...args) => $options.onYearChange && $options.onYearChange(...args))
          }, [
            vue.createElementVNode("view", { class: "picker" }, [
              vue.createElementVNode(
                "text",
                {
                  class: vue.normalizeClass({ placeholder: !$data.form.graduationYear })
                },
                vue.toDisplayString($data.form.graduationYear || "请选择毕业年份"),
                3
                /* TEXT, CLASS */
              ),
              vue.createElementVNode("text", { class: "picker-arrow" }, "›")
            ])
          ], 40, ["range"])
        ]),
        vue.createElementVNode("view", { class: "form-group" }, [
          vue.createElementVNode("text", { class: "form-label" }, "个人简介"),
          vue.withDirectives(vue.createElementVNode(
            "textarea",
            {
              "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.form.bio = $event),
              class: "form-textarea",
              placeholder: "请简单介绍一下自己...",
              maxlength: 500
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.form.bio]
          ]),
          vue.createElementVNode(
            "text",
            { class: "char-count" },
            vue.toDisplayString($data.form.bio.length) + "/500",
            1
            /* TEXT */
          )
        ])
      ]),
      vue.createElementVNode("view", { class: "action-section" }, [
        vue.createElementVNode("button", {
          class: vue.normalizeClass(["btn btn-primary", { loading: $data.isSaving }]),
          onClick: _cache[8] || (_cache[8] = (...args) => $options.saveProfile && $options.saveProfile(...args)),
          disabled: $data.isSaving
        }, vue.toDisplayString($data.isSaving ? "保存中..." : "保存"), 11, ["disabled"])
      ])
    ]);
  }
  const PagesEditProfileEditProfile = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__scopeId", "data-v-c0f45e44"], ["__file", "D:/计算机编程/A13/app端/pages/edit-profile/edit-profile.vue"]]);
  const _sfc_main$4 = {
    data() {
      return {
        paths: [
          {
            name: "前端开发工程师",
            match: "92% 匹配",
            desc: "基于你的技能和兴趣，前端开发是最适合你的发展方向",
            color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            steps: ["初级前端", "中级前端", "高级前端", "技术专家"]
          },
          {
            name: "全栈开发工程师",
            match: "85% 匹配",
            desc: "扩展你的技术栈，成为具备全栈能力的开发者",
            color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            steps: ["前端基础", "后端学习", "全栈实践", "架构设计"]
          }
        ],
        stages: [
          {
            title: "入门阶段",
            time: "0-6个月",
            desc: "掌握基础技能，完成基础项目"
          },
          {
            title: "成长阶段",
            time: "6-18个月",
            desc: "深入学习核心技术，参与复杂项目"
          },
          {
            title: "成熟阶段",
            time: "18-36个月",
            desc: "具备独立解决问题能力，成为技术骨干"
          }
        ],
        skills: [
          { name: "Vue.js", progress: 85, color: "#667eea" },
          { name: "React", progress: 70, color: "#61dafb" },
          { name: "JavaScript", progress: 90, color: "#f7df1e" },
          { name: "TypeScript", progress: 75, color: "#3178c6" }
        ]
      };
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "header-card" }, [
        vue.createElementVNode("text", { class: "header-title" }, "🎯 职业规划"),
        vue.createElementVNode("text", { class: "header-desc" }, "基于AI智能分析，为你定制专属职业发展路径")
      ]),
      vue.createElementVNode("view", { class: "section" }, [
        vue.createElementVNode("view", { class: "section-title" }, "推荐路径"),
        vue.createElementVNode("view", { class: "path-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.paths, (path, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "path-card",
                key: index
              }, [
                vue.createElementVNode("view", { class: "path-header" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "path-name" },
                    vue.toDisplayString(path.name),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "view",
                    {
                      class: "path-match",
                      style: vue.normalizeStyle({ background: path.color })
                    },
                    vue.toDisplayString(path.match),
                    5
                    /* TEXT, STYLE */
                  )
                ]),
                vue.createElementVNode(
                  "text",
                  { class: "path-desc" },
                  vue.toDisplayString(path.desc),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "path-steps" }, [
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList(path.steps, (step, i) => {
                      return vue.openBlock(), vue.createElementBlock(
                        "view",
                        {
                          key: i,
                          class: "step-tag"
                        },
                        vue.toDisplayString(step),
                        1
                        /* TEXT */
                      );
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ]),
      vue.createElementVNode("view", { class: "section" }, [
        vue.createElementVNode("view", { class: "section-title" }, "发展阶段"),
        vue.createElementVNode("view", { class: "stage-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.stages, (stage, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "stage-item",
                key: index
              }, [
                vue.createElementVNode("view", { class: "stage-dot" }),
                vue.createElementVNode("view", { class: "stage-content" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "stage-title" },
                    vue.toDisplayString(stage.title),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "stage-time" },
                    vue.toDisplayString(stage.time),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "stage-desc" },
                    vue.toDisplayString(stage.desc),
                    1
                    /* TEXT */
                  )
                ])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ]),
      vue.createElementVNode("view", { class: "section" }, [
        vue.createElementVNode("view", { class: "section-title" }, "技能提升建议"),
        vue.createElementVNode("view", { class: "skill-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.skills, (skill, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "skill-card",
                key: index
              }, [
                vue.createElementVNode(
                  "text",
                  { class: "skill-name" },
                  vue.toDisplayString(skill.name),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "skill-bar" }, [
                  vue.createElementVNode(
                    "view",
                    {
                      class: "skill-progress",
                      style: vue.normalizeStyle({ width: skill.progress + "%", background: skill.color })
                    },
                    null,
                    4
                    /* STYLE */
                  )
                ]),
                vue.createElementVNode(
                  "text",
                  { class: "skill-percent" },
                  vue.toDisplayString(skill.progress) + "%",
                  1
                  /* TEXT */
                )
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ])
    ]);
  }
  const PagesCareerPlanCareerPlan = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__scopeId", "data-v-f0b5c96f"], ["__file", "D:/计算机编程/A13/app端/pages/career-plan/career-plan.vue"]]);
  const _sfc_main$3 = {
    data() {
      return {
        activeTab: 0,
        tabs: ["常见问题", "面试技巧", "模拟面试"],
        questions: [
          {
            question: "请简单介绍一下你自己",
            answer: "这是一个经典的面试开场白。回答时要突出自己的教育背景、相关工作经验和核心技能，保持简洁有条理，2-3分钟为宜。",
            expanded: false
          },
          {
            question: "你为什么想加入我们公司？",
            answer: "这是考察你对公司的了解程度。回答时要结合公司的产品、文化和发展方向，说明自己为什么认同公司的价值观。",
            expanded: false
          },
          {
            question: "请描述一个你最有成就感的项目",
            answer: "使用STAR法则：情境(Situation)、任务(Task)、行动(Action)、结果(Result)。重点突出你在项目中的贡献和学到的东西。",
            expanded: false
          },
          {
            question: "你的优点和缺点是什么？",
            answer: "优点要具体，最好有例子支撑；缺点要说真实但不致命的，并且说明你正在如何改进。",
            expanded: false
          },
          {
            question: "你对未来3-5年有什么规划？",
            answer: "说明你对职业发展的思考，既要体现进取心，又要切合实际，可以结合应聘公司的发展来谈。",
            expanded: false
          }
        ]
      };
    },
    methods: {
      toggleAnswer(index) {
        this.questions[index].expanded = !this.questions[index].expanded;
      },
      startSimulation() {
        uni.switchTab({
          url: "/pages/ai-assistant/ai-assistant"
        });
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "tabs" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.tabs, (tab, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: index,
              class: vue.normalizeClass(["tab-item", { active: $data.activeTab === index }]),
              onClick: ($event) => $data.activeTab = index
            }, vue.toDisplayString(tab), 11, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ]),
      vue.createElementVNode("view", { class: "content-section" }, [
        $data.activeTab === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "questions-section"
        }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.questions, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: index,
                class: "question-card",
                onClick: ($event) => $options.toggleAnswer(index)
              }, [
                vue.createElementVNode("view", { class: "question-header" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "question-index" },
                    "Q" + vue.toDisplayString(index + 1),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "question-text" },
                    vue.toDisplayString(item.question),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["answer-content", { expanded: item.expanded }])
                  },
                  [
                    vue.createElementVNode(
                      "text",
                      { class: "answer-text" },
                      vue.toDisplayString(item.answer),
                      1
                      /* TEXT */
                    )
                  ],
                  2
                  /* CLASS */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "toggle-icon" },
                  vue.toDisplayString(item.expanded ? "▲" : "▼"),
                  1
                  /* TEXT */
                )
              ], 8, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])) : vue.createCommentVNode("v-if", true),
        $data.activeTab === 1 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "tips-section"
        }, [
          vue.createElementVNode("view", { class: "tip-card" }, [
            vue.createElementVNode("text", { class: "tip-icon" }, "🎯"),
            vue.createElementVNode("view", { class: "tip-content" }, [
              vue.createElementVNode("text", { class: "tip-title" }, "面试前准备"),
              vue.createElementVNode("text", { class: "tip-desc" }, "了解公司文化和岗位要求")
            ])
          ]),
          vue.createElementVNode("view", { class: "tip-card" }, [
            vue.createElementVNode("text", { class: "tip-icon" }, "💬"),
            vue.createElementVNode("view", { class: "tip-content" }, [
              vue.createElementVNode("text", { class: "tip-title" }, "自我介绍"),
              vue.createElementVNode("text", { class: "tip-desc" }, "准备2-3分钟的自我介绍")
            ])
          ]),
          vue.createElementVNode("view", { class: "tip-card" }, [
            vue.createElementVNode("text", { class: "tip-icon" }, "📚"),
            vue.createElementVNode("view", { class: "tip-content" }, [
              vue.createElementVNode("text", { class: "tip-title" }, "技能复习"),
              vue.createElementVNode("text", { class: "tip-desc" }, "复习核心技术知识点")
            ])
          ]),
          vue.createElementVNode("view", { class: "tip-card" }, [
            vue.createElementVNode("text", { class: "tip-icon" }, "🎨"),
            vue.createElementVNode("view", { class: "tip-content" }, [
              vue.createElementVNode("text", { class: "tip-title" }, "项目准备"),
              vue.createElementVNode("text", { class: "tip-desc" }, "准备2-3个代表性项目")
            ])
          ])
        ])) : vue.createCommentVNode("v-if", true),
        $data.activeTab === 2 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 2,
          class: "simulation-section"
        }, [
          vue.createElementVNode("view", {
            class: "simulation-card",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.startSimulation && $options.startSimulation(...args))
          }, [
            vue.createElementVNode("text", { class: "simulation-icon" }, "🎮"),
            vue.createElementVNode("text", { class: "simulation-title" }, "开始模拟面试"),
            vue.createElementVNode("text", { class: "simulation-desc" }, "AI面试官将与你进行真实对话")
          ])
        ])) : vue.createCommentVNode("v-if", true)
      ])
    ]);
  }
  const PagesInterviewPrepInterviewPrep = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__scopeId", "data-v-39f6a714"], ["__file", "D:/计算机编程/A13/app端/pages/interview-prep/interview-prep.vue"]]);
  const _sfc_main$2 = {
    data() {
      return {
        activeTab: 0,
        tabs: ["全部", "待处理", "已通过", "已拒绝"],
        isLoading: true,
        applications: []
      };
    },
    computed: {
      filteredList() {
        if (this.activeTab === 0) {
          return this.applications;
        }
        const statusMap = {
          1: "pending",
          2: "approved",
          3: "rejected"
        };
        return this.applications.filter((item) => item.status === statusMap[this.activeTab]);
      }
    },
    onLoad() {
      this.loadApplications();
    },
    onPullDownRefresh() {
      this.loadApplications();
      setTimeout(() => {
        uni.stopPullDownRefresh();
      }, 1e3);
    },
    methods: {
      async loadApplications() {
        this.isLoading = true;
        try {
          const res = await userApi.getApplications();
          if (res && res.data) {
            this.applications = res.data;
          } else {
            this.applications = this.getMockData();
          }
        } catch (err) {
          formatAppLog("error", "at pages/my-applications/my-applications.vue:112", err);
          this.applications = this.getMockData();
        } finally {
          this.isLoading = false;
        }
      },
      getMockData() {
        return [
          {
            id: 1,
            title: "前端开发工程师",
            salary: "15-25K",
            company: "字节跳动",
            location: "北京",
            experience: "3-5年",
            education: "本科",
            status: "pending",
            applyTime: "2024-01-15 14:30"
          },
          {
            id: 2,
            title: "后端开发工程师",
            salary: "20-35K",
            company: "阿里巴巴",
            location: "杭州",
            experience: "3-5年",
            education: "本科",
            status: "approved",
            applyTime: "2024-01-10 10:20"
          },
          {
            id: 3,
            title: "产品经理",
            salary: "25-40K",
            company: "腾讯",
            location: "深圳",
            experience: "5-10年",
            education: "硕士",
            status: "rejected",
            applyTime: "2024-01-05 16:45"
          }
        ];
      },
      getStatusText(status) {
        const statusMap = {
          pending: "待处理",
          approved: "已通过",
          rejected: "已拒绝"
        };
        return statusMap[status] || status;
      },
      viewJobDetail(item) {
        uni.navigateTo({
          url: `/pages/job-detail/job-detail?id=${item.id}`
        });
      },
      async cancelApplication(item, index) {
        uni.showModal({
          title: "提示",
          content: "确定要取消这个申请吗？",
          success: async (res) => {
            if (res.confirm) {
              try {
                uni.showLoading({ title: "处理中..." });
                await userApi.cancelApplication(item.id);
                this.applications.splice(index, 1);
                uni.showToast({
                  title: "已取消",
                  icon: "success"
                });
              } catch (err) {
                formatAppLog("error", "at pages/my-applications/my-applications.vue:187", err);
                this.applications.splice(index, 1);
                uni.showToast({
                  title: "已取消",
                  icon: "success"
                });
              } finally {
                uni.hideLoading();
              }
            }
          }
        });
      },
      goToJobExplore() {
        uni.switchTab({
          url: "/pages/job-explore/job-explore"
        });
      }
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "tabs" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.tabs, (tab, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: index,
              class: vue.normalizeClass(["tab-item", { active: $data.activeTab === index }]),
              onClick: ($event) => $data.activeTab = index
            }, vue.toDisplayString(tab), 11, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ]),
      !$data.isLoading ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "content-section"
      }, [
        $options.filteredList.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "applications-list"
        }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($options.filteredList, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: index,
                class: "application-card",
                onClick: ($event) => $options.viewJobDetail(item)
              }, [
                vue.createElementVNode("view", { class: "card-header" }, [
                  vue.createElementVNode("view", { class: "job-info" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "job-title" },
                      vue.toDisplayString(item.title),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "job-salary" },
                      vue.toDisplayString(item.salary),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode(
                    "view",
                    {
                      class: vue.normalizeClass(["status-badge", "status-" + item.status])
                    },
                    vue.toDisplayString($options.getStatusText(item.status)),
                    3
                    /* TEXT, CLASS */
                  )
                ]),
                vue.createElementVNode(
                  "view",
                  { class: "job-company" },
                  vue.toDisplayString(item.company),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "job-meta" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "meta-item" },
                    vue.toDisplayString(item.location),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("text", { class: "meta-divider" }, "·"),
                  vue.createElementVNode(
                    "text",
                    { class: "meta-item" },
                    vue.toDisplayString(item.experience),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("text", { class: "meta-divider" }, "·"),
                  vue.createElementVNode(
                    "text",
                    { class: "meta-item" },
                    vue.toDisplayString(item.education),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode(
                  "view",
                  { class: "apply-time" },
                  "申请时间：" + vue.toDisplayString(item.applyTime),
                  1
                  /* TEXT */
                ),
                item.status === "pending" ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "card-actions"
                }, [
                  vue.createElementVNode("button", {
                    class: "action-btn cancel-btn",
                    onClick: vue.withModifiers(($event) => $options.cancelApplication(item, index), ["stop"])
                  }, " 取消申请 ", 8, ["onClick"])
                ])) : vue.createCommentVNode("v-if", true)
              ], 8, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])) : (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "empty-state"
        }, [
          vue.createElementVNode("text", { class: "empty-icon" }, "📋"),
          vue.createElementVNode("text", { class: "empty-text" }, "暂无申请记录"),
          vue.createElementVNode("text", { class: "empty-desc" }, "去岗位探索看看吧~"),
          vue.createElementVNode("button", {
            class: "go-btn",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.goToJobExplore && $options.goToJobExplore(...args))
          }, "去探索")
        ]))
      ])) : (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "loading-state"
      }, [
        vue.createElementVNode("text", { class: "loading-text" }, "加载中...")
      ]))
    ]);
  }
  const PagesMyApplicationsMyApplications = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__scopeId", "data-v-0ed30e59"], ["__file", "D:/计算机编程/A13/app端/pages/my-applications/my-applications.vue"]]);
  const _sfc_main$1 = {
    data() {
      return {
        isLoading: true,
        favoritesList: []
      };
    },
    onLoad() {
      this.loadFavorites();
    },
    onPullDownRefresh() {
      this.loadFavorites();
      setTimeout(() => {
        uni.stopPullDownRefresh();
      }, 1e3);
    },
    methods: {
      async loadFavorites() {
        this.isLoading = true;
        try {
          const res = await jobApi.getFavorites();
          if (res && res.data) {
            this.favoritesList = res.data;
          } else {
            this.favoritesList = this.getMockData();
          }
        } catch (err) {
          formatAppLog("error", "at pages/my-favorites/my-favorites.vue:86", err);
          this.favoritesList = this.getMockData();
        } finally {
          this.isLoading = false;
        }
      },
      getMockData() {
        return [
          {
            id: 1,
            title: "前端开发工程师",
            salary: "15-25K",
            company: "字节跳动",
            location: "北京",
            experience: "3-5年",
            education: "本科",
            tags: ["Vue", "React", "TypeScript"]
          },
          {
            id: 2,
            title: "后端开发工程师",
            salary: "20-35K",
            company: "阿里巴巴",
            location: "杭州",
            experience: "3-5年",
            education: "本科",
            tags: ["Java", "Spring", "MySQL"]
          },
          {
            id: 3,
            title: "算法工程师",
            salary: "30-50K",
            company: "腾讯",
            location: "深圳",
            experience: "3-5年",
            education: "硕士",
            tags: ["Python", "机器学习", "深度学习"]
          }
        ];
      },
      viewJobDetail(item) {
        uni.navigateTo({
          url: `/pages/job-detail/job-detail?id=${item.id}`
        });
      },
      async removeFavorite(item, index) {
        uni.showModal({
          title: "提示",
          content: "确定要取消收藏吗？",
          success: async (res) => {
            if (res.confirm) {
              try {
                uni.showLoading({ title: "处理中..." });
                await jobApi.removeFavorite(item.id);
                this.favoritesList.splice(index, 1);
                uni.showToast({
                  title: "已取消收藏",
                  icon: "success"
                });
              } catch (err) {
                formatAppLog("error", "at pages/my-favorites/my-favorites.vue:149", err);
                this.favoritesList.splice(index, 1);
                uni.showToast({
                  title: "已取消收藏",
                  icon: "success"
                });
              } finally {
                uni.hideLoading();
              }
            }
          }
        });
      },
      async applyJob(item) {
        try {
          uni.showLoading({ title: "申请中..." });
          await jobApi.applyJob(item.id);
          uni.showToast({
            title: "申请成功",
            icon: "success"
          });
        } catch (err) {
          formatAppLog("error", "at pages/my-favorites/my-favorites.vue:172", err);
          uni.showToast({
            title: "申请失败",
            icon: "none"
          });
        } finally {
          uni.hideLoading();
        }
      },
      goToJobExplore() {
        uni.switchTab({
          url: "/pages/job-explore/job-explore"
        });
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      !$data.isLoading ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "content-section"
      }, [
        $data.favoritesList.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "favorites-list"
        }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.favoritesList, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: index,
                class: "favorite-card",
                onClick: ($event) => $options.viewJobDetail(item)
              }, [
                vue.createElementVNode("view", { class: "card-header" }, [
                  vue.createElementVNode("view", { class: "job-info" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "job-title" },
                      vue.toDisplayString(item.title),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "job-salary" },
                      vue.toDisplayString(item.salary),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", {
                    class: "favorite-icon",
                    onClick: vue.withModifiers(($event) => $options.removeFavorite(item, index), ["stop"])
                  }, [
                    vue.createElementVNode("text", { class: "icon-text" }, "❤️")
                  ], 8, ["onClick"])
                ]),
                vue.createElementVNode(
                  "view",
                  { class: "job-company" },
                  vue.toDisplayString(item.company),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "job-meta" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "meta-item" },
                    vue.toDisplayString(item.location),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("text", { class: "meta-divider" }, "·"),
                  vue.createElementVNode(
                    "text",
                    { class: "meta-item" },
                    vue.toDisplayString(item.experience),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("text", { class: "meta-divider" }, "·"),
                  vue.createElementVNode(
                    "text",
                    { class: "meta-item" },
                    vue.toDisplayString(item.education),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "job-tags" }, [
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList(item.tags, (tag, i) => {
                      return vue.openBlock(), vue.createElementBlock(
                        "text",
                        {
                          key: i,
                          class: "tag"
                        },
                        vue.toDisplayString(tag),
                        1
                        /* TEXT */
                      );
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ]),
                vue.createElementVNode("view", { class: "card-actions" }, [
                  vue.createElementVNode("button", {
                    class: "action-btn apply-btn",
                    onClick: vue.withModifiers(($event) => $options.applyJob(item), ["stop"])
                  }, " 立即申请 ", 8, ["onClick"])
                ])
              ], 8, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])) : (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "empty-state"
        }, [
          vue.createElementVNode("text", { class: "empty-icon" }, "⭐"),
          vue.createElementVNode("text", { class: "empty-text" }, "暂无收藏"),
          vue.createElementVNode("text", { class: "empty-desc" }, "去岗位探索收藏心仪的岗位吧~"),
          vue.createElementVNode("button", {
            class: "go-btn",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.goToJobExplore && $options.goToJobExplore(...args))
          }, "去探索")
        ]))
      ])) : (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "loading-state"
      }, [
        vue.createElementVNode("text", { class: "loading-text" }, "加载中...")
      ]))
    ]);
  }
  const PagesMyFavoritesMyFavorites = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-98a552f5"], ["__file", "D:/计算机编程/A13/app端/pages/my-favorites/my-favorites.vue"]]);
  __definePage("pages/login/login", PagesLoginLogin);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/ai-assistant/ai-assistant", PagesAiAssistantAiAssistant);
  __definePage("pages/job-explore/job-explore", PagesJobExploreJobExplore);
  __definePage("pages/student-profile/student-profile", PagesStudentProfileStudentProfile);
  __definePage("pages/user-center/user-center", PagesUserCenterUserCenter);
  __definePage("pages/job-detail/job-detail", PagesJobDetailJobDetail);
  __definePage("pages/upload-resume/upload-resume", PagesUploadResumeUploadResume);
  __definePage("pages/edit-profile/edit-profile", PagesEditProfileEditProfile);
  __definePage("pages/career-plan/career-plan", PagesCareerPlanCareerPlan);
  __definePage("pages/interview-prep/interview-prep", PagesInterviewPrepInterviewPrep);
  __definePage("pages/my-applications/my-applications", PagesMyApplicationsMyApplications);
  __definePage("pages/my-favorites/my-favorites", PagesMyFavoritesMyFavorites);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:4", "App Launch");
      const token = uni.getStorageSync("token");
      if (!token) {
        uni.reLaunch({
          url: "/pages/login/login"
        });
      }
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:16", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:19", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "D:/计算机编程/A13/app端/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    app.config.globalProperties.$baseUrl = "http://localhost:8000";
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
