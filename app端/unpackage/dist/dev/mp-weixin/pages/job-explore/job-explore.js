"use strict";
const common_vendor = require("../../common/vendor.js");
const api_job = require("../../api/job.js");
const _sfc_main = {
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
      common_vendor.index.stopPullDownRefresh();
    }, 1e3);
  },
  methods: {
    async loadJobList() {
      try {
        const data = await api_job.jobApi.getJobList();
        if (data && Array.isArray(data)) {
          this.jobList = data;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/job-explore/job-explore.vue:92", "加载岗位列表失败:", error);
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
      common_vendor.index.showToast({
        title: "搜索功能开发中",
        icon: "none"
      });
    },
    viewJobDetail(job) {
      common_vendor.index.showToast({
        title: "查看岗位详情",
        icon: "none"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.handleSearch && $options.handleSearch(...args)),
    b: $data.searchKeyword,
    c: common_vendor.o(($event) => $data.searchKeyword = $event.detail.value),
    d: common_vendor.f($data.filters, (filter, index, i0) => {
      return {
        a: common_vendor.t(filter),
        b: index,
        c: $data.activeFilter === index ? 1 : "",
        d: common_vendor.o(($event) => $data.activeFilter = index, index)
      };
    }),
    e: $data.jobList.length > 0
  }, $data.jobList.length > 0 ? {
    f: common_vendor.f($data.jobList, (job, k0, i0) => {
      return {
        a: common_vendor.t(job.title || "岗位名称"),
        b: common_vendor.t(job.salary || "薪资面议"),
        c: common_vendor.t(job.company || "公司名称"),
        d: common_vendor.t(job.location || "地点"),
        e: common_vendor.t(job.experience || "经验不限"),
        f: common_vendor.t(job.education || "学历不限"),
        g: common_vendor.f(job.tags || [], (tag, i, i1) => {
          return {
            a: common_vendor.t(tag),
            b: i
          };
        }),
        h: job.id,
        i: common_vendor.o(($event) => $options.viewJobDetail(job), job.id)
      };
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-71ef44db"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/job-explore/job-explore.js.map
