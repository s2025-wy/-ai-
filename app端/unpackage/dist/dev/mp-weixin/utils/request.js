"use strict";
const common_vendor = require("../common/vendor.js");
const BASE_URL = "http://localhost:8000";
function requestInterceptor(options) {
  const token = common_vendor.index.getStorageSync("token");
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
    common_vendor.index.showToast({
      title: "登录已过期，请重新登录",
      icon: "none"
    });
    common_vendor.index.removeStorageSync("token");
    common_vendor.index.removeStorageSync("user");
    setTimeout(() => {
      common_vendor.index.reLaunch({
        url: "/pages/login/login"
      });
    }, 1500);
  } else if (statusCode === 403) {
    common_vendor.index.showToast({
      title: "没有权限执行此操作",
      icon: "none"
    });
  } else if (statusCode === 404) {
    common_vendor.index.showToast({
      title: "请求的资源不存在",
      icon: "none"
    });
  } else if (statusCode === 500) {
    common_vendor.index.showToast({
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
    common_vendor.index.request({
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
        common_vendor.index.showToast({
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
      const token = common_vendor.index.getStorageSync("token");
      common_vendor.index.uploadFile({
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
exports.request = request$1;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/request.js.map
