"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
const _sfc_main = {
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
    const user = stores_user.useUserStore.state.user;
    if (user) {
      this.userName = user.username || user.name || "同学";
      this.userRole = user.role === "admin" ? "管理员" : "学生";
      this.initial = this.userName.charAt(0).toUpperCase();
    }
  },
  methods: {
    uploadResume() {
      common_vendor.index.chooseMessageFile({
        count: 1,
        type: "file",
        success: (res) => {
          common_vendor.index.showToast({
            title: "简历上传成功",
            icon: "success"
          });
        }
      });
    },
    editProfile() {
      common_vendor.index.showToast({
        title: "编辑功能开发中",
        icon: "none"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.initial),
    b: common_vendor.t($data.userName),
    c: common_vendor.t($data.userRole),
    d: common_vendor.f($data.steps, (step, index, i0) => {
      return {
        a: common_vendor.t(step.icon),
        b: common_vendor.t(step.text),
        c: index,
        d: index <= $data.currentStep ? 1 : "",
        e: index === $data.currentStep ? 1 : ""
      };
    }),
    e: common_vendor.o((...args) => $options.uploadResume && $options.uploadResume(...args)),
    f: common_vendor.o((...args) => $options.editProfile && $options.editProfile(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c6fc90ce"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/student-profile/student-profile.js.map
