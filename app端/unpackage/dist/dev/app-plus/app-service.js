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
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$6 = {
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
          const res = await uni.request({
            url: "http://10.216.82.205:8000/auth/captcha",
            method: "GET",
            responseType: "arraybuffer"
          });
          if (res.statusCode === 200) {
            const base64 = uni.arrayBufferToBase64(res.data);
            this.captchaUrl = "data:image/png;base64," + base64;
            this.captchaId = res.header["x-captcha-id"] || "";
          }
        } catch (e) {
          formatAppLog("error", "at pages/login/login.vue:208", "验证码错误", e);
        }
      },
      async handleLogin() {
        var _a;
        if (!this.loginForm.username || !this.loginForm.password || !this.loginForm.captcha) {
          uni.showToast({ title: "请完善信息", icon: "none" });
          return;
        }
        if (!this.captchaId) {
          uni.showToast({ title: "验证码异常，请刷新", icon: "none" });
          return;
        }
        this.isLoading = true;
        try {
          const res = await uni.request({
            url: "http://10.216.82.205:8000/auth/login",
            method: "POST",
            header: {
              "Content-Type": "application/json"
            },
            data: {
              username: this.loginForm.username,
              password: this.loginForm.password,
              captcha: this.loginForm.captcha,
              captchaId: this.captchaId
            }
          });
          formatAppLog("log", "at pages/login/login.vue:239", "登录返回：", res);
          if (res.statusCode === 200 || res.data.code === 0) {
            uni.showToast({ title: "登录成功", icon: "success" });
            setTimeout(() => {
              uni.navigateTo({ url: "/pages/index/index" });
            }, 1e3);
          } else {
            uni.showToast({
              title: ((_a = res.data) == null ? void 0 : _a.msg) || "登录失败",
              icon: "none"
            });
          }
        } catch (err) {
          formatAppLog("error", "at pages/login/login.vue:253", err);
          uni.showToast({ title: "登录失败", icon: "none" });
        } finally {
          this.isLoading = false;
        }
      },
      async handleRegister() {
        if (this.registerForm.password !== this.registerForm.confirmPassword) {
          uni.showToast({ title: "两次密码不一致", icon: "none" });
          return;
        }
        this.isLoading = true;
        try {
          const res = await uni.request({
            url: "http://10.216.82.205:8000/auth/register",
            method: "POST",
            header: {
              "Content-Type": "application/json"
            },
            data: {
              username: this.registerForm.username,
              email: this.registerForm.email,
              name: this.registerForm.name,
              password: this.registerForm.password
            }
          });
          if (res.statusCode === 200) {
            uni.showToast({ title: "注册成功" });
            this.isLoginMode = true;
          } else {
            uni.showToast({ title: "注册失败", icon: "none" });
          }
        } catch (err) {
          formatAppLog("error", "at pages/login/login.vue:290", err);
          uni.showToast({ title: "注册失败", icon: "none" });
        } finally {
          this.isLoading = false;
        }
      }
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
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
  const PagesLoginLogin = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__scopeId", "data-v-e4e4508d"], ["__file", "D:/计算机编程/A13/app端/pages/login/login.vue"]]);
  const BASE_URL = "http://localhost:8000";
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
      return data;
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
    } else if (statusCode === 403) {
      uni.showToast({
        title: "没有权限执行此操作",
        icon: "none"
      });
    } else if (statusCode === 404) {
      uni.showToast({
        title: "请求的资源不存在",
        icon: "none"
      });
    } else if (statusCode === 500) {
      uni.showToast({
        title: "服务器内部错误",
        icon: "none"
      });
    }
    return Promise.reject(response);
  }
  function request(options) {
    return new Promise((resolve, reject) => {
      const finalOptions = requestInterceptor({
        ...options,
        url: BASE_URL + options.url
      });
      uni.request({
        ...finalOptions,
        success: (res) => {
          try {
            const result = responseInterceptor(res, finalOptions);
            resolve(result);
          } catch (err) {
            reject(err);
          }
        },
        fail: (err) => {
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
      return request({
        url,
        method: "GET",
        data,
        ...options
      });
    },
    post(url, data = {}, options = {}) {
      return request({
        url,
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
      return request({
        url,
        method: "DELETE",
        data,
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
      return uni.request({
        url: "http://localhost:8000/auth/captcha",
        method: "GET",
        responseType: "arraybuffer"
      });
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
    // 获取当前用户信息
    getCurrentUser() {
      return request$1.get("/auth/me");
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
        const { token: accessToken, user: userData } = response;
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
        const response = await userApi.getCurrentUser();
        this.state.user = response;
        uni.setStorageSync("user", JSON.stringify(response));
      } catch (err) {
        formatAppLog("error", "at stores/user.js:91", "获取用户信息失败:", err);
      }
    }
  };
  const _sfc_main$5 = {
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
      }
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
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
            onClick: _cache[3] || (_cache[3] = ($event) => $options.navigateTo("/pages/user-center/user-center"))
          }, [
            vue.createElementVNode("view", { class: "action-icon user-icon" }, "⚙️"),
            vue.createElementVNode("text", { class: "action-text" }, "个人中心")
          ])
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
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__scopeId", "data-v-1cf27b2a"], ["__file", "D:/计算机编程/A13/app端/pages/index/index.vue"]]);
  const jobApi = {
    // 获取岗位列表
    getJobList(params = {}) {
      return request$1.get("/jobs", params);
    },
    // 获取岗位详情
    getJobDetail(id) {
      return request$1.get(`/jobs/${id}`);
    },
    // 申请岗位
    applyJob(jobId) {
      return request$1.post(`/jobs/${jobId}/apply`);
    },
    // 收藏岗位
    favoriteJob(jobId) {
      return request$1.post(`/jobs/${jobId}/favorite`);
    },
    // 获取知识图谱
    getJobGraph(jobId) {
      return request$1.get(`/jobs/${jobId}/graph`);
    }
  };
  const _sfc_main$4 = {
    data() {
      return {
        searchKeyword: "",
        activeFilter: 0,
        filters: ["全部", "前端", "后端", "算法", "产品", "运营"],
        jobList: []
      };
    },
    onLoad() {
      this.loadJobList();
    },
    onPullDownRefresh() {
      this.loadJobList();
      setTimeout(() => {
        uni.stopPullDownRefresh();
      }, 1e3);
    },
    methods: {
      async loadJobList() {
        try {
          const data = await jobApi.getJobList();
          if (data && Array.isArray(data)) {
            this.jobList = data;
          }
        } catch (error) {
          formatAppLog("error", "at pages/job-explore/job-explore.vue:92", "加载岗位列表失败:", error);
          this.jobList = this.getMockJobs();
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
      handleSearch() {
        uni.showToast({
          title: "搜索功能开发中",
          icon: "none"
        });
      },
      viewJobDetail(job) {
        uni.showToast({
          title: "查看岗位详情",
          icon: "none"
        });
      }
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "search-section" }, [
        vue.createElementVNode("view", { class: "search-bar" }, [
          vue.createElementVNode("text", { class: "search-icon" }, "🔍"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.searchKeyword = $event),
              class: "search-input",
              placeholder: "搜索岗位名称...",
              onConfirm: _cache[1] || (_cache[1] = (...args) => $options.handleSearch && $options.handleSearch(...args))
            },
            null,
            544
            /* NEED_HYDRATION, NEED_PATCH */
          ), [
            [vue.vModelText, $data.searchKeyword]
          ])
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
                onClick: ($event) => $data.activeFilter = index
              }, vue.toDisplayString(filter), 11, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ]),
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
                  vue.renderList(job.tags || [], (tag, i) => {
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
      ])) : (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "empty-state"
      }, [
        vue.createElementVNode("text", { class: "empty-icon" }, "📭"),
        vue.createElementVNode("text", { class: "empty-text" }, "暂无岗位数据"),
        vue.createElementVNode("text", { class: "empty-desc" }, "请确保后端服务已启动")
      ]))
    ]);
  }
  const PagesJobExploreJobExplore = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__scopeId", "data-v-71ef44db"], ["__file", "D:/计算机编程/A13/app端/pages/job-explore/job-explore.vue"]]);
  const _sfc_main$3 = {
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
        uni.chooseMessageFile({
          count: 1,
          type: "file",
          success: (res) => {
            uni.showToast({
              title: "简历上传成功",
              icon: "success"
            });
          }
        });
      },
      editProfile() {
        uni.showToast({
          title: "编辑功能开发中",
          icon: "none"
        });
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
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
  const PagesStudentProfileStudentProfile = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__scopeId", "data-v-c6fc90ce"], ["__file", "D:/计算机编程/A13/app端/pages/student-profile/student-profile.vue"]]);
  const _sfc_main$2 = {
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
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
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
  const PagesCareerPlanCareerPlan = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__scopeId", "data-v-f0b5c96f"], ["__file", "D:/计算机编程/A13/app端/pages/career-plan/career-plan.vue"]]);
  const _sfc_main$1 = {
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
        uni.showToast({
          title: "功能开发中",
          icon: "none"
        });
      },
      viewMyFavorites() {
        uni.showToast({
          title: "功能开发中",
          icon: "none"
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
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
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
          onClick: _cache[3] || (_cache[3] = (...args) => $options.editSettings && $options.editSettings(...args))
        }, [
          vue.createElementVNode("text", { class: "menu-icon" }, "⚙️"),
          vue.createElementVNode("text", { class: "menu-text" }, "设置"),
          vue.createElementVNode("text", { class: "menu-arrow" }, "›")
        ]),
        vue.createElementVNode("view", {
          class: "menu-item",
          onClick: _cache[4] || (_cache[4] = (...args) => $options.viewAbout && $options.viewAbout(...args))
        }, [
          vue.createElementVNode("text", { class: "menu-icon" }, "ℹ️"),
          vue.createElementVNode("text", { class: "menu-text" }, "关于我们"),
          vue.createElementVNode("text", { class: "menu-arrow" }, "›")
        ]),
        vue.createElementVNode("view", {
          class: "menu-item",
          onClick: _cache[5] || (_cache[5] = (...args) => $options.contactSupport && $options.contactSupport(...args))
        }, [
          vue.createElementVNode("text", { class: "menu-icon" }, "💬"),
          vue.createElementVNode("text", { class: "menu-text" }, "联系客服"),
          vue.createElementVNode("text", { class: "menu-arrow" }, "›")
        ])
      ]),
      vue.createElementVNode("view", { class: "logout-section" }, [
        vue.createElementVNode("button", {
          class: "logout-btn",
          onClick: _cache[6] || (_cache[6] = (...args) => $options.handleLogout && $options.handleLogout(...args))
        }, "退出登录")
      ])
    ]);
  }
  const PagesUserCenterUserCenter = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-5df2242c"], ["__file", "D:/计算机编程/A13/app端/pages/user-center/user-center.vue"]]);
  __definePage("pages/login/login", PagesLoginLogin);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/job-explore/job-explore", PagesJobExploreJobExplore);
  __definePage("pages/student-profile/student-profile", PagesStudentProfileStudentProfile);
  __definePage("pages/career-plan/career-plan", PagesCareerPlanCareerPlan);
  __definePage("pages/user-center/user-center", PagesUserCenterUserCenter);
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
