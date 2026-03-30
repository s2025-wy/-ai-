"use strict";
const common_vendor = require("../../common/vendor.js");
const config_index = require("../../config/index.js");
const _sfc_main = {
  data() {
    return {
      selectedFile: null,
      isUploading: false
    };
  },
  methods: {
    chooseFile() {
      common_vendor.index.chooseMessageFile({
        count: 1,
        type: "file",
        extension: [".pdf", ".doc", ".docx"],
        success: (res) => {
          const file = res.tempFiles[0];
          this.selectedFile = file;
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/upload-resume/upload-resume.vue:76", "选择文件失败:", err);
          common_vendor.index.showToast({
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
        common_vendor.index.showToast({
          title: "请先选择文件",
          icon: "none"
        });
        return;
      }
      this.isUploading = true;
      try {
        common_vendor.index.showLoading({ title: "上传中..." });
        const uploadTask = common_vendor.index.uploadFile({
          url: config_index.appConfig.baseUrl + "/resume/upload",
          filePath: this.selectedFile.path,
          name: "file",
          success: (res) => {
            const data = JSON.parse(res.data);
            if (res.statusCode === 200) {
              common_vendor.index.showToast({
                title: "上传成功",
                icon: "success"
              });
              setTimeout(() => {
                common_vendor.index.navigateBack();
              }, 1500);
            } else {
              common_vendor.index.showToast({
                title: data.msg || "上传失败",
                icon: "none"
              });
            }
          },
          fail: (err) => {
            common_vendor.index.__f__("error", "at pages/upload-resume/upload-resume.vue:133", "上传失败:", err);
            common_vendor.index.showToast({
              title: "上传失败",
              icon: "none"
            });
          },
          complete: () => {
            this.isUploading = false;
            common_vendor.index.hideLoading();
          }
        });
        uploadTask.onProgressUpdate((res) => {
          common_vendor.index.__f__("log", "at pages/upload-resume/upload-resume.vue:146", "上传进度", res.progress);
        });
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/upload-resume/upload-resume.vue:150", err);
        this.isUploading = false;
        common_vendor.index.hideLoading();
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$data.selectedFile
  }, !$data.selectedFile ? {} : {}, {
    b: !$data.selectedFile
  }, !$data.selectedFile ? {} : {}, {
    c: !$data.selectedFile
  }, !$data.selectedFile ? {} : {}, {
    d: $data.selectedFile
  }, $data.selectedFile ? {
    e: common_vendor.t($data.selectedFile.name),
    f: common_vendor.t($options.formatFileSize($data.selectedFile.size)),
    g: common_vendor.o((...args) => $options.removeFile && $options.removeFile(...args))
  } : {}, {
    h: common_vendor.o((...args) => $options.chooseFile && $options.chooseFile(...args)),
    i: $data.selectedFile
  }, $data.selectedFile ? {
    j: common_vendor.t($data.isUploading ? "分析中..." : "开始分析"),
    k: $data.isUploading ? 1 : "",
    l: common_vendor.o((...args) => $options.uploadResume && $options.uploadResume(...args)),
    m: $data.isUploading
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-615e4326"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/upload-resume/upload-resume.js.map
